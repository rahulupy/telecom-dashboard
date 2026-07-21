import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { ScaleControl } from "react-leaflet";

import OfficerMarker from "./OfficerMarker";
import TowerMarkers from "./TowerMarkers";
import MovementTrail from "./MovementTrail";

import MapLegend from "./MapLegend";
import MapInfoPanel from "./MapInfoPanel";
import ProbabilityZone from "./ProbabilityZone";
import useLocalization from "../../hooks/useLocalization";
import TargetMarker from "./TargetMarker";
import RouteLine from "./RouteLine";
import EstimatedLocationMarker from "./EstimatedLocationMarker";


export default function LiveMap() {

  const { data, loading, error } = useLocalization();

  if (loading) {
    return (
      <div className="flex h-[560px] items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-300">
        Loading map...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[560px] items-center justify-center rounded-2xl border border-red-800 bg-slate-900 text-red-400">
        Failed to load map.
      </div>
    );
  }
  
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-900 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold tracking-wide text-white">
            🗺 Live Localization Map
          </h2>

          <p className="text-sm text-slate-400">
            Last Updated: {data?.lastUpdate ?? "--:--:--"}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            className="rounded-lg bg-slate-700 px-3 py-2 text-sm text-white transition hover:bg-slate-600"
          >
            📍 Center
          </button>

          <button
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white transition hover:bg-blue-700"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Map Wrapper */}
      <div className="relative bg-slate-950">

        {/* Floating Panel */}
        <MapInfoPanel />

        <MapLegend />

        <MapContainer
          center={[
            data?.heatmapCenter?.lat ?? 32.7266,
            data?.heatmapCenter?.lng ?? 74.8570,
          ]}
          zoom={15}
          zoomControl={false}
          style={{
            height: "500px",
            width: "100%",
          }}
        >
          <ZoomControl position="topright" />

          <ScaleControl position="bottomleft" />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MovementTrail />
          <OfficerMarker />
          <RouteLine />
          <TargetMarker />
          <TowerMarkers />
          <ProbabilityZone />
          <EstimatedLocationMarker />
        </MapContainer>

      </div>

    </div>
  );
}