export type MetricStatus = "ok" | "attention" | "caution";

export const STATUS_BG: Record<MetricStatus, string> = {
  ok: "bg-status-ok",
  attention: "bg-status-attention",
  caution: "bg-status-caution",
};

export const STATUS_FILL: Record<MetricStatus, string> = {
  ok: "fill-status-ok",
  attention: "fill-status-attention",
  caution: "fill-status-caution",
};

function higherIsBetter(value: number): MetricStatus {
  if (value >= 4) return "ok";
  if (value === 3) return "attention";
  return "caution";
}

function lowerIsBetter(value: number): MetricStatus {
  if (value <= 2) return "ok";
  if (value === 3) return "attention";
  return "caution";
}

export const sleepStatus = higherIsBetter;
export const energyStatus = higherIsBetter;
export const stressStatus = lowerIsBetter;
export const dayStatus = lowerIsBetter;
