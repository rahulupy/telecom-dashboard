"""
PS09 - Real Tower ID + Flagged Demo GPS Builder

Uses REAL identifiers from engineering_tower_master.csv:
  - Real ecgi (unique per-sector cell ID)
  - Real eci
  - Real enodeb (physical site grouping -- real sector counts, 1-6 per site,
    not assumed to be a clean 3)
  - Real operator, pci, tac

Only fabricates what's genuinely missing from the real file:
  - GPS coordinates (real file has "0,0" placeholder for all rows)
  - Azimuth (not present in the real schema at all)

Every generated field is clearly flagged is_real=False so there is no
ambiguity in your report about what's real vs. placeholder.
"""

import hashlib
import numpy as np
import pandas as pd


# Same Surat-area bounding box used for the CDR baseline demo, so all
# your demo outputs are geographically consistent with each other.
DEMO_AREA_LAT_RANGE = (21.10, 21.25)
DEMO_AREA_LON_RANGE = (72.75, 72.90)


def deterministic_site_coordinate(enodeb_id):
    """
    One reproducible demo coordinate per real physical site (enodeb).
    All sectors belonging to the same real enodeb share the same site
    location -- exactly like real cellular deployment (one physical
    tower, multiple sector antennas).
    """
    h = int(hashlib.md5(str(enodeb_id).encode()).hexdigest(), 16)
    lat_frac = (h % 10000) / 10000.0
    lon_frac = ((h // 10000) % 10000) / 10000.0
    lat = DEMO_AREA_LAT_RANGE[0] + lat_frac * (DEMO_AREA_LAT_RANGE[1] - DEMO_AREA_LAT_RANGE[0])
    lon = DEMO_AREA_LON_RANGE[0] + lon_frac * (DEMO_AREA_LON_RANGE[1] - DEMO_AREA_LON_RANGE[0])
    return lat, lon


def build_real_tower_lookup(tower_master_csv):
    """
    Returns a dict: real ecgi -> tower record, using REAL ids/operator/pci
    and FLAGGED-DEMO gps/azimuth (evenly spaced across each real site's
    actual sector count, not assumed to be 3).
    """
    df = pd.read_csv(tower_master_csv)

    lookup = {}
    for enodeb_id, group in df.groupby("enodeb"):
        lat, lon = deterministic_site_coordinate(enodeb_id)
        n_sectors = len(group)
        # Base rotation per site (deterministic, not random-per-run) so
        # sectors are evenly spread around the real sector count for
        # this specific site -- mirrors real deployment logic even
        # though the exact direction is still a placeholder.
        base_rotation = (int(hashlib.md5(str(enodeb_id).encode()).hexdigest(), 16) % 360)

        for idx, (_, row) in enumerate(group.iterrows()):
            azimuth = (base_rotation + idx * (360.0 / n_sectors)) % 360
            beamwidth = min(360.0 / n_sectors, 65.0) if n_sectors > 1 else 360.0

            lookup[str(row["ecgi"])] = {
                "tower_id": str(row["ecgi"]),          # REAL
                "site_id": str(enodeb_id),               # REAL
                "eci": str(row["eci"]),                  # REAL
                "operator": row["operator"],             # REAL
                "pci": row.get("pci"),                   # REAL
                "tac": row.get("tac"),                   # REAL
                "latitude": lat,                          # DEMO placeholder
                "longitude": lon,                         # DEMO placeholder
                "azimuth_deg": round(azimuth, 1),         # DEMO placeholder
                "beamwidth_deg": round(beamwidth, 1),     # DEMO placeholder
                "is_real_id": True,
                "is_real_gps": False,
                "is_real_azimuth": False,
            }
    return lookup


if __name__ == "__main__":
    lookup = build_real_tower_lookup(
        "/mnt/user-data/uploads/1786346973009_engineering_tower_master.csv"
    )

    print(f"Built lookup for {len(lookup)} real towers across "
          f"{len(set(v['site_id'] for v in lookup.values()))} real physical sites.\n")

    print(f"{'tower_id (real)':<28}{'site_id (real)':<12}{'operator':<10}"
          f"{'azimuth (demo)':<16}{'lat,lon (demo)'}")
    for tid, t in list(lookup.items())[:10]:
        print(f"{tid:<28}{t['site_id']:<12}{str(t['operator']):<10}"
              f"{t['azimuth_deg']:<16}{t['latitude']:.4f},{t['longitude']:.4f}")

    out_df = pd.DataFrame(lookup.values())
    out_df.to_csv("real_tower_ids_with_demo_gps.csv", index=False)
    print(f"\nSaved: real_tower_ids_with_demo_gps.csv")
    print("\nRemember: tower_id/site_id/operator/pci/tac are REAL.")
    print("latitude/longitude/azimuth_deg are PLACEHOLDER pending official data.")
