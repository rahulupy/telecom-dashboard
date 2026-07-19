import DashboardLayout from "../layouts/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold">
        Welcome Officer
      </h2>

      <p className="mt-2 text-gray-600">
        Live telecom tracking dashboard.
      </p>
    </DashboardLayout>
  );
}