import { Polygon, Popup } from "react-leaflet";
import * as turf from "@turf/turf";
import useTowers from "../../hooks/useTowers";
import { useMapLayers } from "../../context/MapLayerContext";

export default function TowerCoverage() {
  const { data: towers, loading } = useTowers();

  const { layers } = useMapLayers();

  if (loading) return null;

  if (!layers.coverage) return null;

  return (
    <>
      {towers.map((tower) => {
        const center = turf.point([
          tower.longitude,
          tower.latitude,
        ]);

        const radius = 400; // meters
        const beam = 60;

        const left = turf.destination(
          center,
          radius / 1000,
          tower.azimuth_deg - beam,
          { units: "kilometers" }
        );

        const right = turf.destination(
          center,
          radius / 1000,
          tower.azimuth_deg + beam,
          { units: "kilometers" }
        );

        const polygon = [
          [tower.latitude, tower.longitude],
          [
            left.geometry.coordinates[1],
            left.geometry.coordinates[0],
          ],
          [
            right.geometry.coordinates[1],
            right.geometry.coordinates[0],
          ],
        ];

        let color = "#3b82f6";

        switch (tower.operator) {
          case "Airtel":
            color = "#ef4444";
            break;

          case "Jio":
            color = "#2563eb";
            break;

          case "Vi":
            color = "#7c3aed";
            break;

          case "BSNL":
            color = "#22c55e";
            break;
        }

        return (
          <Polygon
            key={tower.tower_id}
            positions={[polygon]}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.15,
              weight: 1,
            }}
          >
            <Popup>
                <div className="text-sm">
                    <strong>{tower.tower_id}</strong>
                    <br />
                    Site: {tower.site_id}
                    <br />
                    Operator: {tower.operator}
                    <br />
                    Azimuth: {tower.azimuth_deg.toFixed(1)}°
                </div>
            </Popup>
        </Polygon>
        );
      })}
    </>
  );
}