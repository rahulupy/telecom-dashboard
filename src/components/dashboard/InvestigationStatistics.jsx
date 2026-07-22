import Card from "../ui/Card";
import useStatistics from "../../hooks/useStatistics";
import LoadingCard from "../common/LoadingCard";
import ErrorCard from "../common/ErrorCard";

export default function InvestigationStatistics() {
  const { data, loading, error } = useStatistics();

  if (loading) {
    return <LoadingCard title="📊 Investigation Statistics" />;
  }

  if (error) {
    return (
      <ErrorCard
        title="📊 Investigation Statistics"
        message="Unable to load investigation statistics."
      />
    );
  }

  const stats = [
    {
      label: "Localization Updates",
      value: data.updates,
    },
    {
      label: "Average Confidence",
      value: `${data.avgConfidence}%`,
    },
    {
      label: "Average Radius",
      value: `${data.avgRadius} m`,
    },
    {
      label: "Distance Covered",
      value: `${data.distanceKm} km`,
    },
    {
      label: "Methods Used",
      value: data.methodsUsed,
    },
    {
      label: "Duration",
      value: `${data.durationMinutes} min`,
    },
  ];

  return (
    <Card title="📊 Investigation Statistics">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-700 bg-slate-800 p-4"
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {stat.label}
            </p>

            <h3 className="mt-2 text-2xl font-bold text-white">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>
    </Card>
  );
}