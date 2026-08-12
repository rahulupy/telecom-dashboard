"""
2D Constant-Velocity Kalman Filter for suspect tracking from
multi-tower WLS position fixes (PS09).

State vector: [x, y, vx, vy]  -> position (meters, local flat coords) + velocity (m/s)
Measurement:  [x, y]          -> the noisy WLS fix at each timestep
"""

import numpy as np
from filterpy.kalman import KalmanFilter


def build_kalman_filter(initial_x, initial_y, dt=1.0):
    """
    Create and configure a constant-velocity Kalman filter.

    initial_x, initial_y : first WLS fix, used to seed the filter
    dt                   : time step in seconds between updates
                            (recompute per-step if your pings are irregular)
    """
    kf = KalmanFilter(dim_x=4, dim_z=2)

    # --- Initial state: [x, y, vx, vy] ---
    # We don't know velocity yet, so start it at 0.
    kf.x = np.array([initial_x, initial_y, 0.0, 0.0])

    # --- State transition matrix F ---
    # Encodes: new_x = x + vx*dt, new_y = y + vy*dt, velocity stays same
    kf.F = np.array([
        [1, 0, dt, 0],
        [0, 1, 0, dt],
        [0, 0, 1,  0],
        [0, 0, 0,  1],
    ])

    # --- Measurement matrix H ---
    # We only ever *measure* position (x, y), never velocity directly.
    kf.H = np.array([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
    ])

    # --- Initial uncertainty P ---
    # High uncertainty at the start since we've only seen one fix.
    kf.P *= 500.0  # meters^2

    # --- Process noise Q ---
    # How much we trust the "moves in a straight line" assumption.
    # Higher value = filter adapts faster to sudden direction changes,
    # but smooths less. Tune this per scenario (vehicle vs pedestrian).
    from filterpy.common import Q_discrete_white_noise
    q_var = 25.0  # try 1-5 for a walking suspect, 20-50 for a fast vehicle
    kf.Q = Q_discrete_white_noise(dim=2, dt=dt, var=q_var, block_size=2)

    # --- Measurement noise R ---
    # Default value; OVERRIDE per-fix using WLS residual (see below).
    kf.R = np.array([
        [50.0, 0],
        [0, 50.0],
    ])

    return kf


def update_measurement_noise(kf, wls_residual_error):
    """
    Dynamically set R based on how good the WLS fit was for this fix.

    wls_residual_error: the leftover error from scipy.optimize.least_squares
                         after fitting this particular fix (bigger residual
                         = towers disagreed more = less trustworthy fix).

    This is the key link between your trilateration step and the filter:
    a fix built from 4 strong towers should get LOW R (trust it a lot);
    a fix built from 1 weak tower fallback should get HIGH R (trust it less).
    """
    # Simple mapping: scale noise variance with squared residual.
    # Clamp to a sane minimum so a "perfect" fit doesn't get zero noise.
    variance = max(residual_to_variance(wls_residual_error), 5.0)
    kf.R = np.array([
        [variance, 0],
        [0, variance],
    ])


def residual_to_variance(residual_error, scale=2.0):
    return (residual_error * scale) ** 2


def track_suspect(fixes):
    """
    fixes: list of dicts, each like:
        {"x": float, "y": float, "dt": float, "residual": float}
    (x, y in local flat meters; dt = seconds since previous fix;
     residual = WLS fit error for that fix, used to set confidence)

    Returns: list of dicts with smoothed position + confidence radius per step.
    """
    first = fixes[0]
    kf = build_kalman_filter(first["x"], first["y"])

    results = []
    for i, fix in enumerate(fixes):
        if i > 0:
            kf.F[0, 2] = fix["dt"]  # update dt in transition matrix
            kf.F[1, 3] = fix["dt"]
            kf.predict()

        update_measurement_noise(kf, fix["residual"])
        kf.update(np.array([fix["x"], fix["y"]]))

        # Confidence radius: derived from the position covariance (top-left 2x2 of P)
        pos_cov = kf.P[0:2, 0:2]
        # Use the largest eigenvalue as a conservative radius estimate
        eigenvalues = np.linalg.eigvalsh(pos_cov)
        confidence_radius = float(np.sqrt(max(eigenvalues)))

        results.append({
            "x": float(kf.x[0]),
            "y": float(kf.x[1]),
            "vx": float(kf.x[2]),
            "vy": float(kf.x[3]),
            "confidence_radius_m": confidence_radius,
        })

    return results


if __name__ == "__main__":
    # --- Quick self-test: simulate a suspect walking in a straight line,
    #     with noisy WLS fixes, and confirm the filter smooths them out. ---
    np.random.seed(42)

    true_path = [(100 * t, 50 * t) for t in range(15)]  # moving northeast, e.g. a vehicle
    noisy_fixes = []
    for i, (tx, ty) in enumerate(true_path):
        noise = np.random.normal(0, 45, size=2)  # 45m noise - realistic for a noisier multi-tower WLS fix
        noisy_fixes.append({
            "x": tx + noise[0],
            "y": ty + noise[1],
            "dt": 1.0,
            "residual": 25.0,  # fixed, realistic WLS residual for this demo
        })

    smoothed = track_suspect(noisy_fixes)

    print(f"{'step':<6}{'true (x,y)':<20}{'noisy fix':<25}{'kalman est.':<25}{'radius(m)'}")
    for i, (true_pt, fix, est) in enumerate(zip(true_path, noisy_fixes, smoothed)):
        print(f"{i:<6}"
              f"({true_pt[0]:.0f},{true_pt[1]:.0f})".ljust(20) +
              f"({fix['x']:.1f},{fix['y']:.1f})".ljust(25) +
              f"({est['x']:.1f},{est['y']:.1f})".ljust(25) +
              f"{est['confidence_radius_m']:.1f}")

    # Compare raw noisy-fix error vs Kalman-smoothed error against ground truth
    raw_errors = [np.hypot(f["x"] - t[0], f["y"] - t[1]) for f, t in zip(noisy_fixes, true_path)]
    kalman_errors = [np.hypot(e["x"] - t[0], e["y"] - t[1]) for e, t in zip(smoothed, true_path)]
    print(f"\nMean raw fix error:      {np.mean(raw_errors):.2f} m")
    print(f"Mean Kalman-smoothed error: {np.mean(kalman_errors):.2f} m")
