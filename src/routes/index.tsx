import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { useProfile } from "@/hooks/useProfile";

import { CycleBanner } from "@/components/energy/CycleBanner";
import { TabBar } from "@/components/energy/TabBar";
import { NamePrompt } from "@/components/energy/NamePrompt";
import { AvatarBubble } from "@/components/energy/AvatarBubble";
import { FireflyCompanion } from "@/components/energy/FireflyCompanion";

import { TrendSparklines } from "@/components/energy/TrendSparklines";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { computeCycle } from "@/lib/cycle";
import { useToday } from "@/hooks/useToday";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dunami — your 15-second daily check-in" },
      {
        name: "description",
        content:
          "Log sleep, energy, stress and how packed your day is, and get a personalized daily energy plan in seconds.",
      },
      { property: "og:title", content: "Dunami — your 15-second daily check-in" },
      {
        property: "og:description",
        content: "Turn how you feel today into a short, practical plan for movement, food and rest.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HomePage,
});

function useGreeting(): string {
  const [text, setText] = useState("Hello");
  useEffect(() => {
    const h = new Date().getHours();
    setText(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);
  return text;
}


function ScoreRing({
  label,
  value,
  caption,
  color,
}: {
  label: string;
  value: number;
  caption: string;
  color: string;
}) {
  const size = 84;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / 5));

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-black/8"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - pct)}
            style={{ transition: "stroke-dashoffset 700ms ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[18px] font-semibold leading-none tracking-tight text-foreground">
            {value}
            <span className="text-[11px] font-medium text-muted-foreground">/5</span>
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] font-semibold uppercase leading-none tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-[12px] font-semibold leading-none tracking-tight text-foreground">
          {caption}
        </p>
      </div>
    </div>
  );
}

const SLEEP_LABELS = ["Terrible", "Poor", "Okay", "Good", "Great"];
const ENERGY_LABELS = ["Drained", "Low", "Steady", "Good", "Buzzing"];
const STRESS_LABELS = ["Calm", "Easy", "Normal", "Tense", "Frazzled"];


function HomePage() {
  const { today, entries, todayEntry, cycleSettings, parsedPlan } = useToday();
  const checkedIn = !!todayEntry;
  const cycle = computeCycle(cycleSettings);
  const greeting = useGreeting();
  const { displayName } = useProfile();
  const [skippedName, setSkippedName] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem("dunami:skip-name") === "1",
  );
  const needsName = !displayName && !skippedName;

  function skipName() {
    sessionStorage.setItem("dunami:skip-name", "1");
    setSkippedName(true);
  }




  return (
    <main className="min-h-screen bg-background aurora px-5 pb-40">
      <Toaster position="top-center" />
      <div className="mx-auto w-full max-w-md">
        <header className="pt-5 pb-6">
          <div className="flex items-start justify-end gap-3">
            <AvatarBubble />
          </div>
          {needsName ? (
            <div className="mt-2">
              <NamePrompt onSkip={skipName} />
            </div>
          ) : (
            <div className="mt-2 flex flex-col items-center gap-3">
              <FireflyCompanion state="welcome" className="h-28 w-28 shrink-0" />
              <div className="min-w-0">
                <h1 className="text-center text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground">
                  {displayName ? `${greeting}, ${displayName}` : greeting}
                </h1>
                <p className="mt-1 text-center text-[15px] leading-relaxed tracking-tight text-muted-foreground">
                  {checkedIn
                    ? "Here's where today stands."
                    : "Start with a fifteen-second check-in."}
                </p>
              </div>
            </div>
          )}
        </header>


        {!checkedIn ? (
          <Link
            to="/check-in"
            className="glass flex items-center justify-between rounded-[1.75rem] px-5 py-5 shadow-[0_8px_24px_-16px_oklch(0_0_0/0.35)]"
          >
            <span>
              <span className="block text-[17px] font-semibold tracking-tight text-foreground">
                Start today's check-in
              </span>
              <span className="mt-0.5 block text-[13px] tracking-tight text-muted-foreground">
                15 seconds · no typing
              </span>
            </span>
            <ArrowUpRight className="h-5 w-5 text-foreground" />
          </Link>
        ) : (
          <div className="space-y-6">
            <section>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Today at a glance
              </h2>
              <div className="mt-3 grid grid-cols-3 gap-2 rounded-[1.5rem] bg-white px-3 py-5 shadow-card-neutral">
                <ScoreRing
                  label="Sleep"
                  value={todayEntry.sleep}
                  caption={SLEEP_LABELS[todayEntry.sleep - 1] ?? "—"}
                  color="var(--turquoise)"
                />
                <ScoreRing
                  label="Energy"
                  value={todayEntry.energy}
                  caption={ENERGY_LABELS[todayEntry.energy - 1] ?? "—"}
                  color="var(--turquoise)"
                />
                <ScoreRing
                  label="Stress"
                  value={todayEntry.stress}
                  caption={STRESS_LABELS[todayEntry.stress - 1] ?? "—"}
                  color="var(--turquoise)"
                />
              </div>

              {cycle && (
                <div className="mt-6">
                  <CycleBanner phase={cycle.phase} day={cycle.day} />
                </div>
              )}

            </section>

            {parsedPlan && (
              <section>
                <Button
                  asChild
                  className="h-12 w-full rounded-full bg-primary text-primary-foreground text-[15px] tracking-tight shadow-primary hover:bg-primary/90"
                >
                  <Link to="/plan">See today's plan</Link>
                </Button>
              </section>
            )}

          </div>
        )}

        {entries.length > 0 && (
          <section className="mt-8">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Last 7 days
            </h2>
            <div className="mt-3 rounded-[1.5rem] bg-white/70 p-4 shadow-[0_8px_28px_-14px_oklch(0.35_0.02_260/0.25)] backdrop-blur-sm">
              <TrendSparklines entries={entries} today={today} />
            </div>
          </section>
        )}


        {checkedIn && (
          <Link
            to="/check-in"
            className="mt-6 block text-center text-[13px] font-bold tracking-tight text-black"
          >
            Edit today's check-in
          </Link>
        )}
      </div>
      <TabBar />
    </main>
  );
}
