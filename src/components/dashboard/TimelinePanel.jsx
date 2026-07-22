import Card from "../ui/Card";
import LoadingCard from "../common/LoadingCard";
import ErrorCard from "../common/ErrorCard";
import useTimeline from "../../hooks/useTimeline";

export default function TimelinePanel() {
  const { data: timeline, loading, error } = useTimeline();

  if (loading) {
    return <LoadingCard title="🕒 Movement Timeline" />;
  }

  if (error) {
    return (
      <ErrorCard
        title="🕒 Movement Timeline"
        message="Unable to load movement timeline."
      />
    );
  }

  return (
    <Card title="🕒 Movement Timeline">
      <div className="max-h-[420px] overflow-y-auto pr-2 space-y-1">

        {timeline.map((item, index) => {

          const dotColor =
            item.type === "warning"
              ? "bg-yellow-500"
              : item.type === "error"
              ? "bg-red-500"
              : item.type === "success"
              ? "bg-green-500"
              : "bg-blue-600";

          return (
            <div
              key={item.id}
              className="relative rounded-xl border border-slate-800 bg-slate-900/40 pl-10 pr-4 py-4"
            >

              {/* Vertical Line */}
              {index !== timeline.length - 1 && (
                <div className="absolute left-3 top-7 h-full w-0.5 bg-gradient-to-b from-slate-600 to-slate-800" />
              )}

              {/* Timeline Dot */}
              <div
                className={`absolute left-0 top-4 flex h-7 w-7 items-center justify-center rounded-full ${dotColor} ring-4 ring-slate-950 shadow-lg`}
              >
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>

              {/* Time */}
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {item.time}
              </p>

              {/* Event */}
              <h4 className="mt-1 font-semibold text-white">
                {item.event}
              </h4>

              {/* Details */}
              <p className="mt-1 text-sm text-slate-400">
                {item.details}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-400">
                  {item.method}
                </span>

                <span className={`rounded-full px-2 py-1 text-xs ${
                  item.type === "success"
                    ? "bg-green-500/20 text-green-400"
                    : item.type === "warning"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
                  }`}>
                    {item.type.toUpperCase()}
                </span>
              </div>

              {/* Optional description */}
              {item.description && (
                <p className="mt-1 text-xs text-slate-400">
                  {item.description}
                </p>
              )}

            </div>
          );
        })}

      </div>
    </Card>
  );
}