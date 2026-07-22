import { Circle } from "react-leaflet";
import useLocalization from "../../hooks/useLocalization";
import { useMapLayers } from "../../context/MapLayerContext";

export default function ProbabilityZone() {
  const { data, loading } = useLocalization();
  const { layers } = useMapLayers();
  

  if (loading || !data) return null;

  if (!layers.searchRadius) return null;

  const center = [
    Number(data.heatmapCenter.lat),
    Number(data.heatmapCenter.lng),
  ];

  const radius = Number(data.radius);

  return (
    <>
      {/* High Probability */}
      <Circle
        center={center}
        radius={radius}
        pathOptions={{
          color: "#ef4444",
          fillColor: "#ef4444",
          fillOpacity: 0.45,
          weight: 0,
        }}
      />

      {/* Medium Probability */}
      <Circle
        center={center}
        radius={radius + 40}
        pathOptions={{
          color: "#f97316",
          fillColor: "#f97316",
          fillOpacity: 0.30,
          weight: 0,
        }}
      />

      {/* Low Probability */}
      <Circle
        center={center}
        radius={radius + 80}
        pathOptions={{
          color: "#eab308",
          fillColor: "#eab308",
          fillOpacity: 0.18,
          weight: 0,
        }}
      />

      {/* Search Boundary */}
      <Circle
        center={center}
        radius={radius + 100}
        pathOptions={{
          color: "#38bdf8",
          dashArray: "8 6",
          fillOpacity: 0,
          weight: 2,
        }}
      />
    </>
  );
}