import DashboardLayout from "../layouts/DashboardLayout";
import DashboardGrid from "../components/dashboard/DashboardGrid";
import MapPlaceholder from "../components/map/MapPlaceholder";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        Ground Officer Dashboard
      </h1>

      <DashboardGrid />

      <div className="mt-6">
        <MapPlaceholder />
      </div>
    </DashboardLayout>
  );
}