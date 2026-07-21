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

const data = [
  { time: "10:20", radius: 250 },
  { time: "10:25", radius: 180 },
  { time: "10:30", radius: 140 },
  { time: "10:35", radius: 120 },
  { time: "10:40", radius: 100 },
];

export default function RadiusTrendChart() {
  return (
    <Card title="📍 Search Radius Trend">
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

            <XAxis
              dataKey="time"
              stroke="#94A3B8"
            />

            <YAxis
              stroke="#94A3B8"
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="radius"
              stroke="#F59E0B"
              fill="#F59E0B"
              fillOpacity={0.25}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}