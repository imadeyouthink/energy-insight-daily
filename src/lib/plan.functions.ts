import { createServerFn } from "@tanstack/react-start";

export type PlanInput = {
  sleep: number;
  energy: number;
  stress: number;
  dayIntensity: number;
  caffeine: boolean;
  alcohol: boolean;
  cyclePhase: string | null;
  cycleDay: number | null;
};

const SLEEP = ["", "Terrible", "Poor", "Okay", "Good", "Great"];
const INTENSITY = ["", "Light", "Easy", "Normal", "Busy", "Packed"];

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((data: PlanInput) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured.");

    const facts = [
      `Sleep: ${SLEEP[data.sleep] ?? data.sleep} (${data.sleep}/5)`,
      `Energy: ${data.energy}/5`,
      `Stress: ${data.stress}/5`,
      `Today's load: ${INTENSITY[data.dayIntensity] ?? data.dayIntensity} (${data.dayIntensity}/5)`,
      `Caffeine after 2pm yesterday: ${data.caffeine ? "yes" : "no"}`,
      `Alcohol last night: ${data.alcohol ? "yes" : "no"}`,
      data.cyclePhase
        ? `Menstrual cycle: ${data.cyclePhase} phase, day ${data.cycleDay}`
        : `Menstrual cycle: not tracked`,
    ].join("\n");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are a warm, practical daily energy coach. Write a short personalized plan: line 1 is a punchy headline on whether today is a day to push hard or take it easy (e.g. 'Today is not a day for HIIT.'), line 2 is a one-sentence recap of the key facts behind that call (sleep, cycle phase if set, how packed today is), then exactly 4 short bullet recommendations covering movement, food, caffeine, and bedtime — specific to these inputs, not generic. Under 80 words total, no preamble. Format bullets as lines starting with '- '. Do not start bullets with category labels like 'Movement:', 'Food:', 'Caffeine:', or 'Bedtime:' — start directly with the recommendation.",
          },
          { role: "user", content: facts },
        ],
      }),
    });

    if (res.status === 429) throw new Error("Rate limit reached. Try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted.");
    if (!res.ok) {
      console.error("AI gateway error", res.status, await res.text());
      throw new Error("Could not generate a plan right now.");
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = json.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("Empty plan response.");
    return { plan: text };
  });

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
          .replace(/^(Movement|Food|Caffeine|Bedtime)\s*[:\-]\s*/i, ""),
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
