import type { DailyEntry } from "@/lib/data";
import { sleepStatus, energyStatus, stressStatus, STATUS_BG } from "@/lib/status";
import type { MetricStatus } from "@/lib/status";

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

type MetricKey = "sleep" | "energy" | "stress";

const statusFor: Record<MetricKey, (v: number) => MetricStatus> = {
  sleep: sleepStatus,
  energy: energyStatus,
  stress: stressStatus,
};

function Dot({
  value,
  metric,
  isToday,
}: {
  value: number | null;
  metric: MetricKey;
  isToday: boolean;
}) {
  const status = value == null ? null : statusFor[metric](value);
  const emptyClass = "bg-[oklch(0.86_0.01_260)]";
  const fillClass = status ? STATUS_BG[status] : emptyClass;

  return (
    <div
      className={`mx-auto rounded-full ${isToday ? "h-2.5 w-2.5" : "h-2 w-2"} ${fillClass} ${
        isToday ? "ring-1 ring-white shadow-sm" : ""
      }`}
      aria-hidden="true"
    />
  );
}

function Row({
  label,
  points,
  metric,
}: {
  label: string;
  points: (number | null)[];
  metric: MetricKey;
}) {
  const lastValue = points[points.length - 1] ?? null;

  return (
    <div className="grid grid-cols-[3.5rem_1fr_1.25rem] items-center gap-x-3">
      <span className="text-[11px] font-semibold uppercase leading-none tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <div className="grid grid-cols-7 items-center gap-1">
        {points.map((v, i) => (
          <Dot key={i} value={v} metric={metric} isToday={i === points.length - 1} />
        ))}
      </div>
      <span className="text-right text-[13px] font-semibold tabular-nums tracking-tight leading-none text-foreground">
        {lastValue ?? "—"}
      </span>
    </div>
  );
}

export function TrendSparklines({ entries, today }: { entries: DailyEntry[]; today: string }) {
  const days = lastSevenDays(today);
  const byDate = new Map(entries.map((e) => [e.entry_date, e]));
  const pick = (key: MetricKey) =>
    days.map((d) => {
      const entry = byDate.get(d);
      return entry ? (entry[key] as number) : null;
    });

  return (
    <div className="space-y-3">
      <Row label="Sleep" points={pick("sleep")} metric="sleep" />
      <Row label="Energy" points={pick("energy")} metric="energy" />
      <Row label="Stress" points={pick("stress")} metric="stress" />

      <div className="grid grid-cols-[3.5rem_1fr_1.25rem] gap-x-3">
        <span />
        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => (
            <span
              key={d}
              className="text-center text-[10px] leading-none tracking-tight text-muted-foreground"
            >
              {DAY_INITIALS[new Date(`${d}T00:00:00`).getDay()]}
            </span>
          ))}
        </div>
        <span />
      </div>
    </div>
  );
}
