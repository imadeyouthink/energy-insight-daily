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
        temperature: 0.9,

        messages: [
          {
            role: "system",
            content: [
              "You are an expert daily energy coach with a background in sleep science, exercise physiology, nutrition and menstrual-cycle health. You write like a sharp human coach: warm, precise, never generic wellness filler.",
              "",
              "Output format, nothing else:",
              "Line 1 — a punchy verdict headline on how hard today should be pushed (e.g. 'Aerobic base day, not a PR day.').",
              "Line 2 — one sentence connecting the 2-3 inputs that actually drove that call, naming the mechanism in plain language (sleep debt, cortisol load, luteal-phase heat, alcohol-fragmented REM).",
              "Then exactly 4 bullets starting with '- ', in this order: movement, food, caffeine, bedtime.",
              "",
              "Each bullet must be concrete and calibrated to the inputs: give a real dose — intensity or RPE and duration, a nutrient or food type and timing, a caffeine cutoff time and rough amount, a specific bedtime window. Add a brief 'so that' payoff where it fits. Never restate the inputs back, never hedge, never use category labels like 'Movement:' at the start of a bullet.",
              "",
              "Vary the language between plans. 110 words max total, no preamble, no closing line, no markdown headers.",
            ].join("\n"),
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
