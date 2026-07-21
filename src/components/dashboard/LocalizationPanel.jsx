import Card from "../ui/Card";
import Badge from "../ui/Badge";
import {
  RadioTower,
  LocateFixed,
  Compass,
  Clock3,
} from "lucide-react";
import useLocalization from "../../hooks/useLocalization";
import LoadingCard from "../common/LoadingCard";
import ErrorCard from "../common/ErrorCard";
import useDemo from "../../hooks/useDemo";

export default function LocalizationPanel() {

  const demo = useDemo();

  const { data, loading, error } = useLocalization();

  if (loading) {
  return <LoadingCard title="📡 Localization Status" />;
}

if (error) {
  return (
    <ErrorCard
      title="📡 Localization Status"
      message="Unable to load localization data."
    />
  );
}

  return (
    <Card title="📡 Localization Status">
      <div className="space-y-4">

        <div className="flex items-center justify-between">
          <span className="text-slate-400">Engine</span>
          <Badge color="green">{data.engineStatus}</Badge>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-slate-400">Confidence</span>
            <span className="text-blue-400 font-semibold">
              {demo.confidence}%
            </span>
          </div>

          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${demo.confidence}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LocateFixed className="text-blue-400" size={20} />
          <div>
            <p className="text-slate-400 text-sm">Search Radius</p>
            <h3 className="text-white text-xl font-semibold">
              {demo.radius} m
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <RadioTower className="text-green-400" size={20} />
          <div>
            <p className="text-slate-400 text-sm">Nearby Towers</p>
            <h3 className="text-white text-xl font-semibold">
              {data.nearbyTowers}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Compass className="text-yellow-400" size={20} />
          <div>
            <p className="text-slate-400 text-sm">Estimated Direction</p>
            <h3 className="text-white text-xl font-semibold">
              {demo.direction}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock3 className="text-slate-400" size={20} />
          <div>
            <p className="text-slate-400 text-sm">Last Update</p>
            <h3 className="text-white">{data.lastUpdate}</h3>
          </div>
        </div>

      </div>
    </Card>
    
  );
}