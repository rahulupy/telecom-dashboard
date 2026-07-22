import { Polyline } from "react-leaflet";
import useLocalization from "../../hooks/useLocalization";
import { useMapLayers } from "../../context/MapLayerContext";

export default function MovementTrail() {
  const { data, loading } = useLocalization();
  const { layers } = useMapLayers();

  if (loading || !data) return null;

  if (!layers.trail) return null;

  const positions = data.movementTrail.map((point) => [
    point.lat,
    point.lng,
  ]);

  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color: "#3b82f6",
        weight: 4,
        opacity: 0.8,
      }}
    />
  );
}