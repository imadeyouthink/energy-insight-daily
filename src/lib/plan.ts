export type ParsedPlan = { headline: string; recap: string; bullets: string[] };

export function parsePlan(text: string): ParsedPlan {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const bullets: string[] = [];
  const rest: string[] = [];
  for (const line of lines) {
    if (/^([-*•]|\d+\.)\s+/.test(line)) {
      bullets.push(
        line
          .replace(/^([-*•]|\d+\.)\s+/, "")
          .replace(/\*\*/g, "")
          .replace(/^(Movement|Food|Caffeine|Bedtime)\s*[:-]\s*/i, ""),
      );
    } else {
      rest.push(line.replace(/^#+\s*/, "").replace(/\*\*/g, ""));
    }
  }
  return {
    headline: rest[0] ?? "Your plan",
    recap: rest.slice(1).join(" "),
    bullets,
  };
}
