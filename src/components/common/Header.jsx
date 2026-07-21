import {
  Bell,
  UserCircle2,
  Wifi,
  ShieldCheck,
} from "lucide-react";

import useLocalization from "../../hooks/useLocalization";

export default function Header() {
  const { data } = useLocalization();

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950 px-6">

      {/* Left */}
      <div className="flex items-center gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
          <ShieldCheck size={24} className="text-white" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">
            Telecom Tracker
          </h1>

          <p className="text-sm text-slate-400">
            Ground Officer Localization Dashboard
          </p>
        </div>

      </div>

      {/* Center */}
      <div className="hidden lg:flex items-center gap-10">

        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Case
          </p>

          <p className="font-semibold text-white">
            {data?.caseId}
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Status
          </p>

          <div className="flex items-center gap-2">

            <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />

            <span className="font-semibold text-green-400">
              {data?.engineStatus}
            </span>

          </div>

        </div>

        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Last Sync
          </p>

          <p className="font-semibold text-white">
            {data?.lastUpdate}
          </p>
        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        <div className="hidden md:flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">

          <Wifi
            size={18}
            className="text-green-400"
          />

          <span className="text-sm text-green-400">
            Connected
          </span>

        </div>

        <button className="relative">

          <Bell
            size={22}
            className="text-slate-300 transition hover:text-white"
          />

          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500" />

        </button>

        <UserCircle2
          size={38}
          className="text-slate-300"
        />

      </div>

    </header>
  );
}