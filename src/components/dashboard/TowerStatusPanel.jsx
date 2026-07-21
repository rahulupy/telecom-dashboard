import Card from "../ui/Card";
import {
  RadioTower,
  Wifi,
  WifiLow,
  WifiOff,
} from "lucide-react";

import useTowers from "../../hooks/useTowers";
import LoadingCard from "../common/LoadingCard";
import ErrorCard from "../common/ErrorCard";

export default function TowerStatusPanel() {
  const { data: towers, loading, error } = useTowers();

  if (loading) {
    return <LoadingCard title="📡 Tower Status"/>
  }

  if (error) {
    return (
      <ErrorCard title="📡 Tower Status"
      message="Unable to load tower data."/>
    );
  }

  return (
    <Card title="📡 Tower Status">
      <div className="space-y-3">
        {towers.map((tower) => {
          let Icon = Wifi;
          let color = "text-green-400";

          if (tower.status === "Weak") {
            Icon = WifiLow;
            color = "text-yellow-400";
          }

          if (tower.status === "Lost") {
            Icon = WifiOff;
            color = "text-red-400";
          }

          return (
            <div
              key={tower.id}
              className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/50 p-3"
            >
              <div className="flex items-center gap-3">
                <RadioTower className={color} size={18} />

                <div>
                  <h4 className="text-white font-medium">
                    {tower.id}
                  </h4>

                  <p className={`text-sm ${color}`}>
                    {tower.status}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Icon className={color} size={18} />

                <span className="text-slate-300 text-sm">
                  {tower.signal ?? "--"} dBm
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}