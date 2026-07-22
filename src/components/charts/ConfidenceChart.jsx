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
import useCharts from "../../hooks/useCharts";

export default function ConfidenceChart() {
  const { data, loading, error } = useCharts();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Failed to load chart.</div>;
  }

  return (
    <Card title="📈 Confidence Trend">
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

            <XAxis
              dataKey="time"
              stroke="#94A3B8"
            />

            <YAxis
              domain={[50, 100]}
              stroke="#94A3B8"
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="confidence"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}