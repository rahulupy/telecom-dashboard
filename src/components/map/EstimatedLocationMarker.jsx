import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import useLocalization from "../../hooks/useLocalization";
import { useMapLayers } from "../../context/MapLayerContext";

const estimatedIcon = new L.DivIcon({
  className: "",
  html: `
    <div class="estimated-marker">
      <div class="estimated-pulse"></div>
      <div class="estimated-dot"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function EstimatedLocationMarker() {
  const { data, loading } = useLocalization();
  const { layers } = useMapLayers();

  if (loading || !data) return null;

  if (!layers.target) return null;

  return (
    <Marker
      position={[
        data.heatmapCenter.lat,
        data.heatmapCenter.lng,
      ]}
      icon={estimatedIcon}
    >
      <Popup>
        <div className="min-w-[220px]">
          <h3 className="font-bold text-lg">
            📍 Estimated Location
          </h3>

          <p>
            <strong>Subscriber:</strong> {data.subscriber}
          </p>

          <p>
            <strong>Method:</strong> {data.method}
          </p>

          <p>
            <strong>Radius:</strong> {data.radius} m
          </p>

          <p>
            <strong>Towers:</strong> {data.nearbyTowers}
          </p>

          <p>
            <strong>Updated:</strong> {data.lastUpdate}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}