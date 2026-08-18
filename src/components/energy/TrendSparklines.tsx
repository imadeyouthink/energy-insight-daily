import type { DailyEntry } from "@/lib/data";
import { sleepStatus, energyStatus, stressStatus, STATUS_FILL } from "@/lib/status";
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
  const width = 160;
  const height = 40;
  const paddingX = 8;
  const paddingY = 6;
  const plotWidth = width - paddingX * 2;
  const plotHeight = height - paddingY * 2;

  const coords = points.map((v, i) => {
    if (v == null) return null;
    const x = paddingX + (i / 6) * plotWidth;
    const y = paddingY + plotHeight - ((v - 1) / 4) * plotHeight;
    return { x, y, v, i };
  });

  const segments: string[] = [];
  let current: string[] = [];
  for (const c of coords) {
    if (c == null) {
      if (current.length > 1) {
        segments.push(current.join(" "));
      }
      current = [];
    } else {
      current.push(`${c.x},${c.y}`);
    }
  }
  if (current.length > 1) {
    segments.push(current.join(" "));
  }

  return (
    <div className="contents">
      <span className="text-[11px] font-semibold uppercase leading-none tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-7 w-full overflow-visible"
        preserveAspectRatio="none"
      >
        {segments.map((seg, idx) => (
          <polyline
            key={idx}
            points={seg}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            className="text-foreground/20"
          />
        ))}
        {coords.map((c, i) => {
          if (!c) return null;
          const isToday = i === points.length - 1;
          const status = statusFor[metric](c.v);
          return (
            <circle
              key={i}
              cx={c.x}
              cy={c.y}
              r={isToday ? 4 : 2.5}
              className={`${STATUS_FILL[status]} ${isToday ? "stroke-white stroke-2" : ""}`}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
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
  const pick = (key: MetricKey) =>
    days.map((d) => {
      const entry = byDate.get(d);
      return entry ? (entry[key] as number) : null;
    });

  return (
    <div className="mt-3 grid grid-cols-[3.5rem_1fr_1.25rem] items-center gap-x-3 gap-y-2.5">
      <Row label="Sleep" points={pick("sleep")} metric="sleep" />
      <Row label="Energy" points={pick("energy")} metric="energy" />
      <Row label="Stress" points={pick("stress")} metric="stress" />

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
