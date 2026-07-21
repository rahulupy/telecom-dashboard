import LiveMap from "../map/LiveMap";
import Card from "../ui/Card";

import LocalizationPanel from "./LocalizationPanel";
import TimelinePanel from "./TimelinePanel";
import AlertsPanel from "./AlertsPanel";
import TowerStatusPanel from "./TowerStatusPanel";
import ConfidenceChart from "../charts/ConfidenceChart";
import TowerSignalChart from "../charts/TowerSignalChart";

export default function DashboardGrid() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-6">

      {/* Map */}
      <div className="xl:col-span-8">
        <LiveMap />
      </div>

      {/* Right Panel */}
      <div className="xl:col-span-4">
        <LocalizationPanel />
      </div>

      {/* Bottom Left */}
<div className="xl:col-span-4">
    <TimelinePanel />
</div>

{/* Bottom Center */}
<div className="xl:col-span-4">
    <AlertsPanel />
</div>

<div className="col-span-12">
  <ConfidenceChart />
</div>

<div className="col-span-12">
    <TowerSignalChart />
</div>

{/* Bottom Right */}
<div className="xl:col-span-4">
    <TowerStatusPanel />
</div>

    </div>
  );
}