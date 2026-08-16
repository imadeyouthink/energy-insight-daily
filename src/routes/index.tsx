import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

import { CycleBanner } from "@/components/energy/CycleBanner";
import { TabBar } from "@/components/energy/TabBar";
import { TrendSparklines } from "@/components/energy/TrendSparklines";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { computeCycle } from "@/lib/cycle";
import {
  STATUS_BG,
  dayStatus,
  energyStatus,
  sleepStatus,
  stressStatus,
  type MetricStatus,
} from "@/lib/status";
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

function Chip({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status?: MetricStatus;
}) {
  return (
    <div className="flex min-h-[62px] flex-col items-center justify-center gap-1 rounded-2xl bg-secondary px-3.5 py-3 text-center">
      <p className="flex items-center gap-1 text-[10px] font-semibold uppercase leading-none tracking-[0.14em] text-muted-foreground">
        {status && <span className={`h-2 w-2 rounded-full ${STATUS_BG[status]}`} />}
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
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }



  return (
    <main className="min-h-screen bg-background px-5 pb-40">
      <Toaster position="top-center" />
      <div className="mx-auto w-full max-w-md">
        <div className="aurora -mx-5 mb-5 px-5 pb-6 pt-5">
          <header className="glass rounded-[1.75rem] px-5 py-5 shadow-[0_18px_40px_-28px_oklch(0_0_0/0.45)]">
            <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
              {dateLabel(today)}
            </span>
            <h1 className="mt-2 text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground">
              {displayName ? `${greeting}, ${displayName}` : greeting}
            </h1>
            <p className="mt-1 text-[15px] leading-relaxed tracking-tight text-muted-foreground">
              {checkedIn
                ? "Here's where today stands."
                : "Start with a fifteen-second check-in."}
            </p>
          </header>
        </div>

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
                  status={sleepStatus(todayEntry.sleep)}
                />
                <Chip
                  label="Energy"
                  value={`${todayEntry.energy}/5`}
                  status={energyStatus(todayEntry.energy)}
                />
                <Chip
                  label="Stress"
                  value={`${todayEntry.stress}/5`}
                  status={stressStatus(todayEntry.stress)}
                />
                <Chip
                  label="Day"
                  value={DAY_LABELS[todayEntry.day_intensity - 1] ?? "—"}
                  status={dayStatus(todayEntry.day_intensity)}
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
                  variant="outline"
                  className="glass h-12 w-full rounded-full text-[15px] tracking-tight shadow-[0_8px_24px_-12px_oklch(0_0_0/0.35)]"
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

        <button
          type="button"
          onClick={handleSignOut}
          className="mt-4 block w-full text-center text-[13px] font-medium tracking-tight text-muted-foreground underline underline-offset-4"
        >
          Sign out
        </button>
      </div>
      <TabBar />
    </main>
  );
}
