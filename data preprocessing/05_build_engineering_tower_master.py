import os
import pandas as pd

# ==========================================================
# PROJECT PATHS
# ==========================================================

PROJECT_ROOT = "/Users/harshsingh/Desktop/SVNIT"

PROCESSED = os.path.join(PROJECT_ROOT, "data", "processed")

MASTER_FILE = os.path.join(PROCESSED, "engineering_cell_master.csv")
SIGNAL_FILE = os.path.join(PROCESSED, "signal_strength_report.csv")
SPOT_FILE = os.path.join(PROCESSED, "spot_scan.csv")

OUTPUT_FILE = os.path.join(PROCESSED, "engineering_tower_master.csv")

# ==========================================================
# LOAD DATA
# ==========================================================

print("=" * 70)
print("Loading datasets...")
print("=" * 70)

master = pd.read_csv(MASTER_FILE)
signal = pd.read_csv(SIGNAL_FILE)
spot = pd.read_csv(SPOT_FILE)

# ----------------------------------------------------------
# Standardize column names
# ----------------------------------------------------------

for df in [master, signal, spot]:
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
    )

# ==========================================================
# PREPARE SIGNAL REPORT
# ==========================================================

signal = signal.drop_duplicates(subset="cell_id")

signal = signal.rename(columns={
    "cell_id": "ecgi",
    "signal_strength_dbm": "signal_dbm_signal",
    "signal_strength_asu": "signal_asu_signal",
    "band": "band_signal",
    "network": "network_signal",
    "uplink_frequency_mhz": "uplink_freq_mhz_signal",
    "downlink_frequency_mhz": "downlink_freq_mhz_signal",
    "uplink_earfcn": "uplink_earfcn_signal",
    "downlink_earfcn": "downlink_earfcn_signal",
    "downlink_arfcn": "downlink_arfcn_signal"
})

# ==========================================================
# MERGE SIGNAL REPORT
# ==========================================================

tower = master.merge(
    signal,
    on="ecgi",
    how="left",
    suffixes=("", "_signal")
)

# ==========================================================
# Fill missing values from Signal Report
# ==========================================================

fill_pairs = [

    ("band", "band_signal"),
    ("network", "network_signal"),

    ("signal_dbm", "signal_dbm_signal"),
    ("signal_asu", "signal_asu_signal"),

    ("rsrp_dbm", "rsrp_dbm"),
    ("rsrq_dbm", "rsrq_dbm"),

    ("uplink_freq_mhz", "uplink_freq_mhz_signal"),
    ("downlink_freq_mhz", "downlink_freq_mhz_signal"),

    ("uplink_earfcn", "uplink_earfcn_signal"),
    ("downlink_earfcn", "downlink_earfcn_signal"),
    ("downlink_arfcn", "downlink_arfcn_signal")
]

for original, new in fill_pairs:

    if new in tower.columns:
        tower[original] = tower[original].fillna(
            tower[new]
        )

# ==========================================================
# REMOVE TEMP SIGNAL COLUMNS
# ==========================================================

tower.drop(
    columns=[
        c for c in tower.columns
        if c.endswith("_signal")
    ],
    inplace=True
)

# ==========================================================
# PREPARE SPOT SCAN
# ==========================================================

spot = spot.rename(
    columns={
        "cell_id": "ecgi"
    }
)

spot = spot[[
    "ecgi",
    "tower_type",
    "roaming"
]].drop_duplicates()

# ==========================================================
# MERGE SPOT SCAN
# ==========================================================

tower = tower.merge(
    spot,
    on="ecgi",
    how="left"
)

# ==========================================================
# FINAL COLUMN ORDER
# ==========================================================

column_order = [

    "operator",
    "circle",

    "mcc",
    "mnc",

    "ecgi",
    "eci",
    "tac",
    "enodeb",
    "ci",
    "pci",

    "network",
    "band",

    "signal_dbm",
    "signal_asu",
    "rsrp_dbm",
    "rsrq_dbm",

    "uplink_freq_mhz",
    "downlink_freq_mhz",

    "uplink_earfcn",
    "downlink_earfcn",
    "downlink_arfcn",

    "gps",
    "accuracy",

    "tower_type",
    "roaming",

    "num_scans",
    "latest_scan",

    "source_file"
]

tower = tower[[c for c in column_order if c in tower.columns]]

# ==========================================================
# SAVE
# ==========================================================

tower.to_csv(
    OUTPUT_FILE,
    index=False
)

# ==========================================================
# SUMMARY
# ==========================================================

print("\n" + "=" * 70)
print("Engineering Tower Master Created")
print("=" * 70)

print(f"Rows                : {len(tower)}")
print(f"Unique ECGI         : {tower['ecgi'].nunique()}")
print(f"Unique Operators    : {tower['operator'].nunique()}")

print("\nMissing Values:")
print(tower.isnull().sum()[tower.isnull().sum() > 0])

print(f"\nSaved to:\n{OUTPUT_FILE}")
