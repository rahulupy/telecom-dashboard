import {
  RadioTower,
  Shield,
  CircleDashed,
} from "lucide-react";

export default function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-[1000] rounded-xl border border-slate-700 bg-slate-900/85 p-4 shadow-xl">

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400">
        Legend
      </h3>

      <div className="space-y-3 text-sm">

        <div className="flex items-center gap-3">
          <Shield size={18} className="text-blue-400" />
          <span className="text-slate-300">
            Officer Position
          </span>
        </div>

        <div className="flex items-center gap-3">
          <RadioTower size={18} className="text-green-400" />
          <span className="text-slate-300">
            Cell Tower
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-red-500" />
          <span className="text-slate-300">
            High Probability
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-orange-500" />
          <span className="text-slate-300">
            Medium Probability
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-yellow-400" />
          <span className="text-slate-300">
            Low Probability
          </span>
        </div>

        <div className="flex items-center gap-3">
          <CircleDashed size={18} className="text-cyan-400" />
          <span className="text-slate-300">
            Search Boundary
          </span>
        </div>

      </div>

    </div>
  );
}