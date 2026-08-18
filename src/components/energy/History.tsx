import { ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { formatDay, todayKey } from "@/lib/cycle";
import type { DailyEntry } from "@/lib/data";
import { cn } from "@/lib/utils";

const CHIPS = [
  { key: "sleep", label: "Slp" },
  { key: "energy", label: "Enrg" },
  { key: "stress", label: "Strs" },
  { key: "caffeine", label: "Coff" },
  { key: "alcohol", label: "Alc" },
] as const;


export function History({ entries }: { entries: DailyEntry[] }) {
  if (entries.length === 0) return null;
  const today = todayKey();

  return (
    <section>
      <div className="divide-y divide-border/70">
        {entries.map((e) => (
          <Link
            key={e.entry_date}
            to="/plan"
            className="flex items-center justify-between gap-3 py-3.5 transition-opacity hover:opacity-80"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-foreground">
                {formatDay(e.entry_date)}
                {e.entry_date === today && (
                  <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-primary-foreground">
                    Today
                  </span>
                )}
              </p>
              {e.cycle_phase && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {e.cycle_phase} · day {e.cycle_day}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2.5">
              {CHIPS.map((c) => (
                <div key={c.key} className="flex flex-col items-center gap-1">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-semibold",
                      c.bg,
                      c.text,
                    )}
                  >
                    {e[c.key]}
                  </span>
                  <span className="text-[10px] font-medium tracking-tight text-muted-foreground">
                    {c.label}
                  </span>
                </div>
              ))}
              <ChevronRight
                aria-hidden
                className="h-4 w-4 shrink-0 text-muted-foreground"
                strokeWidth={2}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
