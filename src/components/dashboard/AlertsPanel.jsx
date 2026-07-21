import Card from "../ui/Card";
import {
  CheckCircle2,
  AlertTriangle,
  RadioTower,
  ArrowRightCircle,
} from "lucide-react";

import { getAlerts } from "../../services/alertService";

export default function AlertsPanel() {
  const alerts = getAlerts();

  return (
    <Card title="🚨 Localization Alerts">
      <div className="space-y-3">
        {alerts.map((alert) => {

          let Icon = CheckCircle2;
          let color = "text-green-400";

          switch (alert.type) {
            case "info":
              Icon = RadioTower;
              color = "text-blue-400";
              break;

            case "warning":
              Icon = ArrowRightCircle;
              color = "text-yellow-400";
              break;

            case "error":
              Icon = AlertTriangle;
              color = "text-red-400";
              break;
          }

          return (
            <div
              key={alert.id}
              className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 hover:bg-slate-800 transition"
            >
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <Icon className={color} size={20} />

                  <div>
                    <h4 className="text-white font-medium">
                      {alert.title}
                    </h4>

                    <p className="text-slate-400 text-sm">
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