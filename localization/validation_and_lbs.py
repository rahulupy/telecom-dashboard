"""
PS09 - Validation & LBS-only Processing

1. validate_against_ground_truth(): generic crosscheck module. Works with
   whatever column names the officials' output file uses -- just tell it
   which columns map to subscriber/timestamp/lat/lon. Computes standard
   positioning-accuracy metrics (mean, median, CEP50, CEP90) so you have
   a real, defensible accuracy number the moment the official file arrives.

2. process_lbs_track(): runs Kalman smoothing directly on LBS pings
   (which already have lat/lon) -- no tower DB / trilateration needed,
   so this can run today.
"""

import numpy as np
import pandas as pd

from real_data_pipeline import LocalProjector
from kalman_tracker import track_suspect


# =======================================================================
# 1. VALIDATION / CROSSCHECK MODULE
# =======================================================================

def haversine_distance_m(lat1, lon1, lat2, lon2):
    """Great-circle distance in meters between two lat/lon points."""
    R = 6_371_000
    phi1, phi2 = np.radians(lat1), np.radians(lat2)
    dphi = np.radians(lat2 - lat1)
    dlambda = np.radians(lon2 - lon1)
    a = np.sin(dphi / 2) ** 2 + np.cos(phi1) * np.cos(phi2) * np.sin(dlambda / 2) ** 2
    return 2 * R * np.arcsin(np.sqrt(a))


def validate_against_ground_truth(
    estimated_results,
    ground_truth_path,
    gt_subscriber_col="subscriber_id",
    gt_timestamp_col="timestamp",
    gt_lat_col="latitude",
    gt_lon_col="longitude",
    max_time_gap_seconds=30,
):
    """
    estimated_results: list of dicts from process_subscriber() / process_lbs_track()
                        -- must have subscriber_id, timestamp, latitude, longitude
    ground_truth_path: CSV from officials (format TBD -- adjust the gt_*_col
                        args once you see the real file's actual column names)
    max_time_gap_seconds: if the nearest ground-truth point is further than
                        this in time, that estimate is skipped (no fair
                        comparison available) rather than silently matched
                        to a stale point.

    Returns: (per_point_errors_df, summary_dict)
    """
    gt_df = pd.read_csv(ground_truth_path, dtype={gt_subscriber_col: str})
    gt_df[gt_timestamp_col] = pd.to_datetime(gt_df[gt_timestamp_col], utc=True)

    rows = []
    for est in estimated_results:
        sub_id = est["subscriber_id"]
        est_time = pd.to_datetime(est["timestamp"], utc=True)

        candidates = gt_df[gt_df[gt_subscriber_col] == sub_id].copy()
        if candidates.empty:
            continue

        candidates["time_diff"] = (candidates[gt_timestamp_col] - est_time).abs()
        nearest = candidates.loc[candidates["time_diff"].idxmin()]

        if nearest["time_diff"].total_seconds() > max_time_gap_seconds:
            continue

        error_m = haversine_distance_m(
            est["latitude"], est["longitude"],
            nearest[gt_lat_col], nearest[gt_lon_col],
        )

        rows.append({
            "subscriber_id": sub_id,
            "timestamp": est["timestamp"],
            "est_lat": est["latitude"],
            "est_lon": est["longitude"],
            "gt_lat": nearest[gt_lat_col],
            "gt_lon": nearest[gt_lon_col],
            "error_m": error_m,
            "confidence_radius_m": est.get("confidence_radius_m"),
        })

    if not rows:
        raise ValueError(
            "No estimates could be matched to ground truth within "
            f"{max_time_gap_seconds}s -- check subscriber_id values and "
            "timestamp alignment/timezone between the two datasets."
        )

    errors_df = pd.DataFrame(rows)
    errors = errors_df["error_m"].values

    summary = {
        "n_points_validated": len(errors),
        "mean_error_m": float(np.mean(errors)),
        "median_error_m": float(np.median(errors)),
        "cep50_m": float(np.percentile(errors, 50)),
        "cep90_m": float(np.percentile(errors, 90)),
        "max_error_m": float(np.max(errors)),
    }

    return errors_df, summary


def compare_baseline_vs_refined(single_tower_results, refined_results, ground_truth_path, **kwargs):
    """
    Convenience wrapper: runs validate_against_ground_truth() for both a
    naive single-tower baseline and your refined WLS+Kalman output, so you
    get the "before vs after" comparison number directly -- this is the
    exact metric the evaluation criteria ask for.
    """
    _, baseline_summary = validate_against_ground_truth(single_tower_results, ground_truth_path, **kwargs)
    _, refined_summary = validate_against_ground_truth(refined_results, ground_truth_path, **kwargs)

    improvement_pct = 100 * (1 - refined_summary["mean_error_m"] / baseline_summary["mean_error_m"])

    print("=== Baseline (single-tower) ===")
    for k, v in baseline_summary.items():
        print(f"  {k}: {v}")
    print("\n=== Refined (WLS + Kalman) ===")
    for k, v in refined_summary.items():
        print(f"  {k}: {v}")
    print(f"\nAccuracy improvement: {improvement_pct:.1f}% reduction in mean error")

    return baseline_summary, refined_summary, improvement_pct


# =======================================================================
# 2. LBS-ONLY PROCESSING (works today -- no tower DB needed)
# =======================================================================

def load_lbs_logs(csv_path):
    """
    Loads all_lbs.csv (msisdn, imsi, imei, timestamp, cell_id, latitude,
    longitude, operator). Already has lat/lon -- no trilateration needed.
    """
    df = pd.read_csv(csv_path, dtype={"msisdn": str})
    required = ["msisdn", "timestamp", "latitude", "longitude"]
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"all_lbs.csv missing required columns: {missing}")

    df["timestamp"] = pd.to_datetime(df["timestamp"], utc=True)
    df = df.sort_values(["msisdn", "timestamp"]).reset_index(drop=True)
    return df


def process_lbs_track(msisdn, lbs_df, projector=None):
    """
    Runs Kalman smoothing directly on a subscriber's LBS pings.
    No WLS multilateration needed -- LBS already gives lat/lon per ping.

    Returns: list of dicts {subscriber_id, timestamp, latitude, longitude,
             confidence_radius_m} -- same output shape as process_subscriber(),
             so it plugs into validate_against_ground_truth() and Member 4's
             visualization identically.
    """
    sub_df = lbs_df[lbs_df["msisdn"] == msisdn].sort_values("timestamp")
    if sub_df.empty:
        return []

    if projector is None:
        projector = LocalProjector(sub_df["longitude"].mean(), sub_df["latitude"].mean())

    fixes = []
    prev_time = None
    for _, row in sub_df.iterrows():
        x, y = projector.to_xy(row["latitude"], row["longitude"])
        dt = 1.0
        if prev_time is not None:
            dt = max((row["timestamp"] - prev_time).total_seconds(), 0.1)
        prev_time = row["timestamp"]

        # LBS pings are network-resolved positions, generally more precise
        # than a raw tower-sector wedge -- use a smaller default residual
        # (higher confidence) than a WLS fallback fix would get.
        fixes.append({"x": x, "y": y, "dt": dt, "residual": 15.0})

    smoothed = track_suspect(fixes)

    results = []
    for (_, row), fix in zip(sub_df.iterrows(), smoothed):
        lat, lon = projector.to_latlon(fix["x"], fix["y"])
        results.append({
            "subscriber_id": msisdn,
            "timestamp": row["timestamp"].isoformat(),
            "latitude": lat,
            "longitude": lon,
            "confidence_radius_m": round(fix["confidence_radius_m"], 1),
        })
    return results


# =======================================================================
# 3. SELF-TEST
# =======================================================================

if __name__ == "__main__":
    import datetime

    # --- Simulate an LBS dataset for one subscriber (mimics all_lbs.csv) ---
    np.random.seed(3)
    base_time = datetime.datetime(2026, 3, 24, 0, 0, 0, tzinfo=datetime.timezone.utc)
    true_lat, true_lon = 22.2676, 70.7875
    proj = LocalProjector(true_lon, true_lat)
    ox, oy = proj.to_xy(true_lat, true_lon)

    rows = []
    for i in range(10):
        tx, ty = ox + i * 40, oy + i * 25  # walking path
        noisy_x = tx + np.random.normal(0, 20)
        noisy_y = ty + np.random.normal(0, 20)
        lat, lon = proj.to_latlon(noisy_x, noisy_y)
        rows.append({
            "msisdn": "918980261614", "imsi": "404051650035282", "imei": "",
            "timestamp": (base_time + datetime.timedelta(minutes=5 * i)).isoformat(),
            "cell_id": "404-05-60440", "latitude": lat, "longitude": lon, "operator": "Vi",
        })
    pd.DataFrame(rows).to_csv("demo_lbs.csv", index=False)

    # --- Simulate the "official ground truth" output file ---
    gt_rows = []
    for i in range(10):
        tx, ty = ox + i * 40, oy + i * 25
        lat, lon = proj.to_latlon(tx, ty)
        gt_rows.append({
            "subscriber_id": "918980261614",
            "timestamp": (base_time + datetime.timedelta(minutes=5 * i)).isoformat(),
            "latitude": lat, "longitude": lon,
        })
    pd.DataFrame(gt_rows).to_csv("demo_official_ground_truth.csv", index=False)

    # --- Run the actual pipeline pieces ---
    lbs_df = load_lbs_logs("demo_lbs.csv")
    results = process_lbs_track("918980261614", lbs_df)

    errors_df, summary = validate_against_ground_truth(
        results, "demo_official_ground_truth.csv"
    )

    print("Per-point validation:")
    print(errors_df[["timestamp", "error_m", "confidence_radius_m"]].to_string(index=False))
    print("\nSummary:")
    for k, v in summary.items():
        print(f"  {k}: {v}")
