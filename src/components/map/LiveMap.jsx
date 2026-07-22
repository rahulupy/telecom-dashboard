import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { ScaleControl } from "react-leaflet";

import TowerMarkers from "./TowerMarkers";
import MovementTrail from "./MovementTrail";

import MapLegend from "./MapLegend";
import MapInfoPanel from "./MapInfoPanel";
import ProbabilityZone from "./ProbabilityZone";
import useLocalization from "../../hooks/useLocalization";
import EstimatedLocationMarker from "./EstimatedLocationMarker";
import TowerCoverage from "./TowerCoverage";
import AutoFollowMap from "./AutoFollowMap";
import OperatorFilter from "./OperatorFilter";
import HeatMapLayer from "./HeatMapLayer";
import MapLayersPanel from "./MapLayersPanel";


export default function LiveMap() {

  const { data, loading, error } = useLocalization();

  if (loading) {
    return (
      <div className="flex h-[560px] items-center justify-center rounded-3xl border border-slate-700 bg-slate-900 text-slate-300">
        Loading map...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[560px] items-center justify-center rounded-3xl border border-red-800 bg-slate-900 text-red-400">
        Failed to load map.
      </div>
    );
  }
  
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-900 px-6 py-5">
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

          <button className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Map Wrapper */}
      <div className="relative bg-slate-950">

        {/* Floating Panel */}
        <OperatorFilter />

        <MapLayersPanel />

        <MapInfoPanel />

        <MapLegend />

        

        <MapContainer
          center={[26.933779, 75.800337]}
          zoom={15}
          zoomControl={false}
          style={{
            height: "620px",
            width: "100%",
          }}
        >
          {/* <ZoomControl position="topright" />

          <ScaleControl position="bottomleft" /> */}
          <AutoFollowMap />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <HeatMapLayer />
          <TowerCoverage />
          <TowerMarkers />
          <MovementTrail />
          <ProbabilityZone />
          <EstimatedLocationMarker />
          
          
          
          
          {/* 
          <TowerMarkers />
          <ProbabilityZone /> */}
          
        </MapContainer>

      </div>

    </div>
  );
}