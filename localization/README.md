# Localization Module (Member 3 — Localization & Tracking)

Implements multi-tower WLS multilateration + Kalman filtering for PS09
(Telecom Tower Multi-Lateration & High-Precision Suspect Pinpointer).

## Setup

```bash
pip install -r requirements.txt
```

## Files

| File | Purpose |
|---|---|
| `wls_multilateration.py` | Core Weighted Least Squares multilateration engine + synthetic tower/ping generator |
| `kalman_tracker.py` | Constant-velocity Kalman filter for movement smoothing + confidence radius |
| `real_data_pipeline.py` | CSV loaders, lat/lon ⟷ local-meters (UTM) conversion, TA/RTT → distance formulas |
| `multi_operator_sample.py` | Generates a sample dataset (Jio/Airtel/Vi) demonstrating full multilateration capability |
| `real_cdr_baseline.py` | Cell-ID-only baseline locator, designed for real CDR data (schema-compatible; real data not included here) |
| `real_tower_ids.py` | Builds tower lookup using real tower/cell identifiers with placeholder GPS, pending official coordinates |
| `validation_and_lbs.py` | Accuracy validation (CEP50/CEP90) against ground truth; LBS-based direct positioning |
| `cctv_sighting_parser.py` | Parses VMS/CCTV export metadata into location checkpoints for cross-validation |

## Running the demo

```bash
python multi_operator_sample.py
```
Generates `sample_multilateration_movement_track.csv` and `sample_multilateration_towers.csv`,
consumed directly by the dashboard (`public/data/`).

## Known limitation

Real tower master data (as provided by officials) currently has placeholder
`(0,0)` GPS coordinates and no azimuth/TA/RTT fields. This module is built
and validated against sample data structured identically to the real schema,
ready to run on real data the moment GPS/azimuth/TA fields are provided.
See `docs/PS09_dataset_requirements.md` for the exact schema requested.

## Note on real data

Real CDR/LBS/tower files provided by officials contain subscriber PII and
are **intentionally excluded** from this repository (see `.gitignore`).
Contact the team lead for access to real data used during development/testing.
