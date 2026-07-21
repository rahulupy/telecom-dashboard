import localization from "../data/localization";

let confidence = localization.confidence;
let radius = localization.radius;

export function getLocalization() {
  confidence = Math.max(
    75,
    Math.min(99, confidence + (Math.random() > 0.5 ? 1 : -1))
  );

  radius = Math.max(
    50,
    Math.min(200, radius + (Math.random() > 0.5 ? -5 : 5))
  );

  let lat = 32.7266;
let lng = 74.8570;

lat += (Math.random() - 0.5) * 0.00005;
lng += (Math.random() - 0.5) * 0.00005;

  return {
    ...localization,
    confidence,
    heatmapCenter: {
  lat,
  lng,
},
    radius,
    lastUpdate: new Date().toLocaleTimeString(),
  };
}