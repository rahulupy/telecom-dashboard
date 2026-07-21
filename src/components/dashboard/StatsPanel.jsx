import Card from "../common/Card";
import stats from "../../data/stats";

export default function StatsPanel() {
  return (
    <Card title="Quick Statistics">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Connected Towers</p>
          <p className="text-xl font-bold">{stats.connectedTowers}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Search Radius</p>
          <p className="text-xl font-bold">{stats.searchRadius}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">GPS Accuracy</p>
          <p className="text-xl font-bold">{stats.gpsAccuracy}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Confidence</p>
          <p className="text-xl font-bold text-green-600">
            {stats.confidence}
          </p>
        </div>
      </div>
    </Card>
  );
}