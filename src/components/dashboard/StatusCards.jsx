import {
  FileText,
  Activity,
  Target,
  Gauge,
} from "lucide-react";

import StatusCard from "./StatusCard";
import useLocalization from "../../hooks/useLocalization";
import LoadingCard from "../common/LoadingCard";
import ErrorCard from "../common/ErrorCard";

export default function StatusCards() {
  const { data, loading, error } = useLocalization();

  if (loading) {
    return <LoadingCard title="Dashboard Overview" />;
  }

  if (error) {
    return (
      <ErrorCard
        title="Dashboard Overview"
        message="Unable to load dashboard statistics."
      />
    );
  }

  const cards = [
    {
      title: "Case ID",
      value: data.caseId,
      subtitle: "Live Investigation",
      color: "border-blue-500",
      icon: FileText,
    },
    {
      title: "Status",
      value: data.engineStatus,
      subtitle: "Localization Running",
      color: "border-green-500",
      icon: Activity,
    },
    {
      title: "Confidence",
      value: data.confidence,
      unit: "%",
      subtitle: "Localization Accuracy",
      color: "border-cyan-500",
      icon: Target,
    },
    {
      title: "Radius",
      value: data.radius,
      unit: "m",
      subtitle: data.direction,
      color: "border-orange-500",
      icon: Gauge,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatusCard
          key={card.title}
          {...card}
        />
      ))}
    </div>
  );
}