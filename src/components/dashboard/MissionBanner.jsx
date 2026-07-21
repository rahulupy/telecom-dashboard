import {
  ShieldCheck,
  Target,
  Clock3,
  LocateFixed,
} from "lucide-react";

import useLocalization from "../../hooks/useLocalization";

export default function MissionBanner() {
  const { data, loading } = useLocalization();

  if (loading || !data) return null;

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-blue-800 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 shadow-xl">

      <div className="flex flex-wrap items-center justify-between gap-6 p-7">

        {/* Mission */}

        <div className="flex items-center gap-4">

          <div className="relative">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20">
              <ShieldCheck
                size={28}
                className="text-green-400"
              />
            </div>

            <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-green-400 animate-pulse" />

          </div>

          <div>

            <p className="text-xs uppercase tracking-[0.3em] text-blue-300">
              Active Mission
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              Case {data.caseId}
            </h2>

            <p className="mt-1 text-slate-400">
              Multi-Tower Localization Engine Running
            </p>

             {/* Status Chips */}
            <div className="mt-3 flex flex-wrap gap-2">

                <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                    {data.engineStatus}
                </span>

                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400">
                    {data.nearbyTowers} Towers
                </span>

                <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-medium text-orange-400">
                    {data.direction}
                </span>

            </div>

          </div>

        </div>

        {/* Statistics */}

        <div className="flex flex-wrap gap-10">

          <div>

            <p className="flex items-center gap-2 text-slate-400 text-sm">
              <Target size={16} />
              Confidence
            </p>

            <h3 className="mt-1 text-2xl font-bold text-blue-400">
              {data.confidence}%
            </h3>

          </div>

          <div>

            <p className="flex items-center gap-2 text-slate-400 text-sm">
              <LocateFixed size={16} />
              Radius
            </p>

            <h3 className="mt-1 text-2xl font-bold text-white">
              {data.radius} m
            </h3>

          </div>

          <div>

            <p className="flex items-center gap-2 text-slate-400 text-sm">
              <Clock3 size={16} />
              Last Update
            </p>

            <h3 className="mt-1 text-xl font-semibold text-white">
              {data.lastUpdate}
            </h3>

          </div>

        </div>

      </div>

    </div>
  );
}