import { formatDay, todayKey } from "@/lib/cycle";
import type { DailyEntry } from "@/lib/data";
import { cn } from "@/lib/utils";

export function History({ entries }: { entries: DailyEntry[] }) {
  if (entries.length === 0) return null;
  const today = todayKey();

  return (
    <section>
      <div>
        {entries.map((e) => (
          <div
            key={e.entry_date}
            className={cn(
              "flex items-center justify-between gap-3 py-3.5",
              e.entry_date === today && "-mx-3 rounded-2xl bg-secondary px-3",
            )}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium tracking-tight text-foreground">
                {formatDay(e.entry_date)}
                {e.entry_date === today && (
                  <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase text-primary-foreground">
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
            <div className="flex shrink-0 gap-3 text-xs text-muted-foreground">
              <Stat label="S" value={e.sleep} />
              <Stat label="E" value={e.energy} />
              <Stat label="St" value={e.stress} />
              <Stat label="D" value={e.day_intensity} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span className="tabular-nums">
      {label}
      <span className="ml-1 font-semibold text-foreground">{value}</span>
    </span>
  );
}
