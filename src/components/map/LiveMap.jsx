import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import OfficerMarker from "./OfficerMarker";
import TowerMarkers from "./TowerMarkers";
import MovementTrail from "./MovementTrail";

import MapLegend from "./MapLegend";
import MapInfoPanel from "./MapInfoPanel";
import HeatmapLayer from "./HeatmapLayer";

export default function LiveMap() {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div>
          <h2 className="text-lg font-semibold">
            🗺 Localization Map
          </h2>

          <p className="text-sm text-gray-500">
            Last Updated: 10:42:15
          </p>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
          Refresh
        </button>
      </div>

      {/* Map Wrapper */}
      <div className="relative">

        {/* Floating Panel */}
        <MapInfoPanel />

        <MapLegend />

        <MapContainer
          center={[32.7266, 74.8570]}
          zoom={15}
          zoomControl={false}
          style={{
            height: "600px",
            width: "100%",
          }}
        >
            <ZoomControl position="topright" />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MovementTrail />
          <OfficerMarker />
          <TowerMarkers />
          <HeatmapLayer />
        </MapContainer>

      </div>

    </div>
  );
}