import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { CheckIn, type CheckInState } from "@/components/energy/CheckIn";
import { PlanView } from "@/components/energy/PlanView";
import { TabBar } from "@/components/energy/TabBar";
import { Toaster } from "@/components/ui/sonner";
import { computeCycle, todayKey, type CycleSettings } from "@/lib/cycle";
import {
  fetchCycleSettings,
  fetchEntries,
  saveCycleSettings,
  saveEntry,
  type DailyEntry,
} from "@/lib/data";
import { generatePlan, parsePlan } from "@/lib/plan.functions";


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
    ],
  }),
  component: EnergyCoach,
});

const DEFAULT_STATE: CheckInState = {
  sleep: null,
  energy: 3,
  stress: 3,
  dayIntensity: 3,
  caffeine: false,
  alcohol: false,
};

function EnergyCoach() {
  const queryClient = useQueryClient();
  const today = todayKey();
  const dateLabel = (() => {
    const [y, m, d] = today.split("-");
    return `${d}/${m}/${y?.slice(2)}`;
  })();
  const [state, setState] = useState<CheckInState>(DEFAULT_STATE);
  const [editing, setEditing] = useState(false);

  const entriesQuery = useQuery({ queryKey: ["entries"], queryFn: () => fetchEntries(14) });
  const settingsQuery = useQuery({ queryKey: ["cycle-settings"], queryFn: fetchCycleSettings });

  const entries = entriesQuery.data ?? [];
  const todayEntry = entries.find((e) => e.entry_date === today) ?? null;
  const cycleSettings = settingsQuery.data ?? null;

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

  const cycleMutation = useMutation({
    mutationFn: (value: CycleSettings) => saveCycleSettings(value),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cycle-settings"] }),
    onError: () => toast.error("Couldn't save cycle settings."),
  });

  const generate = useServerFn(generatePlan);

  const planMutation = useMutation({
    mutationFn: async () => {
      const cycle = computeCycle(cycleSettings);
      const { plan } = await generate({
        data: {
          sleep: state.sleep ?? 3,
          energy: state.energy,
          stress: state.stress,
          dayIntensity: state.dayIntensity ?? 3,
          caffeine: state.caffeine,
          alcohol: state.alcohol,
          cyclePhase: cycle?.phase ?? null,
          cycleDay: cycle?.day ?? null,
        },
      });
      const entry: DailyEntry = {
        entry_date: today,
        sleep: state.sleep ?? 3,
        energy: state.energy,
        stress: state.stress,
        day_intensity: state.dayIntensity ?? 3,
        caffeine: state.caffeine,
        alcohol: state.alcohol,
        cycle_phase: cycle?.phase ?? null,
        cycle_day: cycle?.day ?? null,
        plan,
      };
      return saveEntry(entry);
    },
    onSuccess: () => {
      setEditing(false);
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
    onError: (error: Error) => toast.error(error.message || "Couldn't build your plan."),
  });

  const showPlan = !!todayEntry?.plan && !editing;
  const parsedPlan = showPlan && todayEntry?.plan ? parsePlan(todayEntry.plan) : null;

  return (
    <main className="min-h-screen bg-background px-5 pb-40">
      <Toaster position="top-center" />
      <div className="mx-auto w-full max-w-md">
        <div className="aurora -mx-5 safe-top mb-5 pb-5 pt-5">
          <header className="px-5">
            <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
              {dateLabel}
            </span>
            <h1 className="mt-2 text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground">
              {parsedPlan ? parsedPlan.headline : showPlan ? "Today's plan" : "Morning check-in"}
            </h1>
            <p className="mt-1 text-[15px] leading-relaxed tracking-tight text-muted-foreground">
              {parsedPlan
                ? parsedPlan.recap
                : showPlan
                  ? "Made just for how you feel today."
                  : "Fifteen seconds. No typing, no streaks."}
            </p>
          </header>
        </div>

        {showPlan ? (
          <PlanView bullets={parsedPlan?.bullets ?? []} onEdit={() => setEditing(true)} />
        ) : (
          <CheckIn
            state={state}
            setState={setState}
            cycleSettings={cycleSettings}
            onSaveCycle={(v) => cycleMutation.mutate(v)}
            onSubmit={() => planMutation.mutate()}
            submitting={planMutation.isPending}
          />
        )}
      </div>
      <TabBar />
    </main>
  );
}


