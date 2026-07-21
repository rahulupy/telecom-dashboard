import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import Card from "../ui/Card";
import LoadingCard from "../common/LoadingCard";
import ErrorCard from "../common/ErrorCard";
import useCharts from "../../hooks/useCharts";

export default function TowerSignalChart() {
  const { signal, loading, error } = useCharts();

  if (loading) {
    return <LoadingCard title="📡 Tower Signal Strength" />;
  }

  if (error) {
    return (
      <ErrorCard
        title="📡 Tower Signal Strength"
        message="Unable to load signal data."
      />
    );
  }

  return (
    <Card title="📡 Tower Signal Strength">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={signal}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="tower"
              stroke="#94A3B8"
            />

            <YAxis stroke="#94A3B8" />

            <Tooltip />

            <Bar
              dataKey="signal"
              fill="#22C55E"
              radius={[6, 6, 0, 0]}
              animationDuration={1200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}