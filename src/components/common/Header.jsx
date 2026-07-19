import { Bell, UserCircle2 } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div>
        <h2 className="text-2xl font-semibold">
          Ground Officer Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <Bell className="cursor-pointer" />
        <UserCircle2 size={32} />
      </div>
    </header>
  );
}