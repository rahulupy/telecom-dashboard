"""
PS09 - CCTV Sighting Checkpoint Parser

Parses VMS export XML files (Milestone-style, as provided by officials)
into timestamped location checkpoints. Since these exports only contain
a descriptive camera name + timestamp (no GPS), you must manually supply
each camera's real-world lat/lon once via camera_locations.csv -- then
this becomes usable as extra ground-truth validation alongside (or
instead of) GPS data, using the SAME validate_against_ground_truth()
function already built for CDR/LBS validation.
"""

import xml.etree.ElementTree as ET
from pathlib import Path
import pandas as pd


def parse_cctv_export_xml(xml_path):
    """
    Parses one MediaExport XML file.
    Returns: {camera_name, start_time, end_time, site_name}
    """
    tree = ET.parse(xml_path)
    root = tree.getroot()

    camera_el = root.find("Camera")
    site_el = root.find("Site")

    return {
        "camera_name": camera_el.get("name") if camera_el is not None else None,
        "camera_resource_id": camera_el.get("resourceId") if camera_el is not None else None,
        "start_time": root.findtext("StartTime"),
        "end_time": root.findtext("EndTime"),
        "site_name": site_el.get("name") if site_el is not None else None,
    }


def parse_cctv_export_folder(folder_path):
    """
    Parses every .xml file in a folder (non-recursive) of CCTV exports.
    Returns a DataFrame, one row per clip.
    """
    folder = Path(folder_path)
    rows = [parse_cctv_export_xml(xml_file) for xml_file in folder.glob("*.xml")]
    return pd.DataFrame(rows)


def build_sighting_checkpoints(cctv_df, camera_locations_csv, case_id="unknown_case"):
    """
    Joins parsed CCTV clips with a manually-maintained camera location
    lookup (camera_name -> latitude, longitude) to produce sighting
    checkpoints in the same schema validate_against_ground_truth() expects.

    camera_locations.csv format:
        camera_name, latitude, longitude
        "Rokadiya Hanuman-Towards Bhatena C-Turn", 21.1550, 72.8450

    Returns a DataFrame: subscriber_id (=case_id), timestamp (clip midpoint),
    latitude, longitude, source_camera -- ready to feed into
    validate_against_ground_truth() as an alternate ground-truth source.
    """
    locations = pd.read_csv(camera_locations_csv)
    merged = cctv_df.merge(locations, on="camera_name", how="left")

    missing = merged[merged["latitude"].isna()]["camera_name"].unique()
    if len(missing) > 0:
        print(f"WARNING: {len(missing)} camera(s) have no location entry yet: {list(missing)}")
        print("Add these to camera_locations.csv before using for validation.")

    merged["start_time"] = pd.to_datetime(merged["start_time"], utc=True)
    merged["end_time"] = pd.to_datetime(merged["end_time"], utc=True)
    merged["timestamp"] = merged["start_time"] + (merged["end_time"] - merged["start_time"]) / 2

    checkpoints = merged[["latitude", "longitude", "timestamp", "camera_name"]].copy()
    checkpoints["subscriber_id"] = case_id  # or the specific suspect/vehicle ID if known
    checkpoints = checkpoints.rename(columns={"camera_name": "source_camera"})
    checkpoints["timestamp"] = checkpoints["timestamp"].apply(lambda t: t.isoformat())

    return checkpoints[["subscriber_id", "timestamp", "latitude", "longitude", "source_camera"]]
