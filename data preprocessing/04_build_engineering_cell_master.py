import os
import pandas as pd
import numpy as np

# ==========================================================
# PROJECT PATHS
# ==========================================================

PROJECT_ROOT = "/Users/harshsingh/Desktop/SVNIT"

PROCESSED = os.path.join(PROJECT_ROOT, "data", "processed")

INPUT_FILE = os.path.join(PROCESSED, "cell_id_report.csv")
OUTPUT_FILE = os.path.join(PROCESSED, "engineering_cell_master.csv")

# ==========================================================
# LOAD DATA
# ==========================================================

print("=" * 70)
print("Loading Cell ID Report...")
print("=" * 70)

cell = pd.read_csv(INPUT_FILE)

# Standardize column names
cell.columns = (
    cell.columns
    .str.strip()
    .str.lower()
)

# Convert datetime
if "scan_datetime" in cell.columns:
    cell["scan_datetime"] = pd.to_datetime(
        cell["scan_datetime"],
        errors="coerce"
    )

# Sort newest first
if "scan_datetime" in cell.columns:
    cell = cell.sort_values(
        by="scan_datetime",
        ascending=False
    )

# ==========================================================
# HELPER FUNCTIONS
# ==========================================================


def first_valid(series):
    """
    Return first non-null value.
    """
    s = series.dropna()

    if len(s) == 0:
        return np.nan

    return s.iloc[0]


def median_valid(series):
    """
    Median ignoring NaNs.
    """
    s = pd.to_numeric(series, errors="coerce")

    if s.notna().sum() == 0:
        return np.nan

    return s.median()


# ==========================================================
# BUILD ENGINEERING CELL MASTER
# ==========================================================

records = []

cell = cell[cell["ecgi"].notna()].copy()

for ecgi, group in cell.groupby("ecgi"):

    row = {

        # -----------------------------
        # Identity
        # -----------------------------
        "operator": first_valid(group["operator"]),
        "circle": first_valid(group["circle"]),

        "mcc": first_valid(group["mcc"]),
        "mnc": first_valid(group["mnc"]),

        "lac": first_valid(group["lac"]),
        "cid": first_valid(group["cid"]),
        "cgi": first_valid(group["cgi"]),

        "ecgi": ecgi,
        "eci": first_valid(group["eci"]),

        "network": first_valid(group["network"]),

        "tac": first_valid(group["tac"]),
        "enodeb": first_valid(group["enodeb"]),
        "ci": first_valid(group["ci"]),

        "band": first_valid(group["band"]),
        "pci": first_valid(group["pci"]),

        # -----------------------------
        # Signal Statistics
        # -----------------------------
        "signal_dbm": median_valid(group["signal_dbm"]),
        "signal_asu": median_valid(group["signal_asu"]),

        "rsrp_dbm": median_valid(group["rsrp_dbm"]),
        "rsrq_dbm": median_valid(group["rsrq_dbm"]),

        # -----------------------------
        # Frequencies
        # -----------------------------
        "uplink_freq_mhz": first_valid(group["uplink_freq_mhz"]),
        "downlink_freq_mhz": first_valid(group["downlink_freq_mhz"]),

        "uplink_earfcn": first_valid(group["uplink_earfcn"]),
        "downlink_earfcn": first_valid(group["downlink_earfcn"]),
        "downlink_arfcn": first_valid(group["downlink_arfcn"]),

        # -----------------------------
        # GPS
        # -----------------------------
        "gps": first_valid(group["gps"]),
        "accuracy": median_valid(group["accuracy"]),

        # -----------------------------
        # Scan Information
        # -----------------------------
        "num_scans": len(group),
        "latest_scan": group["scan_datetime"].max(),

        "source_file": first_valid(group["source_file"])
    }

    records.append(row)

engineering = pd.DataFrame(records)

# ==========================================================
# SORT
# ==========================================================

engineering = engineering.sort_values(
    by=["operator", "ecgi"],
    ignore_index=True
)

# ==========================================================
# SAVE
# ==========================================================

engineering.to_csv(
    OUTPUT_FILE,
    index=False
)

# ==========================================================
# SUMMARY
# ==========================================================

print("\n" + "=" * 70)
print("Engineering Cell Master Created")
print("=" * 70)

print(f"Rows              : {len(engineering)}")
print(f"Unique ECGI       : {engineering['ecgi'].nunique()}")
print(f"Unique Operators  : {engineering['operator'].nunique()}")

print("\nMissing Values:")
print(engineering.isnull().sum())

print("\nFirst 5 Rows:")
print(engineering.head())

print(f"\nSaved to:\n{OUTPUT_FILE}")
