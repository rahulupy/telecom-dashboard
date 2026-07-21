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

const data = [
  { tower: "T001", signal: -62 },
  { tower: "T002", signal: -58 },
  { tower: "T003", signal: -91 },
  { tower: "T004", signal: -105 },
];

export default function TowerSignalChart() {
  return (
    <Card title="📡 Tower Signal Strength">
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

            <XAxis
              dataKey="tower"
              stroke="#94A3B8"
            />

            <YAxis
              stroke="#94A3B8"
            />

            <Tooltip />

            <Bar
              dataKey="signal"
              radius={[6, 6, 0, 0]}
              fill="#22C55E"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}