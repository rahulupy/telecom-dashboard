import { FileText, Activity, Target, Gauge } from "lucide-react";
import StatusCard from "./StatusCard";

const cards = [
  {
    title: "Case ID",
    value: "PS09-001",
    icon: FileText,
  },
  {
    title: "Status",
    value: "Moving",
    icon: Activity,
  },
  {
    title: "Confidence",
    value: "92",
    unit: "%",
    icon: Target,
  },
  {
    title: "Speed",
    value: "8",
    unit: "km/h",
    icon: Gauge,
  },
];

export default function StatusCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <StatusCard
          key={card.title}
          title={card.title}
          value={card.value}
          unit={card.unit}
          icon={card.icon}
        />
      ))}
    </div>
  );
}