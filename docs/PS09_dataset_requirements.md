# PS09 – Required Datasets & Formats
Reference for what needs to be uploaded/provided, mapped directly to `wls_multilateration.py` and `kalman_tracker.py`.

---

## 1. Tower Master Database
**File:** `tower_master.csv` — one row per sector

| Column | Type | Notes |
|---|---|---|
| `tower_id` | string | Unique per sector; must match ID used in CDR/ping logs |
| `site_id` | string | Groups sectors belonging to the same physical tower |
| `latitude` / `longitude` | float | WGS84 decimal degrees |
| `azimuth_deg` | float | Direction the sector antenna faces (0=North, clockwise) — required to resolve 2-tower ambiguity in WLS |
| `beamwidth_deg` | float | Sector width, default 65° if not provided |
| `max_range_m` | float | Typical/rated coverage radius |
| `operator` | string | Categorization only |
| `lac_tac` | string | Filtering, not core math |

## 2. CDR / Tower Ping Log
**File:** `cdr_logs.csv` — one row per ping/tower-contact event

| Column | Type | Notes |
|---|---|---|
| `subscriber_id` | string | Should be anonymized/hashed |
| `timestamp` | datetime (ISO 8601) | Consistent timezone across all datasets |
| `tower_id` | string | Must match tower_master.csv exactly |
| `technology` | string | 2G/3G/4G/5G — determines TA-to-distance formula |
| `ta` | int (nullable) | Timing Advance — used to derive distance |
| `rtt` | float (nullable) | Alternative to TA |
| `rsrp`/`rssi` | float (nullable) | Signal strength, feeds WLS weighting |

## 3. Ground-Truth GPS Movement Data
**File:** `ground_truth_gps.csv` — validation only, never fed into the pipeline as input

| Column | Type |
|---|---|
| `subscriber_id` | string |
| `timestamp` | datetime |
| `latitude` / `longitude` | float |

## 4. Investigation Scenarios
**File:** `scenarios.csv`

| Column | Notes |
|---|---|
| `scenario_id`, `subscriber_id`, `scenario_type`, `start_time`, `end_time` | scenario_type: stationary / moving_vehicle / dense_urban / multi_sector |

## 5. Optional / Bonus
- IPDR logs mapped to towers
- GIS basemap layers (GeoJSON/vector tiles) for heatmap rendering

## Known Gap (as of current data received)
Real `engineering_tower_master.csv` / `engineering_cell_master.csv` provided
have placeholder `gps = "0, 0"` for all rows and no azimuth/TA/RTT fields.
Pipeline is built and validated against sample data matching this schema,
ready to run once real values are provided.
