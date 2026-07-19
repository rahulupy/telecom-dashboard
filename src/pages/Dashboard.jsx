import DashboardLayout from "../layouts/DashboardLayout";
import DashboardGrid from "../components/dashboard/DashboardGrid";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        Ground Officer Dashboard
      </h1>

      <DashboardGrid />
    </DashboardLayout>
  );
}