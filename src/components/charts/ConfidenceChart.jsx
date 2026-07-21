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

const data = [
  { time: "10:20", confidence: 74 },
  { time: "10:25", confidence: 79 },
  { time: "10:30", confidence: 84 },
  { time: "10:35", confidence: 88 },
  { time: "10:40", confidence: 92 },
];

export default function ConfidenceChart() {
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
              domain={[60, 100]}
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