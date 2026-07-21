import {
  AreaChart,
  Area,
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

export default function RadiusTrendChart() {
  const { radius, loading, error } = useCharts();

  if (loading) {
    return <LoadingCard title="📍 Search Radius Trend" />;
  }

  if (error) {
    return (
      <ErrorCard
        title="📍 Search Radius Trend"
        message="Unable to load radius data."
      />
    );
  }

  return (
    <Card title="📍 Search Radius Trend">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={radius}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="time"
              stroke="#94A3B8"
            />

            <YAxis stroke="#94A3B8" />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="radius"
              stroke="#F97316"
              fill="#F97316"
              fillOpacity={0.25}
              strokeWidth={3}
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}