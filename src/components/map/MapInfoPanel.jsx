import { useState, useEffect } from "react";
import Badge from "../ui/Badge";
import { getLocalization } from "../../services/localizationService";

export default function MapInfoPanel() {
  const [data, setData] = useState(getLocalization());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(getLocalization());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-20 right-4 z-[1000] w-72 rounded-2xl border border-slate-700/50 bg-slate-900/90 backdrop-blur-xl p-5 shadow-2xl">

      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">
          Case {data.caseId}
        </h3>

        <Badge color="green">
          {data.engineStatus}
        </Badge>
      </div>

      <div className="mt-5 space-y-4">

        <div className="flex justify-between">
          <span className="text-slate-400">Confidence</span>
          <span className="text-blue-400 font-semibold">
            {data.confidence}%
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Search Radius</span>
          <span className="text-white">
            {data.radius} m
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Engine</span>
          <span className="text-white">
            {data.engineStatus}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Updated</span>
          <span className="text-white">
            {data.lastUpdate}
          </span>
        </div>

      </div>

    </div>
  );
}