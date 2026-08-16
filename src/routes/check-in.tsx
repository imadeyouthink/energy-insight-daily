import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { CheckIn, type CheckInState } from "@/components/energy/CheckIn";
import { Toaster } from "@/components/ui/sonner";
import { DEFAULT_CHECKIN, dateLabel, useToday } from "@/hooks/useToday";

export const Route = createFileRoute("/check-in")({
  head: () => ({
    meta: [
      { title: "Morning check-in — Dunami" },
      {
        name: "description",
        content:
          "Log sleep, energy, stress and how packed today is in fifteen seconds, then get your plan.",
      },
      { property: "og:title", content: "Morning check-in — Dunami" },
      {
        property: "og:description",
        content: "Fifteen seconds of tapping turns into a practical plan for your day.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckInPage,
});

function CheckInPage() {
  const navigate = useNavigate();
  const { today, todayEntry, cycleSettings, cycleMutation, planMutation } = useToday();
  const [state, setState] = useState<CheckInState>(DEFAULT_CHECKIN);

  useEffect(() => {
    if (!todayEntry) return;
    setState({
      sleep: todayEntry.sleep,
      energy: todayEntry.energy,
      stress: todayEntry.stress,
      dayIntensity: todayEntry.day_intensity,
      caffeine: todayEntry.caffeine,
      alcohol: todayEntry.alcohol,
    });
  }, [todayEntry]);

  return (
    <main className="min-h-screen bg-background px-5 pb-16">
      <Toaster position="top-center" />
      <div className="mx-auto w-full max-w-md">
        <div className="aurora -mx-5 mb-5 px-5 pb-6 pt-5">
          <Link
            to="/"
            aria-label="Back to home"
            className="glass mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70"
          >
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </Link>
          <header className="glass rounded-[1.75rem] px-5 py-5 shadow-[0_18px_40px_-28px_oklch(0_0_0/0.45)]">
            <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
              {dateLabel(today)}
            </span>
            <h1 className="mt-2 text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground">
              Morning check-in
            </h1>
            <p className="mt-1 text-[15px] leading-relaxed tracking-tight text-muted-foreground">
              Fifteen seconds. No typing, no streaks.
            </p>
          </header>
        </div>

        <CheckIn
          state={state}
          setState={setState}
          cycleSettings={cycleSettings}
          onSaveCycle={(v) => cycleMutation.mutate(v)}
          onSubmit={() =>
            planMutation.mutate(state, {
              onSuccess: () => navigate({ to: "/plan" }),
            })
          }
          submitting={planMutation.isPending}
        />
      </div>
    </main>
  );
}
