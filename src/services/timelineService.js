export function buildTimeline(movement) {
  return movement
    .slice()
    .reverse()
    .map((row) => ({
      id: `${row.subscriber_id}-${row.timestamp}`,

      time: new Date(row.timestamp).toLocaleTimeString(),

      event: "Localization Updated",

      method: row.method,

      details:
        `${row.num_towers_used} towers • Radius ${row.confidence_radius_m} m`,

      type:
        Number(row.confidence_radius_m) < 120
          ? "success"
          : Number(row.confidence_radius_m) < 250
          ? "warning"
          : "error",
    }));
}