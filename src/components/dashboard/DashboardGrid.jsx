import LiveMap from "../map/LiveMap";

import LocalizationPanel from "./LocalizationPanel";
import TimelinePanel from "./TimelinePanel";
import AlertsPanel from "./AlertsPanel";
import TowerStatusPanel from "./TowerStatusPanel";

import ConfidenceChart from "../charts/ConfidenceChart";
import TowerSignalChart from "../charts/TowerSignalChart";
import RadiusTrendChart from "../charts/RadiusTrendChart";

import CaseSummary from "../reports/CaseSummary";
import InvestigationStatistics from "./InvestigationStatistics";


export default function DashboardGrid() {
  return (
    <div className="mt-6 grid grid-cols-12 gap-6">

      {/* Live Map */}
      <div className="col-span-12 xl:col-span-8">
        <LiveMap />
      </div>

      {/* Current Localization */}
      <div className="col-span-12 xl:col-span-4">
        <LocalizationPanel />
      </div>

      {/* Charts */}
      <div className="col-span-12 md:col-span-4">
        <ConfidenceChart />
      </div>

      <div className="col-span-12 md:col-span-4">
        <TowerSignalChart />
      </div>

      <div className="col-span-12 md:col-span-4">
        <RadiusTrendChart />
      </div>

      {/* Investigation Statistics */}
      <div className="col-span-12">
        <InvestigationStatistics />
      </div>

      {/* Timeline */}
      <div className="col-span-12 lg:col-span-6">
        <TimelinePanel />
      </div>

      {/* Tower Status */}
      <div className="col-span-12 lg:col-span-6">
        <TowerStatusPanel />
      </div>

      {/* Alerts */}
      <div className="col-span-12">
        <AlertsPanel />
      </div>

      {/* Case Summary */}
      <div className="col-span-12">
        <CaseSummary />
      </div>

    </div>
  );
}