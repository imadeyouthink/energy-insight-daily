import type { DailyEntry } from "@/lib/data";

const DAY_INITIALS = ["S", "M", "T", "W", "T", "F", "S"];

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

function Row({ label, points }: { label: string; points: (number | null)[] }) {
  const lastValue = points[points.length - 1] ?? null;

  return (
    <div className="contents">
      <span className="text-[11px] font-semibold uppercase leading-none tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <div className="grid h-7 grid-cols-7 items-end">
        {points.map((v, i) => {
          const isToday = i === points.length - 1;
          const height = v == null ? 3 : 20 + ((v - 1) / 4) * 80;
          return (
            <span key={i} className="flex h-full items-end justify-center">
              <span
                className={`w-1.5 rounded-full ${
                  v == null
                    ? "bg-foreground/10"
                    : isToday
                      ? "bg-foreground"
                      : "bg-foreground/25"
                }`}
                style={{ height: `${height}%` }}
              />
            </span>
          );
        })}
      </div>
      <span className="text-right text-[13px] font-semibold tabular-nums tracking-tight leading-none text-foreground">
        {lastValue ?? "—"}
      </span>
    </div>
  );
}

export function TrendSparklines({
  entries,
  today,
}: {
  entries: DailyEntry[];
  today: string;
}) {
  const days = lastSevenDays(today);
  const byDate = new Map(entries.map((e) => [e.entry_date, e]));
  const pick = (key: "sleep" | "energy" | "stress") =>
    days.map((d) => {
      const entry = byDate.get(d);
      return entry ? (entry[key] as number) : null;
    });

  return (
    <div className="mt-3 grid grid-cols-[3.5rem_1fr_1.25rem] items-center gap-x-3 gap-y-2.5">
      <Row label="Sleep" points={pick("sleep")} />
      <Row label="Energy" points={pick("energy")} />
      <Row label="Stress" points={pick("stress")} />

      <span className="block" />
      <div className="grid h-4 grid-cols-7 items-center">
        {days.map((d) => (
          <span
            key={d}
            className="text-center text-[10px] leading-none tracking-tight text-muted-foreground"
          >
            {DAY_INITIALS[new Date(`${d}T00:00:00`).getDay()]}
          </span>
        ))}
      </div>
      <span className="block" />
    </div>
  );
}
