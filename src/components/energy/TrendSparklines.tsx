import type { DailyEntry } from "@/lib/data";
import {
  STATUS_STROKE,
  energyStatus,
  sleepStatus,
  stressStatus,
  type MetricStatus,
} from "@/lib/status";

const W = 100;
const H = 26;
const PAD = 2;

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

function x(i: number): number {
  return PAD + (i / 6) * (W - PAD * 2);
}

function y(value: number): number {
  // 1..5 -> bottom..top
  return H - PAD - ((value - 1) / 4) * (H - PAD * 2);
}

function segments(points: (number | null)[]): string[] {
  const out: string[] = [];
  let current: string[] = [];
  points.forEach((v, i) => {
    if (v == null) {
      if (current.length > 1) out.push(current.join(" "));
      current = [];
      return;
    }
    current.push(`${x(i).toFixed(2)},${y(v).toFixed(2)}`);
  });
  if (current.length > 1) out.push(current.join(" "));
  return out;
}

function Row({
  label,
  points,
  status,
}: {
  label: string;
  points: (number | null)[];
  status: (v: number) => MetricStatus;
}) {
  let lastIndex = -1;
  for (let i = points.length - 1; i >= 0; i -= 1) {
    if (points[i] != null) {
      lastIndex = i;
      break;
    }
  }
  const lastValue = lastIndex >= 0 ? (points[lastIndex] as number) : null;

  return (
    <div className="flex items-center gap-3">
      <span className="w-14 shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <div className="relative h-8 flex-1">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {segments(points).map((pts, i) => (
            <polyline
              key={i}
              points={pts}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.25}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              className="text-foreground/25"
            />
          ))}
          {points.map((v, i) => {
            if (v == null) return null;
            const isLast = i === lastIndex && lastValue != null;
            return (
              <line
                key={i}
                x1={x(i)}
                y1={y(v)}
                x2={x(i)}
                y2={y(v)}
                strokeWidth={isLast ? 7 : 4}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className={
                  isLast
                    ? STATUS_STROKE[status(lastValue)]
                    : "stroke-foreground/30"
                }
              />
            );
          })}
        </svg>
      </div>
      <span className="w-4 shrink-0 text-right text-[13px] font-semibold tabular-nums tracking-tight text-foreground">
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
    <div className="mt-3 space-y-2.5">
      <Row label="Sleep" points={pick("sleep")} status={sleepStatus} />
      <Row label="Energy" points={pick("energy")} status={energyStatus} />
      <Row label="Stress" points={pick("stress")} status={stressStatus} />
      <div className="flex items-center gap-3">
        <span className="w-14 shrink-0" />
        <div className="flex flex-1 justify-between px-[2%]">
          {days.map((d) => (
            <span
              key={d}
              className="w-3 text-center text-[10px] tracking-tight text-muted-foreground"
            >
              {DAY_INITIALS[new Date(`${d}T00:00:00`).getDay()]}
            </span>
          ))}
        </div>
        <span className="w-4 shrink-0" />
      </div>
    </div>
  );
}
