import { loadCSV } from "./csvService";

export async function getChartData() {
  const movement = await loadCSV("/data/movement_track.csv");

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