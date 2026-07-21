import { Marker, Popup } from "react-leaflet";
import towers from "../../data/towers";

export default function TowerMarkers() {
  return (
    <>
      {towers.map((tower) => (
        <Marker
  key={tower.id}
  position={[tower.lat, tower.lng]}
>
  <Popup>

    <div className="min-w-[180px]">

      <h3 className="font-bold mb-2">
        📡 {tower.id}
      </h3>

      <p>
        <strong>Status:</strong> {tower.status}
      </p>

      <p>
        <strong>Signal:</strong> {tower.signal} dBm
      </p>

      <p>
        <strong>Sector:</strong> {tower.sector}
      </p>

      <p>
        <strong>Operator:</strong> {tower.operator}
      </p>

      <p>
        <strong>Updated:</strong> {tower.lastUpdate}
      </p>

    </div>

  </Popup>
</Marker>
      ))}
    </>
  );
}