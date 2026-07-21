import Card from "../common/Card";
import LoadingCard from "../common/LoadingCard";
import ErrorCard from "../common/ErrorCard";

import useTimeline from "../../hooks/useTimeline";

import {
  RadioTower,
  MapPinned,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function TimelinePanel() {
  const { data: timeline, loading, error } = useTimeline();

  if (loading) {
    return <LoadingCard title="📜 Activity Timeline" />;
  }

  if (error) {
    return (
      <ErrorCard
        title="📜 Activity Timeline"
        message="Unable to load timeline."
      />
    );
  }

  return (
    <Card title="📜 Activity Timeline">
      <div className="space-y-4">

        {timeline.map((item) => {

          let Icon = CheckCircle2;
          let color = "text-green-400";
          let border = "border-green-500";

          switch (item.type) {
            case "tower":
              Icon = RadioTower;
              color = "text-blue-400";
              border = "border-blue-500";
              break;

            case "location":
              Icon = MapPinned;
              color = "text-purple-400";
              border = "border-purple-500";
              break;

            case "warning":
              Icon = AlertTriangle;
              color = "text-yellow-400";
              border = "border-yellow-500";
              break;

            case "success":
              Icon = CheckCircle2;
              color = "text-green-400";
              border = "border-green-500";
              break;

            default:
              break;
          }

          return (
            <div
              key={item.id}
              className={`rounded-xl border-l-4 ${border} bg-slate-800/50 p-4 hover:bg-slate-800 transition`}
            >
              <div className="flex justify-between">

                <div className="flex gap-3">

                  <Icon
                    className={color}
                    size={22}
                  />

                  <div>

                    <h4 className="text-white font-semibold">
                      {item.title}
                    </h4>

                    <p className="text-slate-400 text-sm mt-1">
                      {item.description}
                    </p>

                  </div>

                </div>

                <span className="text-xs text-slate-500">
                  {item.time}
                </span>

              </div>
            </div>
          );

        })}

      </div>
    </Card>
  );
}