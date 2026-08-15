import { formatDay, todayKey } from "@/lib/cycle";
import type { DailyEntry } from "@/lib/data";
import {
  STATUS_BG,
  dayStatus,
  energyStatus,
  sleepStatus,
  stressStatus,
  type MetricStatus,
} from "@/lib/status";
import { cn } from "@/lib/utils";

const STATUS_TEXT: Record<MetricStatus, string> = {
  ok: "text-status-ok-foreground",
  attention: "text-status-attention-foreground",
  caution: "text-status-caution-foreground",
};

const STATUS_BY_LABEL = {
  S: sleepStatus,
  E: energyStatus,
  St: stressStatus,
  D: dayStatus,
} satisfies Record<string, (value: number) => MetricStatus>;


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
            <div className="flex shrink-0 gap-3">
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

function Stat({ label, value }: { label: keyof typeof STATUS_BY_LABEL; value: number }) {
  const status = STATUS_BY_LABEL[label](value);
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-semibold",
          STATUS_BG[status],
          STATUS_TEXT[status],
        )}
      >
        {value}
      </span>
      <span className="text-[10px] font-medium tracking-tight text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
