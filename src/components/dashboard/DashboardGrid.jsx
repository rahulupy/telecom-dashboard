import StatusCard from "./StatusCard";

export default function DashboardGrid() {
  return (
    <div className="grid grid-cols-4 gap-5">
      <StatusCard
        title="Case ID"
        value="PS09-001"
      />

      <StatusCard
        title="Status"
        value="Moving"
      />

      <StatusCard
        title="Confidence"
        value="92"
        unit="%"
      />

      <StatusCard
        title="Speed"
        value="8"
        unit="km/h"
      />
    </div>
  );
}