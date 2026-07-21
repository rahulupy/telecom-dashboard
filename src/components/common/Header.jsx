import { Bell, UserCircle2 } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6">
      <div>
        <h2 className="text-2xl font-bold text-white">
          Ground Officer Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <Bell className="text-slate-300 hover:text-white cursor-pointer" />
        <UserCircle2 className="text-slate-300" size={34} />
      </div>
    </header>
  );
}