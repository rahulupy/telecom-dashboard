import StatusCard from "./StatusCard";
import caseData from "../../data/case";

export default function DashboardGrid() {
  return (
    <div className="grid grid-cols-4 gap-5">
      <StatusCard
        title="Case ID"
        value={caseData.caseId}
      />

      <StatusCard
        title="Status"
        value={caseData.status}
      />

      <StatusCard
        title="Confidence"
        value={caseData.confidence}
        unit="%"
      />

      <StatusCard
        title="Speed"
        value={caseData.speed}
        unit="km/h"
      />
    </div>
  );
}