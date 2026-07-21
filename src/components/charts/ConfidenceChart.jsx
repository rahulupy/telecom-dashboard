import {
  LineChart,
  Line,
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

export default function ConfidenceChart() {
  const { confidence, loading, error } = useCharts();

  if (loading) {
    return <LoadingCard title="📈 Confidence Trend" />;
  }

  if (error) {
    return (
      <ErrorCard
        title="📈 Confidence Trend"
        message="Unable to load confidence data."
      />
    );
  }

  return (
    <Card title="📈 Confidence Trend">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={confidence}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="time"
              stroke="#94A3B8"
            />

            <YAxis
              domain={[60, 100]}
              stroke="#94A3B8"
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="confidence"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
              isAnimationActive
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}