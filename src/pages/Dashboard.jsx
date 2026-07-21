import DashboardLayout from "../layouts/DashboardLayout";
import DashboardGrid from "../components/dashboard/DashboardGrid";
import StatusCards from "../components/dashboard/StatusCards";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <StatusCards />
      <DashboardGrid />
    </DashboardLayout>
  );
}