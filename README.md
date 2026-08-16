# PS09 — Telecom Tower Multi-Lateration & High-Precision Suspect Pinpointer

A multi-tower trilateration and heatmapping engine for narrowing suspect
location from a coarse single-tower estimate (~1km radius) down to a
street/block level, using Weighted Least Squares (WLS) multilateration
and Kalman filtering, visualized on an interactive dashboard.

## Demo

- **Live Application:** https://telecom-dashboard-sigma.vercel.app
- **Quick Demo Video (working prototype):** https://youtu.be/vebL7d3UDuc


## Problem Statement

Single-tower location data is too coarse for actionable field operations.
This system ingests historical/near-real-time logs from multiple adjacent
cell towers a suspect's phone communicates with, computes a refined
location via multi-tower trilateration, applies Kalman filtering to
smooth movement and reduce deviation, and renders the result as a
probability heatmap with movement trace.

## Team & Roles

| Member | Role | Contribution |
|---|---|---|
| Harsh Singh | Data Engineering & Integration | Dataset cleaning, schema standardization, validation (`FINAL_VALIDATION_REPORT.md`) |
| Aryan Verma | Tower Database | `tower_lookup.py` — Cell ID → tower metadata lookup engine |
| Bulbul Deora | Localization & Tracking | `localization/` — WLS multilateration + Kalman filtering engine |
| Rahul | Visualization & Reporting | `src/` — React/Leaflet dashboard, heatmap, movement trace |

## Project Structure

```
telecom-dashboard/
├── src/                     # React dashboard (Rahul)
├── public/data/             # Sample data consumed by the dashboard
│   ├── movement_track.csv
│   └── towers.csv
├── localization/            # Localization engine (Bulbul Deora)
│   ├── wls_multilateration.py
│   ├── kalman_tracker.py
│   ├── real_data_pipeline.py
│   ├── multi_operator_sample.py
│   ├── real_cdr_baseline.py
│   ├── real_tower_ids.py
│   ├── validation_and_lbs.py
│   ├── cctv_sighting_parser.py
│   ├── requirements.txt
│   └── README.md
├── docs/                    # Shared documentation
│   └── PS09_dataset_requirements.md
├── tower_lookup.py          # Tower DB module (Aryan Verma)
├── package.json
└── README.md                # (this file)
```

## System Architecture

```
[Tower Master DB + CDR/LBS Logs]
        │
        ▼
[Data Engineering Layer] ── schema standardization, cleaning (Harsh)
        │
        ▼
[Tower Lookup Module] ── Cell ID → tower coordinates/azimuth (Aryan Verma)
        │
        ▼
[Localization Engine] ── WLS multilateration + Kalman filter (Bulbul Deora)
        │  outputs: lat/lon, confidence radius, method
        ▼
[Visualization Dashboard] ── heatmap, movement trace, tower overlay (Rahul)
```

## Setup & Installation

### Dashboard (React + Vite)
```bash
npm install
npm run dev
```
Opens at `http://localhost:5173/`.

### Localization module (Python)
```bash
cd localization
pip install -r requirements.txt
python multi_operator_sample.py
```
This generates sample movement/tower CSVs; copy them into `public/data/`
to feed the dashboard:
```bash
cp localization/sample_multilateration_movement_track.csv public/data/movement_track.csv
cp localization/sample_multilateration_towers.csv public/data/towers.csv
```

## Data

Real datasets (CDR, LBS, tower master) were provided by officials for
development/testing but are **not included in this repository** — they
contain subscriber PII. See `docs/PS09_dataset_requirements.md` for the
exact schema, and `localization/README.md` for details on real vs.
sample data handling.

**Current known limitation:** the real tower master data provided has
placeholder `(0,0)` GPS coordinates and lacks azimuth/TA/RTT fields.
The localization engine is fully built and validated against sample data
structured identically to the real schema, ready to run once these
fields are provided.

## Key Results (on sample data)

- Single-tower baseline deviation: ~750-800m
- WLS + Kalman refined deviation: ~20-40m
- Multi-operator fusion demonstrated across Jio, Airtel, and Vi simultaneously

## Tech Stack

- **Localization:** Python, NumPy, SciPy, filterpy (Kalman), pyproj
- **Visualization:** React, Vite, Leaflet, PapaParse
- **Data:** Pandas

## License / Data Handling Note

This is a hackathon prototype (PS09). Real telecom subscriber data used
during development is confidential and excluded from version control per
`.gitignore`. Do not commit real CDR/LBS/tower files.
