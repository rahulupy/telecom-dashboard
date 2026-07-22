import { getMovementHistory } from "./movementService";

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;

  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function getStatistics() {
  const movement = await getMovementHistory();

  if (!movement.length) {
    throw new Error("No movement data.");
  }

  const updates = movement.length;

  const avgRadius =
    movement.reduce(
      (sum, row) => sum + Number(row.confidence_radius_m),
      0
    ) / updates;

  const avgConfidence =
    movement.reduce(
      (sum, row) =>
        sum +
        Math.max(
          50,
          Math.min(
            98,
            100 - Number(row.confidence_radius_m) / 4
          )
        ),
      0
    ) / updates;

  let distance = 0;

  for (let i = 1; i < movement.length; i++) {
    distance += calculateDistance(
      Number(movement[i - 1].latitude),
      Number(movement[i - 1].longitude),
      Number(movement[i].latitude),
      Number(movement[i].longitude)
    );
  }

  const methodsUsed = new Set(
        movement.map((row) => row.method)
    ).size;

  const start = new Date(movement[0].timestamp);
  const end = new Date(
    movement[movement.length - 1].timestamp
  );

  const durationMinutes = Math.round(
    (end - start) / 60000
  );

  return {
    updates,

    avgRadius: avgRadius.toFixed(1),

    avgConfidence: avgConfidence.toFixed(1),

    distanceKm: (distance / 1000).toFixed(2),

    methodsUsed,

    durationMinutes,
  };
}