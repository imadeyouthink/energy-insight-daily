import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { TabBar } from "@/components/energy/TabBar";
import { Toaster } from "@/components/ui/sonner";
import { computeCycle } from "@/lib/cycle";
import { dateLabel, useToday } from "@/hooks/useToday";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Energy Coach — your 15-second daily check-in" },
      {
        name: "description",
        content:
          "Log sleep, energy, stress and how packed your day is, and get a personalized daily energy plan in seconds.",
      },
      { property: "og:title", content: "Energy Coach — your 15-second daily check-in" },
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

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-[62px] flex-col justify-between rounded-2xl bg-secondary px-3.5 py-3">
      <p className="text-[10px] font-semibold uppercase leading-none tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="text-[16px] font-semibold leading-none tracking-tight text-foreground">
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

  const week = [...entries]
    .filter((e) => e.entry_date <= today)
    .slice(0, 7)
    .reverse();

  return (
    <main className="min-h-screen bg-background px-5 pb-40">
      <Toaster position="top-center" />
      <div className="mx-auto w-full max-w-md">
        <div className="aurora -mx-5 mb-5 px-5 pb-6 pt-5">
          <header className="glass rounded-[1.75rem] px-5 py-5 shadow-[0_18px_40px_-28px_oklch(0_0_0/0.45)]">
            <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
              {dateLabel(today)}
            </span>
            <h1 className="mt-2 text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground">
              {greeting()}
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
                <Chip label="Sleep" value={SLEEP_LABELS[todayEntry.sleep - 1] ?? "—"} />
                <Chip label="Energy" value={`${todayEntry.energy}/5`} />
                <Chip label="Stress" value={`${todayEntry.stress}/5`} />
                <Chip label="Day" value={DAY_LABELS[todayEntry.day_intensity - 1] ?? "—"} />
              </div>
              {cycle && (
                <span className="mt-2.5 inline-flex items-center rounded-full bg-turquoise px-3 py-1.5 text-[12px] font-medium tracking-tight text-turquoise-foreground">
                  {cycle.phase} · day {cycle.day}
                </span>
              )}
            </section>

            {parsedPlan && (
              <section>
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Today's plan
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed tracking-tight text-foreground">
                  {parsedPlan.bullets[0]}
                </p>
                <Link
                  to="/plan"
                  className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium tracking-tight text-foreground underline underline-offset-4"
                >
                  See full plan
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </section>
            )}
          </div>
        )}

        {week.length > 0 && (
          <section className="mt-8">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Last 7 days · energy
            </h2>
            <div className="mt-3 flex items-end gap-2">
              {week.map((e) => (
                <div key={e.entry_date} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex h-16 w-full max-w-8 items-end">
                    <div
                      className="w-full rounded-full bg-primary/80"
                      style={{ height: `${(e.energy / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] tracking-tight text-muted-foreground">
                    {e.entry_date.slice(8)}
                  </span>
                </div>
              ))}
            </div>
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
