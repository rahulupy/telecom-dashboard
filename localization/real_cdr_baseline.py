"""
PS09 - Real CDR Baseline Demo (Cell-ID-only positioning)

Uses REAL data wherever it exists:
  - Real msisdn, real call timestamps, real first_cell_id sequence (all_cdr.csv)
  - Real cell IDs cross-referenced against engineering_cell_master.csv

Uses clearly-flagged PLACEHOLDER coordinates only where officials have not
yet provided them (gps = "0,0" in the real files). This produces the
single-tower baseline your problem statement exists to beat -- it is NOT
claiming to be the refined solution. The refined WLS+Kalman solution is
demonstrated separately on sample data (real_data_pipeline.py) built to
the exact schema requested from officials (TA/RTT, azimuth, real GPS).
"""

import numpy as np
import pandas as pd
import hashlib

from real_data_pipeline import LocalProjector
from kalman_tracker import track_suspect


# Bounding box roughly covering the real operator circle (Gujarat/Surat area,
# confirmed via the CCTV junction cross-check earlier). Used ONLY to place
# DEMO markers for cells that have no real GPS yet -- never presented as
# real tower locations.
DEMO_AREA_LAT_RANGE = (21.10, 21.25)
DEMO_AREA_LON_RANGE = (72.75, 72.90)


def deterministic_demo_coordinate(cell_id):
    """
    Assigns a reproducible (same cell_id always maps to the same point)
    PLACEHOLDER coordinate for a real cell_id that has no real GPS yet.
    Uses a hash so the same cell always lands in the same spot across runs
    -- NOT random noise, so results are reproducible for your report --
    but is explicitly a stand-in, not a real tower location.
    """
    h = int(hashlib.md5(str(cell_id).encode()).hexdigest(), 16)
    lat_frac = (h % 10000) / 10000.0
    lon_frac = ((h // 10000) % 10000) / 10000.0
    lat = DEMO_AREA_LAT_RANGE[0] + lat_frac * (DEMO_AREA_LAT_RANGE[1] - DEMO_AREA_LAT_RANGE[0])
    lon = DEMO_AREA_LON_RANGE[0] + lon_frac * (DEMO_AREA_LON_RANGE[1] - DEMO_AREA_LON_RANGE[0])
    return lat, lon


def build_cell_location_lookup(cell_ids, cell_master_df=None):
    """
    Builds a cell_id -> (lat, lon, is_real) lookup.
    If cell_master_df has real (non 0,0) gps for a cell, uses it.
    Otherwise falls back to a flagged demo coordinate.
    """
    lookup = {}
    real_gps_map = {}

    if cell_master_df is not None and "gps" in cell_master_df.columns:
        for _, row in cell_master_df.iterrows():
            gps_val = str(row.get("gps", "")).strip()
            if gps_val and gps_val != "0, 0" and "," in gps_val:
                try:
                    lat_str, lon_str = gps_val.split(",")
                    lat, lon = float(lat_str), float(lon_str)
                    if (lat, lon) != (0.0, 0.0):
                        for id_col in ["ecgi", "eci", "cid", "cgi"]:
                            if id_col in row and pd.notna(row[id_col]):
                                real_gps_map[str(row[id_col])] = (lat, lon)
                except ValueError:
                    continue

    for cid in cell_ids:
        cid_str = str(cid)
        if cid_str in real_gps_map:
            lat, lon = real_gps_map[cid_str]
            lookup[cid_str] = {"latitude": lat, "longitude": lon, "is_real_gps": True}
        else:
            lat, lon = deterministic_demo_coordinate(cid_str)
            lookup[cid_str] = {"latitude": lat, "longitude": lon, "is_real_gps": False}

    return lookup


def build_real_cdr_baseline_track(msisdn, cdr_df, cell_location_lookup, projector=None):
    """
    Builds the single-tower ("Cell-ID only") baseline track for one real
    subscriber, using their ACTUAL call sequence and timestamps.

    Returns: list of dicts (same output shape as the rest of the pipeline)
             plus an 'is_real_gps' flag per point so your report can be
             fully transparent about which points use real vs placeholder
             coordinates.
    """
    sub_df = cdr_df[cdr_df["msisdn"].astype(str).str.strip("'") == str(msisdn)].copy()
    sub_df["start_datetime"] = pd.to_datetime(
        sub_df["start_datetime"].astype(str).str.strip("'"), utc=True, errors="coerce"
    )
    sub_df = sub_df.dropna(subset=["start_datetime"]).sort_values("start_datetime")

    if sub_df.empty:
        return []

    if projector is None:
        projector = LocalProjector(
            reference_lon=sum(DEMO_AREA_LON_RANGE) / 2,
            reference_lat=sum(DEMO_AREA_LAT_RANGE) / 2,
        )

    fixes, meta = [], []
    prev_time = None
    for _, row in sub_df.iterrows():
        cell_id = str(row["first_cell_id"]).strip("'")
        if cell_id not in cell_location_lookup or cell_id in ("nan", ""):
            continue

        loc = cell_location_lookup[cell_id]
        x, y = projector.to_xy(loc["latitude"], loc["longitude"])

        dt = 1.0
        if prev_time is not None:
            dt = max((row["start_datetime"] - prev_time).total_seconds(), 1.0)
        prev_time = row["start_datetime"]

        # Cell-ID-only fix has NO distance refinement at all -- high residual
        # (low confidence) by design; this IS the coarse baseline.
        fixes.append({"x": x, "y": y, "dt": dt, "residual": 400.0})
        meta.append({
            "timestamp": row["start_datetime"],
            "cell_id": cell_id,
            "is_real_gps": loc["is_real_gps"],
        })

    if not fixes:
        return []

    smoothed = track_suspect(fixes)

    results = []
    for m, fix in zip(meta, smoothed):
        lat, lon = projector.to_latlon(fix["x"], fix["y"])
        results.append({
            "subscriber_id": msisdn,
            "timestamp": m["timestamp"].isoformat(),
            "cell_id": m["cell_id"],
            "latitude": lat,
            "longitude": lon,
            "confidence_radius_m": round(fix["confidence_radius_m"], 1),
            "method": "cell_id_baseline",
            "gps_source": "real" if m["is_real_gps"] else "PLACEHOLDER_pending_official_data",
        })
    return results


if __name__ == "__main__":
    cdr_df = pd.read_csv("/mnt/user-data/uploads/all_cdr.csv")
    cell_master_df = pd.read_csv("/mnt/user-data/uploads/engineering_cell_master.csv")

    msisdn = "919877535365"  # real subscriber, overlaps with LBS data too
    sub_cells = cdr_df[cdr_df["msisdn"].astype(str).str.strip("'") == msisdn]["first_cell_id"].dropna().unique()
    sub_cells = [str(c).strip("'") for c in sub_cells]

    lookup = build_cell_location_lookup(sub_cells, cell_master_df)
    n_real = sum(1 for v in lookup.values() if v["is_real_gps"])
    print(f"Cells used by {msisdn}: {len(lookup)} total, {n_real} with real GPS, "
          f"{len(lookup) - n_real} using placeholder (pending official data).")

    results = build_real_cdr_baseline_track(msisdn, cdr_df, lookup)
    print(f"\nBuilt {len(results)} baseline location points from REAL call sequence.")
    print("\nSample output:")
    for row in results[:3]:
        print(row)

    out_df = pd.DataFrame(results)
    out_df.to_csv("real_cdr_baseline_track.csv", index=False)
    print("\nSaved: real_cdr_baseline_track.csv")
