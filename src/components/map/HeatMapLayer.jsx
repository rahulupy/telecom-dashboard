import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

import { usePlayback } from "../../context/PlaybackContext";
import { useMapLayers } from "../../context/MapLayerContext";

export default function HeatMapLayer() {
  const map = useMap();

  const { history } = usePlayback();
  const { layers } = useMapLayers();

  const heatLayerRef = useRef(null);

  useEffect(() => {
    // Remove previous heat layer
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    // Layer disabled
    if (!layers.heatmap) return;

    // No data
    if (!history.length) return;

    // Only use recent movement points
    const recentHistory = history.slice(-30);

    const points = recentHistory.map((point) => {
      const radius = Number(point.confidence_radius_m);

      let weight = 0.4;

      if (radius <= 50) {
        weight = 1.0;
      } else if (radius <= 100) {
        weight = 0.9;
      } else if (radius <= 200) {
        weight = 0.75;
      } else if (radius <= 300) {
        weight = 0.6;
      }
      else {
        weight = 0.45;
      }

      return [
        Number(point.latitude),
        Number(point.longitude),
        weight,
      ];
    });

    heatLayerRef.current = L.heatLayer(points, {
      radius: 28,
      blur: 22,
      maxZoom: 18,
      minOpacity: 0.35,

      gradient: {
        0.2: "#2563eb", // Blue
        0.4: "#22c55e", // Green
        0.6: "#facc15", // Yellow
        0.8: "#f97316", // Orange
        1.0: "#ef4444", // Red
      },
    });

    heatLayerRef.current.addTo(map);

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [history, layers.heatmap, map]);

  return null;
}