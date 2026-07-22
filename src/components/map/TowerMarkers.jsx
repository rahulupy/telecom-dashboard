import { Marker, Popup } from "react-leaflet";
import useTowers from "../../hooks/useTowers";
import { useMapLayers } from "../../context/MapLayerContext";

export default function TowerMarkers() {
  const { data: towers, loading } = useTowers();
  const { layers } = useMapLayers();
  
  if (loading) return null;

  if (!layers.towers) return null;

  return (
    <>
      {towers
        .filter(
          (tower) =>
            tower.latitude != null &&
            tower.longitude != null
        )
        .map((tower) => (
          <Marker
            key={tower.tower_id}
            position={[
              Number(tower.latitude),
              Number(tower.longitude),
            ]}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold mb-2">
                  📡 {tower.tower_id}
                </h3>

                <p>
                  <strong>Site:</strong> {tower.site_id}
                </p>

                <p>
                  <strong>Operator:</strong> {tower.operator}
                </p>

                <p>
                  <strong>Azimuth:</strong> {tower.azimuth_deg}°
                </p>

                <p>
                  <strong>Latitude:</strong> {tower.latitude}
                </p>

                <p>
                  <strong>Longitude:</strong> {tower.longitude}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
    </>
  );
}