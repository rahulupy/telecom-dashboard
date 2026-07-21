import { Marker, Popup } from "react-leaflet";
import { suspect } from "../../data/location";

export default function SuspectMarker() {
  return (
    <Marker
      position={[suspect.latitude, suspect.longitude]}
    >
      <Popup>
        <div>
          <h3 className="font-bold">{suspect.name}</h3>

          <p>Status: {suspect.status}</p>

          <p>Confidence: {suspect.confidence}%</p>

          <p>Speed: {suspect.speed} km/h</p>
        </div>
      </Popup>
    </Marker>
  );
}