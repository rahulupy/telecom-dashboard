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
      <div className="max-h-64 overflow-y-auto pr-2">

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
              className="relative pl-8 pb-6"
            >

              {/* Vertical Line */}
              {index !== timeline.length - 1 && (
                <div className="absolute left-3 top-6 h-full w-0.5 bg-slate-700" />
              )}

              {/* Timeline Dot */}
              <div
                className={`absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full ${dotColor} ring-4 ring-slate-900`}
              >
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>

              {/* Time */}
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {item.time}
              </p>

              {/* Event */}
              <h4 className="mt-1 text-sm font-semibold text-white">
                {item.event}
              </h4>

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