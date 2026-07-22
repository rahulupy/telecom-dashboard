import { loadCSV } from "./csvService";

let movementCache = null;

async function loadMovement() {
  if (!movementCache) {
    movementCache = await loadCSV("/data/movement_track.csv");
  }

  return movementCache;
}

export async function getMovementHistory() {
  return await loadMovement();
}

export async function getLatestMovement() {
  const movement = await loadMovement();

  return movement[movement.length - 1];
}

export async function getMovementTrail() {
  const movement = await loadMovement();

  return movement.map((row) => ({
    lat: Number(row.latitude),
    lng: Number(row.longitude),
    time: row.timestamp,
  }));
}

export function buildChartData(movement) {
  return movement.map((row) => ({
    time: new Date(row.timestamp).toLocaleTimeString(),

    radius: Number(row.confidence_radius_m),

    towers: Number(row.num_towers_used),

    confidence: Math.round(
      Math.max(
        50,
        Math.min(
          98,
          100 - Number(row.confidence_radius_m) / 4
        )
      )
    ),
  }));
}