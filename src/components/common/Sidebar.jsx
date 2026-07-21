import {
  LayoutDashboard,
  MapPinned,
  Flame,
  Clock3,
  FileText,
  Settings,
  ShieldCheck,
  ChevronRight,
  Wifi,
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
    <aside className="w-56 min-h-screen bg-slate-950 border-r border-slate-800 text-white flex flex-col">

      {/* Logo */}
      <div className="border-b border-slate-800 p-6">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
            <ShieldCheck
              size={24}
              className="text-white"
            />
          </div>

        <div>

          <h1 className="text-xl font-bold text-white">
            Telecom Tracker
          </h1>

          <p className="text-xs text-slate-400">
            Ground Officer System
          </p>

        </div>

      </div>

    </div>

      {/* Navigation */}

      <nav className="flex-1 px-4 py-6">

        {/* Section Title */}
        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Navigation
        </p>

        <div className="space-y-2">

          {menuItems.map((item) => {

            const Icon = item.icon;
            const active = item.name === "Dashboard";

            return (
              <button
                key={item.name}
                className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 transition-all duration-300 ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span className="font-medium">
                    {item.name}
                  </span>
                </div>

                {active && <ChevronRight size={18} />}
              </button>
            );

          })}

        </div>

      </nav>

      {/* Status */}

      <div className="border-t border-slate-800 p-5">

        <div className="mb-5 rounded-xl border border-slate-700 bg-slate-900 p-4">

          <div className="flex items-center gap-3">

            <div className="relative">

              <Wifi
              size={18}
              className="text-green-400"
              />

              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />

            </div>

          <div>

          <p className="font-semibold text-white">
            Connected
          </p>

          <p className="text-xs text-slate-400">
            Mock Backend
          </p>

        </div>

      </div>

    </div>

    </div>

        {/* User Card */}
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-lg font-bold text-white shadow-lg">
          R
        </div>

        <div>

          <p className="font-semibold text-white">
            Rahul Upadhyay
          </p>

          <p className="text-xs text-slate-400">
            Ground Officer
          </p>

        </div>

      </div>

      <div className="mt-4 border-t border-slate-700 pt-3">

        <div className="flex items-center justify-between">

          <span className="text-xs text-slate-500">
            Version
          </span>

          <span className="text-xs font-semibold text-slate-300">
            v1.0
          </span>

        </div>

      </div>

    </div>  

    </aside>
  );
}