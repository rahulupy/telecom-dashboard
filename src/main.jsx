import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App";
import { PlaybackProvider } from "./context/PlaybackContext";
import { TowerFilterProvider } from "./context/TowerFilterContext";
import { MapLayerProvider } from "./context/MapLayerContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MapLayerProvider>
      <PlaybackProvider>
        <TowerFilterProvider>
          <App />
        </TowerFilterProvider>
      </PlaybackProvider>
    </MapLayerProvider>  
  </StrictMode>
);