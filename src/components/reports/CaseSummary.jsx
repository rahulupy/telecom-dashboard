import Card from "../ui/Card";

export default function CaseSummary() {
  return (
    <Card title="📄 Case Summary">

      <div className="grid grid-cols-2 gap-6">

        <div>
          <p className="text-slate-400 text-sm">Case ID</p>
          <h3 className="text-white font-semibold">
            PS09-001
          </h3>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Officer</p>
          <h3 className="text-white font-semibold">
            Officer A
          </h3>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Status</p>
          <h3 className="text-green-400 font-semibold">
            ACTIVE
          </h3>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Confidence</p>
          <h3 className="text-blue-400 font-semibold">
            92%
          </h3>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Search Radius</p>
          <h3 className="text-white font-semibold">
            100 m
          </h3>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Nearby Towers</p>
          <h3 className="text-white font-semibold">
            4
          </h3>
        </div>

      </div>

    </Card>
  );
}