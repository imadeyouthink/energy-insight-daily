export type CyclePhase = "Menstrual" | "Follicular" | "Ovulation" | "Luteal";

export type CycleSettings = {
  enabled: boolean;
  last_period_start: string | null;
  cycle_length: number;
  period_length: number;
};

export function todayKey(): string {
  const d = new Date();
  const tz = d.getTimezoneOffset();
  return new Date(d.getTime() - tz * 60000).toISOString().slice(0, 10);
}

export function formatDay(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function daysBetween(fromISO: string, toISO: string): number {
  const [y1, m1, d1] = fromISO.split("-").map(Number);
  const [y2, m2, d2] = toISO.split("-").map(Number);
  const a = Date.UTC(y1!, (m1 ?? 1) - 1, d1 ?? 1);
  const b = Date.UTC(y2!, (m2 ?? 1) - 1, d2 ?? 1);
  return Math.round((b - a) / 86400000);
}

export function computeCycle(
  settings: CycleSettings | null,
  dateStr: string = todayKey(),
): { phase: CyclePhase; day: number } | null {
  if (!settings?.enabled || !settings.last_period_start) return null;
  const cycleLength = Math.max(15, settings.cycle_length || 28);
  const periodLength = Math.max(1, settings.period_length || 5);
  const diff = daysBetween(settings.last_period_start, dateStr);
  if (diff < 0) return null;
  const day = (diff % cycleLength) + 1;

  const ovulationDay = cycleLength - 14;
  let phase: CyclePhase;
  if (day <= periodLength) phase = "Menstrual";
  else if (day < ovulationDay - 1) phase = "Follicular";
  else if (day <= ovulationDay + 1) phase = "Ovulation";
  else phase = "Luteal";

  return { phase, day };
}
