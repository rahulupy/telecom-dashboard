import {
  LayoutDashboard,
  MapPinned,
  Flame,
  Clock3,
  FileText,
  Settings,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Localization", icon: MapPinned },
  { name: "Heatmap", icon: Flame },
  { name: "Timeline", icon: Clock3 },
  { name: "Reports", icon: FileText },
  { name: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold">Telecom Tracker</h1>
        <p className="text-sm text-slate-400">
          Ground Officer Dashboard
        </p>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
            const Icon = item.icon;

            return (
                <button
  key={item.name}
  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition ${
    item.name === "Dashboard"
      ? "bg-blue-600 text-white"
      : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`}
>
  <Icon size={20} />
  <span>{item.name}</span>
</button>
    );
  })}
</nav>

<div className="mt-auto border-t border-slate-700 p-4">
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
      R
    </div>

    <div>
      <p className="font-semibold">Rahul Upadhyay</p>
      <p className="text-xs text-slate-400">
        Ground Officer
      </p>
    </div>
  </div>

  <p className="text-xs text-slate-500 mt-4">
    Telecom Tracker v1.0
  </p>
</div>
    </aside>
  );
}