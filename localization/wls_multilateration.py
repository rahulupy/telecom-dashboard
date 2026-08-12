"""
Synthetic tower dataset + Weighted Least Squares (WLS) multilateration
engine for PS09 (Telecom Tower Multi-Lateration & Suspect Pinpointer).

This lets Member 3's work (localization) proceed fully before real
CDR/tower data arrives from Harsh / Member 2.
"""

import numpy as np
from scipy.optimize import least_squares


# ---------------------------------------------------------------------
# 1. SYNTHETIC TOWER DATABASE
# ---------------------------------------------------------------------

def generate_tower_grid(n_sites=10, area_size_m=3000, seed=1):
    """
    Generate a fake tower master database. Each physical tower SITE has
    3 sectors (standard real-world setup: ~0/120/240 degrees), so each
    site gives 360-degree coverage overall while each sector stays
    directional -- matching how real cellular towers are deployed.

    Returns a list of dicts: {tower_id, site_id, x, y, azimuth_deg,
    beamwidth_deg, max_range_m} -- one entry per sector.
    """
    rng = np.random.default_rng(seed)
    towers = []
    sector_offsets = [0, 120, 240]
    for i in range(n_sites):
        x = rng.uniform(0, area_size_m)
        y = rng.uniform(0, area_size_m)
        site_rotation = rng.uniform(0, 360)  # site's overall orientation
        max_range = rng.uniform(700, 1200)
        for j, offset in enumerate(sector_offsets):
            towers.append({
                "tower_id": f"T{i:03d}S{j}",
                "site_id": f"T{i:03d}",
                "x": x,
                "y": y,
                "azimuth_deg": (site_rotation + offset) % 360,
                "beamwidth_deg": 65.0,
                "max_range_m": max_range,
            })
    return towers


# ---------------------------------------------------------------------
# 2. SYNTHETIC PING GENERATOR (simulates a moving suspect)
# ---------------------------------------------------------------------

def simulate_pings(towers, true_path, ta_noise_std=25.0, detect_radius_m=900,
                    min_towers_per_step=2, seed=2):
    """
    For each point in true_path (list of (x, y)), figure out which towers
    would realistically have detected the phone: within detect_radius_m
    AND within that tower's sector azimuth/beamwidth wedge (a directional
    antenna doesn't detect phones behind it).

    Returns: list of steps, each a list of pings:
        {"tower_id", "estimated_distance_m"}
    """
    rng = np.random.default_rng(seed)
    all_steps = []

    def bearing_deg(from_xy, to_xy):
        dx, dy = to_xy[0] - from_xy[0], to_xy[1] - from_xy[1]
        return (np.degrees(np.arctan2(dx, dy))) % 360

    def angular_diff(a, b):
        d = abs(a - b) % 360
        return min(d, 360 - d)

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
                    "estimated_distance_m": max(noisy_dist, 10.0),
                })
        if len(pings) > 6:
            pings = list(rng.choice(pings, size=6, replace=False))
        all_steps.append(pings)

    return all_steps


# ---------------------------------------------------------------------
# 3. WLS MULTILATERATION ENGINE
# ---------------------------------------------------------------------

def wls_multilaterate(pings, tower_lookup, weights=None, initial_guess=None,
                       azimuth_weight=0.5):
    """
    pings: list of {"tower_id": str, "estimated_distance_m": float}
    tower_lookup: dict tower_id -> {"x":.., "y":.., "azimuth_deg":.., "beamwidth_deg":..}
    weights: optional list, same order as pings (higher = trust more).
             Defaults to equal weighting.
    azimuth_weight: how strongly to penalize a candidate point that falls
                     outside a tower's sector wedge. This is what resolves
                     the "two circles intersect at two points" ambiguity
                     that pure distance-based WLS can't handle with only
                     2 towers -- sector direction breaks the symmetry.

    Returns: (x, y, residual_error) -- residual_error feeds directly into
    the Kalman filter's R (measurement noise) as discussed earlier.
    """
    if len(pings) < 2:
        raise ValueError("Need at least 2 tower pings for WLS multilateration")

    towers_xy = np.array([[tower_lookup[p["tower_id"]]["x"],
                            tower_lookup[p["tower_id"]]["y"]] for p in pings])
    distances = np.array([p["estimated_distance_m"] for p in pings])
    azimuths = np.array([tower_lookup[p["tower_id"]].get("azimuth_deg", None)
                          for p in pings])
    beamwidths = np.array([tower_lookup[p["tower_id"]].get("beamwidth_deg", 65.0)
                            for p in pings])
    has_azimuth = not any(a is None for a in azimuths)

    if weights is None:
        weights = np.ones(len(pings))
    weights = np.array(weights)

    def bearing_deg(from_xy, to_xy):
        dx, dy = to_xy[0] - from_xy[0], to_xy[1] - from_xy[1]
        return (np.degrees(np.arctan2(dx, dy))) % 360  # 0=North, clockwise

    def angular_diff(a, b):
        d = abs(a - b) % 360
        return min(d, 360 - d)

    def residuals(point):
        est_dist = np.linalg.norm(towers_xy - point, axis=1)
        dist_res = weights * (est_dist - distances)

        if not has_azimuth:
            return dist_res

        # Soft penalty: 0 if the point is within the sector wedge, growing
        # linearly (scaled) the further outside the wedge it falls.
        az_penalty = []
        for i, t_xy in enumerate(towers_xy):
            bearing = bearing_deg(t_xy, point)
            diff = angular_diff(bearing, azimuths[i])
            half_bw = beamwidths[i] / 2.0
            excess = max(0.0, diff - half_bw)
            # Scale excess degrees into the same rough units as distance
            # residuals (meters) so it meaningfully competes in the fit.
            az_penalty.append(azimuth_weight * excess * (distances[i] / 90.0))

        return np.concatenate([dist_res, np.array(az_penalty)])

    # Candidate starting points: centroid, each individual tower, and the
    # caller-provided guess (e.g. previous fix) if given.
    candidates = [towers_xy.mean(axis=0)] + [row for row in towers_xy]
    if initial_guess is not None:
        candidates.append(np.asarray(initial_guess))

    best_point, best_cost, best_residual = None, np.inf, None
    for start in candidates:
        result = least_squares(residuals, start, method="lm")
        cost = np.sum(result.fun ** 2)
        if cost < best_cost:
            best_cost = cost
            best_point = result.x
            # Report residual using only the distance component, so it stays
            # in meters and remains meaningful as a Kalman R input.
            n_dist = len(pings)
            best_residual = float(np.sqrt(np.mean(result.fun[:n_dist] ** 2)))

    return best_point[0], best_point[1], best_residual


def single_tower_fallback(pings, tower_lookup):
    """
    When only 1 tower reports a ping: report that tower's location as the
    estimate, with a large residual (= low confidence) so the Kalman filter
    knows to trust it less.
    """
    p = pings[0]
    t = tower_lookup[p["tower_id"]]
    # Report tower location as centroid guess; residual = the estimated
    # distance itself, since that's our whole margin of uncertainty.
    return t["x"], t["y"], p["estimated_distance_m"]


# ---------------------------------------------------------------------
# 4. SELF-TEST: full pipeline on synthetic data
# ---------------------------------------------------------------------

if __name__ == "__main__":
    towers = generate_tower_grid(n_sites=25, area_size_m=2500, seed=1)
    tower_lookup = {t["tower_id"]: t for t in towers}

    # Simulate a suspect driving in a straight line across the tower grid
    true_path = [(600 + 130 * t, 700 + 90 * t) for t in range(12)]

    ping_steps = simulate_pings(towers, true_path, ta_noise_std=25.0, seed=2)

    print(f"{'step':<6}{'#towers':<10}{'true (x,y)':<20}{'WLS fix':<25}{'error(m)':<12}{'residual'}")
    fixes_for_kalman = []
    prev_fix = None
    for i, (true_pt, pings) in enumerate(zip(true_path, ping_steps)):
        if len(pings) >= 2:
            # Use previous fix as the starting point when available -- this
            # avoids WLS locking onto the wrong circle-intersection when only
            # 2 towers are in range, and mirrors how a real tracker would work
            # (you always have temporal continuity from the last known fix).
            x, y, resid = wls_multilaterate(pings, tower_lookup, initial_guess=prev_fix)
        elif len(pings) == 1:
            x, y, resid = single_tower_fallback(pings, tower_lookup)
        else:
            print(f"{i:<6}{'0':<10}-- no towers detected this step, skipping --")
            continue

        prev_fix = np.array([x, y])
        error = np.hypot(x - true_pt[0], y - true_pt[1])
        fixes_for_kalman.append({"x": x, "y": y, "dt": 1.0, "residual": resid})

        print(f"{i:<6}{len(pings):<10}"
              f"({true_pt[0]:.0f},{true_pt[1]:.0f})".ljust(20) +
              f"({x:.1f},{y:.1f})".ljust(25) +
              f"{error:.1f}".ljust(12) +
              f"{resid:.1f}")

    mean_error = np.mean([
        np.hypot(f["x"] - t[0], f["y"] - t[1])
        for f, t in zip(fixes_for_kalman, true_path)
    ])
    print(f"\nMean WLS fix error (before Kalman smoothing): {mean_error:.2f} m")
    print("\nThese fixes are now ready to feed directly into track_suspect() "
          "from kalman_tracker.py for the smoothing step.")
