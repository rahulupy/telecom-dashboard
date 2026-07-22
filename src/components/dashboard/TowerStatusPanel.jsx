import Card from "../ui/Card";
import { RadioTower, Compass } from "lucide-react";

import useTowers from "../../hooks/useTowers";
import LoadingCard from "../common/LoadingCard";
import ErrorCard from "../common/ErrorCard";

export default function TowerStatusPanel() {
  const { data: towers, loading, error } = useTowers();

  if (loading) {
    return <LoadingCard title="📡 Tower Network" />;
  }

  if (error) {
    return (
      <ErrorCard
        title="📡 Tower Network"
        message="Unable to load tower data."
      />
    );
  }

  return (
    <Card title={`📡 Connected Towers (${towers.length})`}>
      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">

        {towers.map((tower) => (
          <div
            key={`${tower.tower_id}-${tower.site_id}`}
            className="rounded-xl border border-slate-700 bg-slate-800/60 p-4"
          >
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <RadioTower
                  size={20}
                  className="text-green-400"
                />

                <div>

                  <h4 className="font-semibold text-white">
                    {tower.tower_id}
                  </h4>

                  <p className="text-xs text-slate-400">
                    Site {tower.site_id}
                  </p>

                </div>

              </div>

              <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
                ONLINE
              </span>

            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">

              <div>
                <p className="text-slate-500">Operator</p>
                <p className="text-white">{tower.operator}</p>
              </div>

              <div>
                <p className="text-slate-500">Azimuth</p>
                <p className="flex items-center gap-1 text-white">
                  <Compass size={14} />
                  {Number(tower.azimuth_deg).toFixed(1)}°
                </p>
              </div>

            </div>

          </div>
        ))}

      </div>
    </Card>
  );
}