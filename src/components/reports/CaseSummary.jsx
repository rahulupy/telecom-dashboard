import Card from "../ui/Card";
import useCaseSummary from "../../hooks/useCaseSummary";
import LoadingCard from "../common/LoadingCard";
import ErrorCard from "../common/ErrorCard";

export default function CaseSummary() {

  const { data, loading, error } = useCaseSummary();

  if (loading) {
    return
      <LoadingCard title="📄 Case Summary"/>
  }

  if (error) {
    return (
      <Card title="📄 Case Summary"
          message="Failed to load case summary."
          />
    );
  }

  return (
    <Card title="📄 Case Summary">

      <div className="grid grid-cols-2 gap-6">

        <div>
          <p className="text-slate-400 text-sm">Case ID</p>
          <h3 className="text-white">{data.caseId}</h3>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Status</p>
          <h3 className="text-green-400">
            {data.engineStatus}
          </h3>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Confidence</p>
          <h3 className="text-blue-400">
            {data.confidence}%
          </h3>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Search Radius</p>
          <h3 className="text-white">
            {data.radius} m
          </h3>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Direction</p>
          <h3 className="text-white">
            {data.direction}
          </h3>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Updated</p>
          <h3 className="text-white">
            {data.lastUpdate}
          </h3>
        </div>

      </div>

    </Card>
  );
}