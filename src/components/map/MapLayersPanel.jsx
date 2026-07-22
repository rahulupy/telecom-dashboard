import { useMapLayers } from "../../context/MapLayerContext";

export default function MapLayersPanel() {
  const { layers, toggleLayer } = useMapLayers();

  const options = [
    { key: "towers", label: "📡 Towers" },
    { key: "coverage", label: "📶 Tower Coverage" },
    { key: "heatmap", label: "🔥 Heatmap" },
    { key: "trail", label: "🛣 Movement Trail" },
    { key: "target", label: "🎯 Estimated Target" },
    { key: "searchRadius", label: "⭕ Search Radius" },
  ];

  return (
    <div className="absolute left-4 top-4 z-[1000] w-64 rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-xl backdrop-blur">
      <h3 className="mb-3 font-semibold text-white">
        🗺 Map Layers
      </h3>

      {options.map((option) => (
        <label
          key={option.key}
          className="mb-2 flex cursor-pointer items-center gap-3 text-sm text-slate-300"
        >
          <input
            type="checkbox"
            checked={layers[option.key]}
            onChange={() => toggleLayer(option.key)}
          />

          {option.label}
        </label>
      ))}
    </div>
  );
}