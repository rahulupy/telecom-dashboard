import {
  LayoutDashboard,
  MapPinned,
  Flame,
  Clock3,
  FileText,
  Settings,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: MapPinned, label: "Live Tracking" },
  { icon: Flame, label: "Heatmap" },
  { icon: Clock3, label: "Timeline" },
  { icon: FileText, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold">Telecom Tracker</h1>
        <p className="text-sm text-slate-400">
          Ground Officer Dashboard
        </p>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition"
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}