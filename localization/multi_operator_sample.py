"""
PS09 - Multi-Operator Sample Dataset for Multilateration Demo

The real data (CDR baseline for 919877535365) can only demonstrate the
single-tower BASELINE problem -- only one operator's cell touches per
call, no simultaneous multi-tower pings. This script generates a sample
dataset (clearly flagged as SAMPLE, not real) that demonstrates the
actual refined solution: multiple towers across Jio/Airtel/Vi
simultaneously detecting the same target, enabling real WLS
multilateration + Kalman smoothing.

Anchored to Surat (same area as your real data) for geographic
consistency with the rest of your demo.
"""

import numpy as np
import pandas as pd
import datetime

from real_data_pipeline import LocalProjector, TA_METERS_PER_UNIT
from wls_multilateration import wls_multilaterate, single_tower_fallback
from kalman_tracker import track_suspect

OPERATORS = ["Jio", "Airtel", "Vi"]
TECH_BY_OPERATOR = {"Jio": "4G", "Airtel": "4G", "Vi": "3G"}

# Same Surat anchor used throughout (SVNIT), so this sample sits in the
# same real-world area as your CCTV junctions and real subscriber data.
REFERENCE_LAT, REFERENCE_LON = 21.1646, 72.7852


def generate_multi_operator_tower_grid(n_sites=18, area_size_m=2500, seed=7):
    """
    Generates tower sites, each independently owned by one of
    Jio/Airtel/Vi (mirrors real deployment -- operators build separate
    tower infrastructure, occasionally co-locating but not sharing).
    3 sectors per site, standard real-world layout.
    """
    rng = np.random.default_rng(seed)
    towers = []
    sector_offsets = [0, 120, 240]

    for i in range(n_sites):
        operator = OPERATORS[i % len(OPERATORS)]  # even spread across 3 operators
        x = rng.uniform(0, area_size_m)
        y = rng.uniform(0, area_size_m)
        site_rotation = rng.uniform(0, 360)
        max_range = rng.uniform(700, 1200)

        for j, offset in enumerate(sector_offsets):
            towers.append({
                "tower_id": f"{operator[:3].upper()}{i:03d}S{j}",
                "site_id": f"{operator[:3].upper()}{i:03d}",
                "operator": operator,
                "x": x,
                "y": y,
                "azimuth_deg": (site_rotation + offset) % 360,
                "beamwidth_deg": 65.0,
                "max_range_m": max_range,
            })
    return towers


def simulate_multi_operator_pings(towers, true_path, ta_noise_std=25.0,
                                   detect_radius_m=900, seed=8):
    """
    Same sector+range detection logic as before, but towers now belong
    to 3 different operators -- so each step realistically shows a MIX
    of Jio/Airtel/Vi towers detecting the target simultaneously, exactly
    what real multi-operator surveillance would need to combine.
    """
    rng = np.random.default_rng(seed)

    def bearing_deg(from_xy, to_xy):
        dx, dy = to_xy[0] - from_xy[0], to_xy[1] - from_xy[1]
        return (np.degrees(np.arctan2(dx, dy))) % 360

    def angular_diff(a, b):
        d = abs(a - b) % 360
        return min(d, 360 - d)

    all_steps = []
    for (tx, ty) in true_path:
        pings = []
        for t in towers:
            true_dist = np.hypot(tx - t["x"], ty - t["y"])
            bearing = bearing_deg((t["x"], t["y"]), (tx, ty))
            diff = angular_diff(bearing, t["azimuth_deg"])
            within_sector = diff <= (t["beamwidth_deg"] / 2.0)

            if true_dist <= detect_radius_m and within_sector:
                noisy_dist = true_dist + rng.normal(0, ta_noise_std)
                pings.append({
                    "tower_id": t["tower_id"],
                    "operator": t["operator"],
                    "estimated_distance_m": max(noisy_dist, 10.0),
                })
        if len(pings) > 6:
            pings = list(rng.choice(pings, size=6, replace=False))
        all_steps.append(pings)
    return all_steps


def build_multi_operator_sample(output_prefix="sample_multilateration"):
    towers = generate_multi_operator_tower_grid()
    tower_lookup = {t["tower_id"]: t for t in towers}

    # Sample suspect path through Surat, same area as your real data
    true_path = [(600 + 130 * t, 700 + 90 * t) for t in range(12)]
    ping_steps = simulate_multi_operator_pings(towers, true_path)

    projector = LocalProjector(reference_lon=REFERENCE_LON, reference_lat=REFERENCE_LAT)
    origin_x, origin_y = projector.to_xy(REFERENCE_LAT, REFERENCE_LON)

    # --- Save tower master CSV (with real-style multi-operator column) ---
    tower_rows = []
    for t in towers:
        lat, lon = projector.to_latlon(origin_x + t["x"], origin_y + t["y"])
        tower_rows.append({
            "tower_id": t["tower_id"], "site_id": t["site_id"],
            "operator": t["operator"],
            "latitude": lat, "longitude": lon,
            "azimuth_deg": t["azimuth_deg"], "beamwidth_deg": t["beamwidth_deg"],
            "max_range_m": t["max_range_m"],
        })
    towers_df = pd.DataFrame(tower_rows)
    towers_df.to_csv(f"{output_prefix}_towers.csv", index=False)

    # --- Save multi-operator CDR-style ping log ---
    base_time = datetime.datetime(2026, 7, 8, 12, 0, 0, tzinfo=datetime.timezone.utc)
    cdr_rows = []
    for step_idx, pings in enumerate(ping_steps):
        ts = base_time + datetime.timedelta(seconds=step_idx * 15)
        for p in pings:
            tech = TECH_BY_OPERATOR[p["operator"]]
            ta_value = round(p["estimated_distance_m"] / TA_METERS_PER_UNIT[tech])
            cdr_rows.append({
                "subscriber_id": "SAMPLE_multilateration_demo",
                "timestamp": ts.isoformat(),
                "tower_id": p["tower_id"],
                "operator": p["operator"],
                "technology": tech,
                "ta": ta_value,
                "estimated_distance_m": round(p["estimated_distance_m"], 1),
            })
    cdr_df = pd.DataFrame(cdr_rows)
    cdr_df.to_csv(f"{output_prefix}_pings.csv", index=False)

    # --- Run the actual WLS + Kalman pipeline on this sample ---
    fixes, meta, prev_fix = [], [], None
    for step_idx, pings in enumerate(ping_steps):
        if len(pings) >= 2:
            x, y, resid = wls_multilaterate(pings, tower_lookup, initial_guess=prev_fix)
            method = "wls_multilateration"
        elif len(pings) == 1:
            x, y, resid = single_tower_fallback(pings, tower_lookup)
            method = "single_tower_fallback"
        else:
            continue
        prev_fix = np.array([x, y])
        n_ops = len(set(p["operator"] for p in pings))
        fixes.append({"x": x, "y": y, "dt": 15.0, "residual": resid})
        meta.append({
            "timestamp": base_time + datetime.timedelta(seconds=step_idx * 15),
            "num_towers_used": len(pings),
            "num_operators_used": n_ops,
            "operators": ",".join(sorted(set(p["operator"] for p in pings))),
            "method": method,
        })

    smoothed = track_suspect(fixes)

    results = []
    for m, fix in zip(meta, smoothed):
        lat, lon = projector.to_latlon(origin_x + fix["x"], origin_y + fix["y"])
        results.append({
            "subscriber_id": "SAMPLE_multilateration_demo",
            "timestamp": m["timestamp"].isoformat(),
            "latitude": lat,
            "longitude": lon,
            "confidence_radius_m": round(fix["confidence_radius_m"], 1),
            "num_towers_used": m["num_towers_used"],
            "num_operators_used": m["num_operators_used"],
            "operators": m["operators"],
            "method": m["method"],
        })

    results_df = pd.DataFrame(results)
    results_df.to_csv(f"{output_prefix}_movement_track.csv", index=False)

    return towers_df, cdr_df, results_df


if __name__ == "__main__":
    towers_df, cdr_df, results_df = build_multi_operator_sample()

    print(f"Generated {len(towers_df)} tower sectors across "
          f"{towers_df['operator'].nunique()} operators: "
          f"{towers_df['operator'].value_counts().to_dict()}")
    print(f"Generated {len(cdr_df)} ping records")
    print(f"Generated {len(results_df)} localization fixes\n")

    print("Sample fixes (showing multi-operator fusion per fix):")
    print(results_df[["timestamp", "num_towers_used", "num_operators_used",
                       "operators", "confidence_radius_m", "method"]].to_string(index=False))

    print(f"\nMean confidence radius: {results_df['confidence_radius_m'].mean():.1f} m")
    print(f"Fixes using 2+ operators simultaneously: "
          f"{(results_df['num_operators_used'] >= 2).sum()} / {len(results_df)}")
