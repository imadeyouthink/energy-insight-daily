import { Link } from "@tanstack/react-router";
import { CalendarDays, Home, Sparkles } from "lucide-react";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/plan", label: "Plan", icon: Sparkles },
  { to: "/history", label: "History", icon: CalendarDays },
] as const;

export function TabBar() {
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-[calc(env(safe-area-inset-bottom)+16px)]">
      <div className="glass pointer-events-auto flex items-center gap-1 rounded-full p-1.5 shadow-lg shadow-black/5">
        {tabs.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-primary text-primary-foreground" }}
            inactiveProps={{ className: "text-muted-foreground" }}
            className="flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium tracking-tight transition-colors"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
