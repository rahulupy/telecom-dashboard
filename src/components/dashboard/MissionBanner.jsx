import useCaseSummary from "../../hooks/useCaseSummary";
import LoadingCard from "../common/LoadingCard";
import ErrorCard from "../common/ErrorCard";
import PlaybackControls from "./PlaybackControls";

export default function MissionBanner() {
  const { data, loading, error } = useCaseSummary();

  if (loading) {
    return <LoadingCard title="Mission Status" />;
  }

  if (error) {
    return (
      <ErrorCard
        title="Mission Status"
        message="Unable to load mission information."
      />
    );
  }

  return (
    <div className="mb-6 rounded-3xl border border-slate-700 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 shadow-xl">

      <div className="flex flex-col justify-between gap-6 lg:flex-row">

        {/* Left */}
        <div>

          <div className="flex items-center gap-3">

            <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>

            <p className="text-sm uppercase tracking-[0.2em] text-green-400">
              Active Investigation
            </p>

          </div>

          <h1 className="mt-3 text-3xl font-bold text-white">
            {data.caseId}
          </h1>

          <p className="mt-2 text-slate-400">
            Subscriber <span className="font-semibold text-white">{data.subscriber}</span>
          </p>

        </div>

        {/* Right */}
        <div className="grid grid-cols-2 gap-6 text-sm lg:grid-cols-4">

          <Stat
            label="Method"
            value={data.method}
          />

          <Stat
            label="Confidence"
            value={`${data.confidence}%`}
          />

          <Stat
            label="Radius"
            value={`${data.radius} m`}
          />

          <Stat
            label="Towers"
            value={data.towers}
          />

          <PlaybackControls />

        </div>

      </div>

      {/* Bottom Badges */}

      <div className="mt-6 flex flex-wrap gap-3">

        <Badge color="green">
          {data.status}
        </Badge>

        <Badge color="blue">
          {data.towers} Towers
        </Badge>

        <Badge color="orange">
          {data.direction}
        </Badge>

        <Badge color="purple">
          Updated {data.updated}
        </Badge>

      </div>

    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function Badge({ children, color }) {
  const styles = {
    green: "bg-green-500/20 text-green-400",
    blue: "bg-blue-500/20 text-blue-400",
    orange: "bg-orange-500/20 text-orange-400",
    purple: "bg-purple-500/20 text-purple-400",
  };

  return (
    <span
      className={`rounded-full px-4 py-2 text-xs font-semibold ${styles[color]}`}
    >
      {children}
    </span>
  );
}