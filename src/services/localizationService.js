import { getDirection } from "../utils/direction";
import {
  getLatestMovement,
  getMovementHistory,
} from "./movementService";

/**
 * Build localization object from any movement record.
 */
export function buildLocalization(record, movement) {
  if (!record) {
    return null;
  }

  const currentIndex = movement.findIndex(
    (row) =>
      row.timestamp === record.timestamp &&
      row.subscriber_id === record.subscriber_id
  );

  const previous =
    currentIndex > 0
      ? movement[currentIndex - 1]
      : movement[0];

  const confidence = Math.max(
    50,
    Math.min(
      98,
      100 - Number(record.confidence_radius_m) / 4
    )
  );

  return {
    caseId: "PS09-001",

    engineStatus: "ACTIVE",

    subscriber: record.subscriber_id,

    confidence: Math.round(confidence),

    radius: Number(record.confidence_radius_m),

    nearbyTowers: Number(record.num_towers_used),

    method: record.method,

    lastUpdate: String(record.timestamp),

    direction: getDirection(previous, record),

    heatmapCenter: {
      lat: Number(record.latitude),
      lng: Number(record.longitude),
    },

    movementTrail: movement
      .slice(0, currentIndex + 1)
      .map((point) => ({
        lat: Number(point.latitude),
        lng: Number(point.longitude),
        time: point.timestamp,
      })),
  };
}

export async function getLocalization() {
  const movement = await getMovementHistory();

  if (!movement.length) {
    throw new Error("No movement data found.");
  }

  const latest = await getLatestMovement();

  return buildLocalization(latest, movement);
}