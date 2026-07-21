import Card from "../common/Card";

export default function OfficerPanel() {
  return (
    <Card title="👮 Officer Information">
      <div className="space-y-3 text-slate-300">

        <div>
          <p className="text-slate-500 text-sm">Name</p>
          <p className="font-semibold text-white">
            Rahul Upadhyay
          </p>
        </div>

        <div>
          <p className="text-slate-500 text-sm">Rank</p>
          <p className="text-white">
            Ground Officer
          </p>
        </div>

        <div>
          <p className="text-slate-500 text-sm">Status</p>

          <span className="inline-flex px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
            Active
          </span>
        </div>

        <div>
          <p className="text-slate-500 text-sm">Location</p>
          <p className="text-white">
            Jammu Sector-3
          </p>
        </div>

      </div>
    </Card>
  );
}