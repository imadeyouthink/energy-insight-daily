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
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/75 bg-gradient-to-b from-white/55 via-white/30 to-white/10 p-1.5 shadow-[0_24px_60px_-24px_oklch(0.55_0.03_260/0.35),0_12px_28px_-12px_oklch(0.55_0.03_260/0.18),inset_0_1px_0_0_oklch(1_0_0/0.6)] backdrop-blur-[30px] saturate-[200%]">
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
