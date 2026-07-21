import { Marker, Popup } from "react-leaflet";
import { officer } from "../../data/location";

export default function OfficerMarker() {
  return (
    <Marker
      position={[officer.latitude, officer.longitude]}
    >
      <Popup>
        <div>
          <h3 className="font-bold">{officer.name}</h3>
          <p>ID: {officer.id}</p>
          <p>Status: Active</p>
        </div>
      </Popup>
    </Marker>
  );
}