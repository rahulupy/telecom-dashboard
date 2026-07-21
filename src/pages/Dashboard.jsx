import DashboardLayout from "../layouts/DashboardLayout";
import DashboardGrid from "../components/dashboard/DashboardGrid";
import StatusCards from "../components/dashboard/StatusCards";
import Footer from "../components/common/Footer";
import MissionBanner from "../components/dashboard/MissionBanner";

export default function Dashboard() {
  return (
    <div className="animate-fadeIn">
    <DashboardLayout>
      <MissionBanner />
    <div className="mb-6">
      <h2 className="text-3xl font-bold text-white">
        Operational Overview
      </h2>

      <p className="mt-1 text-slate-400">
        Real-time multi-tower localization and field monitoring.
      </p>
    </div>

      <StatusCards />
      <DashboardGrid />
      <Footer />
    </DashboardLayout>
    </div>
  );
}