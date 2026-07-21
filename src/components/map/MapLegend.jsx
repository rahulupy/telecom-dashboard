export default function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-[1000] w-56 rounded-2xl border border-slate-700/50 bg-slate-900/90 backdrop-blur-xl p-4 shadow-2xl">

      <h3 className="text-white font-semibold mb-3">
        Map Legend
      </h3>

      <div className="space-y-3 text-sm">

        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-blue-500"></span>
          <span className="text-slate-300">Officer</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-lg">📡</span>
          <span className="text-slate-300">Cell Tower</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-orange-500"></span>
          <span className="text-slate-300">Estimated Search Area</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full border-2 border-blue-500"></span>
          <span className="text-slate-300">Search Radius</span>
        </div>

      </div>
    </div>
  );
}