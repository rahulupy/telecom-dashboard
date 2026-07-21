import Card from "../ui/Card";
import LoadingCard from "../common/LoadingCard";
import ErrorCard from "../common/ErrorCard";

import useAlerts from "../../hooks/useAlerts";

import {
  Info,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

export default function AlertsPanel() {

  const { data: alerts, loading, error } = useAlerts();

  if (loading) {
    return (
      <LoadingCard title="🚨 Localization Alerts" />
    );
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

      <div className="space-y-4">

        {alerts.map((alert) => {

          let Icon = Info;
          let border = "border-blue-500";
          let badge = "bg-blue-500/20 text-blue-400";

          switch (alert.severity) {

            case "warning":
              Icon = AlertTriangle;
              border = "border-yellow-500";
              badge = "bg-yellow-500/20 text-yellow-400";
              break;

            case "critical":
              Icon = ShieldAlert;
              border = "border-red-500";
              badge = "bg-red-500/20 text-red-400";
              break;

            default:
              break;
          }

          return (

            <div
              key={alert.id}
              className={`border-l-4 ${border} rounded-xl bg-slate-800/60 p-4 hover:bg-slate-800 transition-all`}
            >

              <div className="flex justify-between">

                <div className="flex gap-3">

                  <Icon
                    className={badge.split(" ")[1]}
                    size={22}
                  />

                  <div>

                    <div className="flex items-center gap-2">

                      <h4 className="font-semibold text-white">
                        {alert.title}
                      </h4>

                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${badge}`}
                      >
                        {alert.severity.toUpperCase()}
                      </span>

                    </div>

                    <p className="text-slate-400 text-sm mt-1">
                      {alert.message}
                    </p>

                  </div>

                </div>

                <span className="text-xs text-slate-500">
                  {alert.time}
                </span>

              </div>

            </div>

          );

        })}

      </div>

    </Card>
  );
}