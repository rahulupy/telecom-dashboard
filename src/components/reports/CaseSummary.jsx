import Card from "../ui/Card";
import useCaseSummary from "../../hooks/useCaseSummary";
import LoadingCard from "../common/LoadingCard";
import ErrorCard from "../common/ErrorCard";

export default function CaseSummary() {

  const { data, loading, error } = useCaseSummary();

  if (loading) {
  return <LoadingCard title="📄 Case Summary" />;
}

if (error) {
  return (
    <ErrorCard
      title="📄 Case Summary"
      message="Failed to load case summary."
    />
  );
}

  return (
    <Card title="📄 Case Summary">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <Info label="Case ID" value={data.caseId} />

        <Info label="Subscriber" value={data.subscriber} />

        <Info label="Status" value={data.status} />

        <Info label="Method" value={data.method} />

        <Info
          label="Confidence"
          value={`${data.confidence}%`}
        />

        <Info
          label="Radius"
          value={`${data.radius} m`}
        />

        <Info
          label="Towers Used"
          value={data.towers}
        />

        <Info
          label="Direction"
          value={data.direction}
        />

      </div>

      <div className="mt-6 border-t border-slate-700 pt-4 text-right text-xs text-slate-500">
        Last Updated: {data.updated}
      </div>
    </Card>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 transition hover:border-blue-500">
      <p className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-white">
        {value}
      </p>
    </div>
  );
}