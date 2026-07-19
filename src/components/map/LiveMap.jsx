import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import { officer, suspect, towers } from "../../data/location";

export default function LiveMap() {
  return (
    <div className="bg-white rounded-xl shadow border overflow-hidden">
      <MapContainer
        center={officer.position}
        zoom={15}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={officer.position}>
          <Popup>Ground Officer</Popup>
        </Marker>

        <Marker position={suspect.position}>
          <Popup>Estimated Suspect Location</Popup>
        </Marker>

        {towers.map((tower) => (
          <Marker key={tower.id} position={tower.position}>
            <Popup>{tower.id}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}