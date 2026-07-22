import { createContext, useContext, useState } from "react";

const MapLayerContext = createContext();

export function MapLayerProvider({ children }) {
  const [layers, setLayers] = useState({
    towers: true,
    coverage: true,
    heatmap: true,
    trail: true,
    target: true,
    searchRadius: true,
  });

  function toggleLayer(layer) {
    setLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  }

  return (
    <MapLayerContext.Provider
      value={{
        layers,
        toggleLayer,
      }}
    >
      {children}
    </MapLayerContext.Provider>
  );
}

export function useMapLayers() {
  return useContext(MapLayerContext);
}