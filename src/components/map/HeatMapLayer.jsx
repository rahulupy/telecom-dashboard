import { Circle } from "react-leaflet";
import { getLocalization } from "../../services/localizationService";

export default function HeatmapLayer() {
  const data = getLocalization();

  const center = [
    data.heatmap[0].lat,
    data.heatmap[0].lng,
  ];

  return (
    <>
      <Circle
        center={center}
        radius={40}
        pathOptions={{
          color: "#ef4444",
          fillColor: "#ef4444",
          fillOpacity: 0.35,
          weight: 1,
        }}
      />

      <Circle
        center={center}
        radius={80}
        pathOptions={{
          color: "#f97316",
          fillColor: "#f97316",
          fillOpacity: 0.25,
          weight: 1,
        }}
      />

      <Circle
        center={center}
        radius={130}
        pathOptions={{
          color: "#eab308",
          fillColor: "#eab308",
          fillOpacity: 0.15,
          weight: 1,
        }}
      />

      <Circle
        center={center}
        radius={180}
        pathOptions={{
          color: "#22c55e",
          fillColor: "#22c55e",
          fillOpacity: 0.08,
          weight: 1,
        }}
      />
    </>
  );
}