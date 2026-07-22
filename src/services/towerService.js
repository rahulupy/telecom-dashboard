import { loadCSV } from "./csvService";

export async function getTowers() {
  const towers = await loadCSV("/data/towers.csv");

  return towers.map((tower) => ({
    tower_id: tower.tower_id,
    site_id: tower.site_id,
    latitude: Number(tower.latitude),
    longitude: Number(tower.longitude),
    azimuth_deg: Number(tower.azimuth_deg),
    operator: tower.operator,
  }));
}