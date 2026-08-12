"""
PS09 - Real Data Pipeline
Loads real CSV datasets (tower master DB + CDR/ping logs), converts
lat/lon <-> local meters, derives distance from TA/RTT, runs WLS
multilateration + Kalman smoothing, and exports results in the format
Member 4 (Visualization) needs.

Requires: wls_multilateration.py and kalman_tracker.py in the same folder.

CSV schemas expected (see PS09_dataset_requirements.md):

tower_master.csv:
    tower_id, site_id, latitude, longitude, azimuth_deg, beamwidth_deg,
    max_range_m, operator, lac_tac

cdr_logs.csv:
    subscriber_id, timestamp, tower_id, cgi, technology, ta, rtt, rsrp
"""

import numpy as np
import pandas as pd
from pyproj import Transformer, CRS

from wls_multilateration import wls_multilaterate, single_tower_fallback
from kalman_tracker import track_suspect


# =======================================================================
# 1. LAT/LON <-> LOCAL METERS CONVERSION
# =======================================================================

def get_utm_epsg(lon, lat):
    """Pick the correct UTM zone EPSG code for a given lon/lat, so all
    distance math happens in meters, not degrees."""
    zone = int((lon + 180) / 6) + 1
    if lat >= 0:
        return 32600 + zone  # Northern hemisphere
    else:
        return 32700 + zone  # Southern hemisphere


class LocalProjector:
    """
    Converts between WGS84 lat/lon and a local flat UTM coordinate system
    (meters). The UTM zone is fixed based on the tower dataset's centroid,
    so all towers/pings in one project area share one consistent grid.
    """

    def __init__(self, reference_lon, reference_lat):
        epsg_code = get_utm_epsg(reference_lon, reference_lat)
        self.crs_utm = CRS.from_epsg(epsg_code)
        self.crs_wgs84 = CRS.from_epsg(4326)
        self._to_utm = Transformer.from_crs(self.crs_wgs84, self.crs_utm, always_xy=True)
        self._to_wgs84 = Transformer.from_crs(self.crs_utm, self.crs_wgs84, always_xy=True)

    def to_xy(self, lat, lon):
        x, y = self._to_utm.transform(lon, lat)
        return x, y

    def to_latlon(self, x, y):
        lon, lat = self._to_wgs84.transform(x, y)
        return lat, lon


# =======================================================================
# 2. TA / RTT -> DISTANCE CONVERSION
# =======================================================================

# Meters per Timing-Advance unit, by network generation.
TA_METERS_PER_UNIT = {
    "2G": 554.0,   # GSM: 1 TA unit ~= 3.7us round trip ~= 554m
    "GSM": 554.0,
    "3G": 234.0,   # WCDMA TA step (approx, chipping-rate based)
    "4G": 78.0,    # LTE: 1 TA unit ~= 78m
    "LTE": 78.0,
    "5G": 39.0,    # NR: finer granularity, roughly half of LTE (approx)
}

SPEED_OF_LIGHT = 299_792_458  # m/s


def ta_to_distance(ta, technology):
    """Convert Timing Advance value to estimated distance in meters."""
    meters_per_unit = TA_METERS_PER_UNIT.get(str(technology).upper(), 78.0)
    return ta * meters_per_unit


def rtt_to_distance(rtt_microseconds):
    """Convert RTT (microseconds) to estimated distance in meters."""
    rtt_seconds = rtt_microseconds * 1e-6
    return (rtt_seconds * SPEED_OF_LIGHT) / 2.0


def estimate_distance(row):
    """
    Given a CDR row (dict-like with optional 'ta'/'rtt'/'technology'),
    return the best available distance estimate, or None if neither
    TA nor RTT is present.
    """
    ta = row.get("ta")
    rtt = row.get("rtt")
    technology = row.get("technology", "4G")

    if pd.notna(ta):
        return ta_to_distance(float(ta), technology)
    elif pd.notna(rtt):
        return rtt_to_distance(float(rtt))
    else:
        return None  # caller should fall back to sector-centroid estimate


# =======================================================================
# 3. CSV LOADERS
# =======================================================================

def load_tower_master_db(csv_path, projector=None):
    """
    Loads tower_master.csv and returns a dict: tower_id -> tower info,
    with local x/y added (for the WLS engine) alongside original lat/lon
    (for Member 4's map display).

    If projector is None, one is built automatically from the data's
    own centroid.
    """
    df = pd.read_csv(csv_path)
    required_cols = ["tower_id", "latitude", "longitude", "azimuth_deg"]
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        raise ValueError(f"tower_master.csv is missing required columns: {missing}")

    if projector is None:
        projector = LocalProjector(df["longitude"].mean(), df["latitude"].mean())

    tower_lookup = {}
    for _, row in df.iterrows():
        x, y = projector.to_xy(row["latitude"], row["longitude"])
        tower_lookup[row["tower_id"]] = {
            "tower_id": row["tower_id"],
            "site_id": row.get("site_id", row["tower_id"]),
            "latitude": row["latitude"],
            "longitude": row["longitude"],
            "x": x,
            "y": y,
            "azimuth_deg": row["azimuth_deg"],
            "beamwidth_deg": row.get("beamwidth_deg", 65.0) if pd.notna(row.get("beamwidth_deg", 65.0)) else 65.0,
            "max_range_m": row.get("max_range_m", 1000.0) if pd.notna(row.get("max_range_m", 1000.0)) else 1000.0,
            "operator": row.get("operator", None),
        }
    return tower_lookup, projector


def load_cdr_logs(csv_path):
    """
    Loads cdr_logs.csv, parses timestamps, and computes estimated_distance_m
    per row using TA/RTT. Returns a DataFrame sorted by subscriber + time.
    """
    df = pd.read_csv(csv_path)
    required_cols = ["subscriber_id", "timestamp", "tower_id"]
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        raise ValueError(f"cdr_logs.csv is missing required columns: {missing}")

    df["timestamp"] = pd.to_datetime(df["timestamp"], utc=True)
    df["estimated_distance_m"] = df.apply(estimate_distance, axis=1)
    df = df.sort_values(["subscriber_id", "timestamp"]).reset_index(drop=True)
    return df


# =======================================================================
# 4. GROUP PINGS INTO TIME STEPS
# =======================================================================

def group_pings_into_steps(cdr_df, subscriber_id, window_seconds=10):
    """
    Groups a subscriber's CDR rows into time-windowed "steps" -- pings
    that occurred close together in time are treated as one localization
    fix (since multiple towers detecting the same phone won't have
    identical timestamps down to the millisecond).

    Returns: list of steps, each a list of ping dicts
             {"tower_id", "estimated_distance_m"}, plus the step's
             representative timestamp.
    """
    sub_df = cdr_df[cdr_df["subscriber_id"] == subscriber_id].copy()
    if sub_df.empty:
        return []

    sub_df = sub_df.sort_values("timestamp")
    steps = []
    current_step = []
    current_start = None

    for _, row in sub_df.iterrows():
        if current_start is None:
            current_start = row["timestamp"]

        if (row["timestamp"] - current_start).total_seconds() > window_seconds:
            if current_step:
                steps.append(current_step)
            current_step = []
            current_start = row["timestamp"]

        ping = {
            "tower_id": row["tower_id"],
            "estimated_distance_m": row["estimated_distance_m"],
            "timestamp": row["timestamp"],
        }
        current_step.append(ping)

    if current_step:
        steps.append(current_step)

    return steps


# =======================================================================
# 5. FULL PIPELINE: real CSVs -> WLS -> Kalman -> lat/lon results
# =======================================================================

def process_subscriber(subscriber_id, cdr_df, tower_lookup, projector,
                        window_seconds=10):
    """
    Runs the full localization pipeline for one subscriber and returns
    a list of results ready for Member 4's visualization module:
        {timestamp, latitude, longitude, confidence_radius_m,
         num_towers_used, method}
    """
    steps = group_pings_into_steps(cdr_df, subscriber_id, window_seconds)

    fixes_for_kalman = []
    step_metadata = []
    prev_fix = None

    for step in steps:
        # Drop pings where distance couldn't be estimated (no TA/RTT) --
        # fall back to sector-centroid-only for those individually.
        usable_pings = [p for p in step if p["estimated_distance_m"] is not None]
        n_available = len(usable_pings)

        if n_available >= 2:
            x, y, resid = wls_multilaterate(usable_pings, tower_lookup, initial_guess=prev_fix)
            method = "wls_multilateration"
        elif n_available == 1:
            x, y, resid = single_tower_fallback(usable_pings, tower_lookup)
            method = "single_tower_fallback"
        else:
            # No usable distance data at all this step -- skip, or use
            # sector-centroid of whichever towers reported (lowest confidence).
            if not step:
                continue
            t = tower_lookup.get(step[0]["tower_id"])
            if t is None:
                continue
            x, y, resid = t["x"], t["y"], t.get("max_range_m", 1000.0)
            method = "sector_only_fallback"

        prev_fix = np.array([x, y])
        avg_timestamp = step[len(step) // 2]["timestamp"]

        dt = 1.0
        if step_metadata:
            dt = max((avg_timestamp - step_metadata[-1]["timestamp"]).total_seconds(), 0.1)

        fixes_for_kalman.append({"x": x, "y": y, "dt": dt, "residual": resid})
        step_metadata.append({"timestamp": avg_timestamp, "num_towers_used": n_available, "method": method})

    if not fixes_for_kalman:
        return []

    smoothed = track_suspect(fixes_for_kalman)

    results = []
    for meta, fix in zip(step_metadata, smoothed):
        lat, lon = projector.to_latlon(fix["x"], fix["y"])
        results.append({
            "subscriber_id": subscriber_id,
            "timestamp": meta["timestamp"].isoformat(),
            "latitude": lat,
            "longitude": lon,
            "confidence_radius_m": round(fix["confidence_radius_m"], 1),
            "num_towers_used": meta["num_towers_used"],
            "method": meta["method"],
        })
    return results


# =======================================================================
# 6. EXPORT FOR MEMBER 4 (VISUALIZATION)
# =======================================================================

def export_for_visualization(results, tower_lookup, output_prefix="ps09_output"):
    """
    Writes two CSVs Member 4 can load directly:
      - {output_prefix}_movement_track.csv : subscriber's estimated path
      - {output_prefix}_towers.csv         : tower locations for map markers
    """
    track_df = pd.DataFrame(results)
    track_path = f"{output_prefix}_movement_track.csv"
    track_df.to_csv(track_path, index=False)

    towers_df = pd.DataFrame([
        {
            "tower_id": t["tower_id"],
            "site_id": t["site_id"],
            "latitude": t["latitude"],
            "longitude": t["longitude"],
            "azimuth_deg": t["azimuth_deg"],
            "operator": t["operator"],
        }
        for t in tower_lookup.values()
    ])
    towers_path = f"{output_prefix}_towers.csv"
    towers_df.to_csv(towers_path, index=False)

    return track_path, towers_path


# =======================================================================
# 7. DEMO DATASET GENERATOR (synthetic, until real data arrives)
# =======================================================================

def generate_demo_dataset(reference_lon=75.7873, reference_lat=26.9124,
                           n_sites=25, area_size_m=2500,
                           tower_csv_path="demo_tower_master.csv",
                           cdr_csv_path="demo_cdr_logs.csv",
                           subscriber_id="hashed_demo_001"):
    """
    Generates a synthetic tower_master.csv + cdr_logs.csv pair, in the
    EXACT schema real data will use, anchored to real-world coordinates
    (default: Jaipur). This lets the whole pipeline -- and Member 4's
    dashboard -- be built and tested end-to-end before real datasets
    arrive from Harsh / Member 2. Swap these two CSVs for the real ones
    later; no other code needs to change.
    """
    from wls_multilateration import generate_tower_grid, simulate_pings
    import datetime

    towers = generate_tower_grid(n_sites=n_sites, area_size_m=area_size_m, seed=1)
    true_path = [(600 + 130 * t, 700 + 90 * t) for t in range(12)]
    ping_steps = simulate_pings(towers, true_path, ta_noise_std=25.0, seed=2)

    projector = LocalProjector(reference_lon=reference_lon, reference_lat=reference_lat)
    # generate_tower_grid() produces small relative x/y (0-2500m), not real
    # UTM eastings/northings -- offset them by a real-world UTM origin so
    # the lat/lon conversion produces sensible, real-world coordinates.
    origin_x, origin_y = projector.to_xy(reference_lat, reference_lon)

    tower_rows = []
    for t in towers:
        lat, lon = projector.to_latlon(origin_x + t["x"], origin_y + t["y"])
        tower_rows.append({
            "tower_id": t["tower_id"], "site_id": t["site_id"],
            "latitude": lat, "longitude": lon,
            "azimuth_deg": t["azimuth_deg"], "beamwidth_deg": t["beamwidth_deg"],
            "max_range_m": t["max_range_m"], "operator": "Airtel", "lac_tac": "4521",
        })
    pd.DataFrame(tower_rows).to_csv(tower_csv_path, index=False)

    base_time = datetime.datetime(2026, 3, 14, 18, 0, 0, tzinfo=datetime.timezone.utc)
    cdr_rows = []
    for step_idx, pings in enumerate(ping_steps):
        ts = base_time + datetime.timedelta(seconds=step_idx * 15)
        for p in pings:
            tech = "4G"
            ta_value = round(p["estimated_distance_m"] / TA_METERS_PER_UNIT[tech])
            cdr_rows.append({
                "subscriber_id": subscriber_id,
                "timestamp": ts.isoformat(),
                "tower_id": p["tower_id"],
                "cgi": p["tower_id"],
                "technology": tech,
                "ta": ta_value,
                "rtt": None,
                "rsrp": None,
            })
    pd.DataFrame(cdr_rows).to_csv(cdr_csv_path, index=False)

    return tower_csv_path, cdr_csv_path, subscriber_id


# =======================================================================
# 8. RUN: synthetic data -> full pipeline -> Member 4-ready CSVs
# =======================================================================

if __name__ == "__main__":
    tower_csv, cdr_csv, subscriber_id = generate_demo_dataset()

    # From here, this runs IDENTICALLY whether the CSVs are synthetic
    # (as now) or real (once Harsh/Member 2 deliver actual data).
    tower_lookup, projector = load_tower_master_db(tower_csv)
    cdr_df = load_cdr_logs(cdr_csv)

    results = process_subscriber(subscriber_id, cdr_df, tower_lookup, projector,
                                  window_seconds=10)

    track_path, towers_path = export_for_visualization(results, tower_lookup)

    print(f"Processed {len(results)} location fixes for {subscriber_id}.")
    print(f"Movement track exported to: {track_path}  <- give this to Member 4")
    print(f"Tower locations exported to: {towers_path}  <- give this to Member 4")
    print("\nSample output row:")
    for k, v in results[len(results) // 2].items():
        print(f"  {k}: {v}")

