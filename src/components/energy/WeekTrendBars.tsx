import type { DailyEntry } from "@/lib/data";

type MetricKey = "sleep" | "energy" | "stress";

const TINT: Record<MetricKey, string> = {
  sleep: "bg-card-sleep",
  energy: "bg-card-energy",
  stress: "bg-card-stress",
};

function lastSevenDays(today: string): string[] {
  const base = new Date(`${today}T00:00:00`);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() - (6 - i));
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  });
}

function Row({
  label,
  metric,
  values,
}: {
  label: string;
  metric: MetricKey;
  values: (number | null)[];
}) {
  return (
    <div className="grid grid-cols-[3.5rem_1fr] items-end gap-x-3">
      <span className="pb-0.5 text-[11px] font-semibold uppercase leading-none tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <div className="flex h-8 items-end gap-1.5">
        {values.map((v, i) => {
          const isLast = i === values.length - 1;
          const pct = v ? (v / 5) * 100 : 12;
          return (
            <div key={i} className="flex h-full flex-1 items-end">
              <div
                className={`w-full rounded-full ${
                  v == null ? "bg-muted" : isLast ? "bg-foreground" : TINT[metric]
                }`}
                style={{ height: `${pct}%` }}
                aria-hidden="true"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WeekTrendBars({
  entries,
  today,
}: {
  entries: DailyEntry[];
  today: string;
}) {
  const days = lastSevenDays(today);
  const byDate = new Map(entries.map((e) => [e.entry_date, e]));
  const pick = (key: MetricKey) =>
    days.map((d) => {
      const entry = byDate.get(d);
      return entry ? (entry[key] as number) : null;
    });

  return (
    <section className="space-y-4">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        This week's trend
      </h2>
      <div className="space-y-3">
        <Row label="Sleep" metric="sleep" values={pick("sleep")} />
        <Row label="Energy" metric="energy" values={pick("energy")} />
        <Row label="Stress" metric="stress" values={pick("stress")} />
      </div>
    </section>
  );
}
