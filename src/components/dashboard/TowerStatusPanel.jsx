import Card from "../ui/Card";
import {
  RadioTower,
  Wifi,
  WifiLow,
  WifiOff,
  Building2,
  Compass,
} from "lucide-react";

import useTowers from "../../hooks/useTowers";
import LoadingCard from "../common/LoadingCard";
import ErrorCard from "../common/ErrorCard";

export default function TowerStatusPanel() {
  const { data: towers, loading, error } = useTowers();

  if (loading) {
    return <LoadingCard title="📡 Tower Status" />;
  }

  if (error) {
    return (
      <ErrorCard
        title="📡 Tower Status"
        message="Unable to load tower data."
      />
    );
  }

  return (
    <Card title="📡 Tower Status">
      <div className="space-y-4">

        {towers.map((tower) => {

          let Icon = Wifi;
          let color = "text-green-400";
          let badge = "CONNECTED";
          let badgeColor = "bg-green-500";

          if (tower.status === "Weak") {
            Icon = WifiLow;
            color = "text-yellow-400";
            badge = "WEAK";
            badgeColor = "bg-yellow-500";
          }

          if (tower.status === "Lost") {
            Icon = WifiOff;
            color = "text-red-400";
            badge = "LOST";
            badgeColor = "bg-red-500";
          }

          const signalStrength =
            tower.signal == null
              ? 0
              : Math.max(
                  0,
                  Math.min(100, ((tower.signal + 110) / 60) * 100)
                );

          return (
            <div
              key={tower.id}
              className="rounded-xl border border-slate-700 bg-slate-800/60 p-4 transition hover:bg-slate-800"
            >

              {/* Header */}
              <div className="mb-4 flex items-center justify-between">

                <div className="flex items-center gap-3">
                  <RadioTower
                    className={color}
                    size={20}
                  />

                  <div>
                    <h4 className="font-semibold text-white">
                      {tower.id}
                    </h4>

                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold text-white ${badgeColor}`}
                    >
                      {badge}
                    </span>
                  </div>
                </div>

                <Icon
                  className={color}
                  size={22}
                />

              </div>

              {/* Signal */}
              <div className="mb-4">

                <div className="mb-2 flex justify-between text-sm">

                  <span className="text-slate-400">
                    Signal
                  </span>

                  <span className="text-white">
                    {tower.signal ?? "--"} dBm
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-700">

                  <div
                    className="h-full rounded-full bg-green-500 transition-all duration-500"
                    style={{
                      width: `${signalStrength}%`,
                    }}
                  />

                </div>

              </div>

              {/* Details */}

              <div className="space-y-2 text-sm">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2 text-slate-400">
                    <Building2 size={16} />
                    Operator
                  </div>

                  <span className="text-white">
                    {tower.operator}
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2 text-slate-400">
                    <Compass size={16} />
                    Sector
                  </div>

                  <span className="text-white">
                    {tower.sector}
                  </span>

                </div>

              </div>

            </div>
          );
        })}

      </div>
    </Card>
  );
}