import Badge from "../ui/Badge";
import useLocalization from "../../hooks/useLocalization";

export default function MapInfoPanel() {
  const { data, loading, error } = useLocalization();

  if (loading || error || !data) return null;

  return (
    <div className="absolute top-4 left-4 z-[1000] w-72 rounded-2xl border border-slate-700 bg-slate-900/90 backdrop-blur-md shadow-2xl p-5">

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold tracking-wide">
          📄 {data.caseId}
        </h2>

        <Badge color="green">
          {data.engineStatus}
        </Badge>
      </div>

      {/* Confidence */}
      <div className="mb-5">

        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">
            Confidence
          </span>

          <span className="text-blue-400 font-semibold">
            {data.confidence}%
          </span>
        </div>

        <div className="h-2 rounded-full bg-slate-700 overflow-hidden">

          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500"
            style={{
              width: `${data.confidence}%`,
            }}
          />

        </div>

      </div>

      <div className="space-y-3 text-sm">

        <div className="flex justify-between">
          <span className="text-slate-400">
            Radius
          </span>

          <span className="text-white">
            {data.radius} m
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">
            Nearby Towers
          </span>

          <span className="text-white">
            {data.nearbyTowers}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">
            Direction
          </span>

          <span className="text-white">
            {data.direction}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">
            Updated
          </span>

          <span className="text-white">
            {data.lastUpdate}
          </span>
        </div>

      </div>

    </div>
  );
}