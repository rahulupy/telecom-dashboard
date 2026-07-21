import LiveMap from "../map/LiveMap";

import LocalizationPanel from "./LocalizationPanel";
import TimelinePanel from "./TimelinePanel";
import AlertsPanel from "./AlertsPanel";
import TowerStatusPanel from "./TowerStatusPanel";

import ConfidenceChart from "../charts/ConfidenceChart";
import TowerSignalChart from "../charts/TowerSignalChart";
import RadiusTrendChart from "../charts/RadiusTrendChart";

import CaseSummary from "../reports/CaseSummary";

export default function DashboardGrid() {
  return (
    <div className="grid grid-cols-12 gap-6 mt-6">

      {/* Map */}
      <div className="col-span-12 xl:col-span-8">
        <LiveMap />
      </div>

      {/* Localization */}
      <div className="col-span-12 xl:col-span-4">
        <LocalizationPanel />
      </div>

      {/* Timeline */}
      <div className="col-span-12 md:col-span-6 xl:col-span-4">
        <TimelinePanel />
      </div>

      {/* Alerts */}
      <div className="col-span-12 md:col-span-6 xl:col-span-4">
        <AlertsPanel />
      </div>

      {/* Confidence */}
      <div className="col-span-12 md:col-span-6">
        <ConfidenceChart />
      </div>

      {/* Signal */}
      <div className="col-span-12 md:col-span-6">
        <TowerSignalChart />
      </div>

      {/* Radius */}
      <div className="col-span-12 md:col-span-6">
        <RadiusTrendChart />
      </div>

      {/* Tower Status */}
      <div className="col-span-12 md:col-span-6">
        <TowerStatusPanel />
      </div>

      {/* Case Summary */}
      <div className="col-span-12">
        <CaseSummary />
      </div>

    </div>
  );
}