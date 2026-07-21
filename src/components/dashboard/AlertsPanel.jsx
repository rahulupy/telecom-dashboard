import Card from "../ui/Card";
import LoadingCard from "../common/LoadingCard";
import ErrorCard from "../common/ErrorCard";

import {
  CheckCircle2,
  AlertTriangle,
  RadioTower,
  ArrowRightCircle,
} from "lucide-react";

import useAlerts from "../../hooks/useAlerts";

export default function AlertsPanel() {
  const { data: alerts, loading, error } = useAlerts();

  if (loading) {
    return <LoadingCard title="🚨 Localization Alerts" />;
  }

  if (error) {
    return (
      <ErrorCard
        title="🚨 Localization Alerts"
        message="Unable to load alerts."
      />
    );
  }

  return (
    <Card title="🚨 Localization Alerts">

      <div className="max-h-64 space-y-3 overflow-y-auto pr-2">

        {alerts.map((alert) => {

          let Icon = RadioTower;
          let iconColor = "text-blue-400";
          let badge = "INFO";
          let badgeColor = "bg-blue-500";

          switch (alert.type) {
            case "success":
              Icon = CheckCircle2;
              iconColor = "text-green-400";
              badge = "SUCCESS";
              badgeColor = "bg-green-500";
              break;

            case "warning":
              Icon = ArrowRightCircle;
              iconColor = "text-yellow-400";
              badge = "WARNING";
              badgeColor = "bg-yellow-500";
              break;

            case "error":
              Icon = AlertTriangle;
              iconColor = "text-red-400";
              badge = "CRITICAL";
              badgeColor = "bg-red-500";
              break;
          }

          return (
            <div
              key={alert.id}
              className="rounded-xl border border-slate-700 bg-slate-800/60 p-4 transition hover:bg-slate-800"
            >
              <div className="mb-2 flex items-center justify-between">

                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold text-white ${badgeColor}`}
                >
                  {badge}
                </span>

                <span className="text-xs text-slate-500">
                  {alert.time}
                </span>

              </div>

              <div className="flex gap-3">

                <Icon
                  className={iconColor}
                  size={20}
                />

                <div>

                  <h4 className="font-semibold text-white">
                    {alert.title}
                  </h4>

                  <p className="mt-1 text-sm text-slate-400">
                    {alert.message}
                  </p>

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </Card>
  );
}