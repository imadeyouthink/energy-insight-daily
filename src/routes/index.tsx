import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { useProfile } from "@/hooks/useProfile";

import { CycleBanner } from "@/components/energy/CycleBanner";
import { TabBar } from "@/components/energy/TabBar";
import { NamePrompt } from "@/components/energy/NamePrompt";
import { AvatarBubble } from "@/components/energy/AvatarBubble";

import { TrendSparklines } from "@/components/energy/TrendSparklines";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { computeCycle } from "@/lib/cycle";
import { dateLabel, useToday } from "@/hooks/useToday";



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

type Level = "good" | "mid" | "low";

const LEVEL_DOT: Record<Level, string> = {
  good: "bg-dot-energy",
  mid: "bg-dot-sleep",
  low: "bg-dot-stress",
};

/** Higher is better (sleep, energy) */
function levelUp(v: number): Level {
  return v >= 4 ? "good" : v === 3 ? "mid" : "low";
}

/** Higher is heavier (stress, day intensity) */
function levelDown(v: number): Level {
  return v <= 2 ? "good" : v === 3 ? "mid" : "low";
}

function Chip({
  label,
  value,
  level,
}: {
  label: string;
  value: string;
  level: Level;
}) {
  return (
    <div className="flex min-h-[74px] flex-col items-center justify-center gap-1.5 rounded-2xl bg-card-neutral px-3.5 py-3 text-center shadow-card-neutral backdrop-blur-sm">
      <span className={`h-2 w-2 rounded-full ${LEVEL_DOT[level]}`} />
      <p className="text-[10px] font-semibold uppercase leading-none tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="text-[14px] font-semibold leading-none tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}





const SLEEP_LABELS = ["Terrible", "Poor", "Okay", "Good", "Great"];
const DAY_LABELS = ["Light", "Easy", "Normal", "Busy", "Packed"];

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
          <div className="flex items-start justify-between gap-3">
            <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
              {dateLabel(today)}
            </span>
            <AvatarBubble />
          </div>
          {needsName ? (
            <div className="mt-2">
              <NamePrompt onSkip={skipName} />
            </div>
          ) : (
            <>
              <h1 className="mt-2 text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground">
                {displayName ? `${greeting}, ${displayName}` : greeting}
              </h1>
              <p className="mt-1 text-[15px] leading-relaxed tracking-tight text-muted-foreground">
                {checkedIn
                  ? "Here's where today stands."
                  : "Start with a fifteen-second check-in."}
              </p>
            </>
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
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <Chip
                  label="Sleep"
                  value={SLEEP_LABELS[todayEntry.sleep - 1] ?? "—"}
                  level={levelUp(todayEntry.sleep)}
                />
                <Chip
                  label="Energy"
                  value={`${todayEntry.energy}/5`}
                  level={levelUp(todayEntry.energy)}
                />
                <Chip
                  label="Stress"
                  value={`${todayEntry.stress}/5`}
                  level={levelDown(todayEntry.stress)}
                />
                <Chip
                  label="Day"
                  value={DAY_LABELS[todayEntry.day_intensity - 1] ?? "—"}
                  level={levelDown(todayEntry.day_intensity)}
                />

              </div>
              {cycle && (
                <div className="mt-3">
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
            <TrendSparklines entries={entries} today={today} />
          </section>
        )}


        {checkedIn && (
          <Link
            to="/check-in"
            className="mt-6 block text-center text-[13px] font-medium tracking-tight text-muted-foreground underline underline-offset-4"
          >
            Edit today's check-in
          </Link>
        )}
      </div>
      <TabBar />
    </main>
  );
}
