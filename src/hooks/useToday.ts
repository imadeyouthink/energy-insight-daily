import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import type { CheckInState } from "@/components/energy/CheckIn";
import { computeCycle, todayKey, type CycleSettings } from "@/lib/cycle";
import {
  fetchCycleSettings,
  fetchEntries,
  saveCycleSettings,
  saveEntry,
  type DailyEntry,
} from "@/lib/data";
import { parsePlan } from "@/lib/plan";
import { generatePlan } from "@/lib/plan.functions";
import { readLocalPrefs, skipTodaysReminder } from "@/lib/reminders";

export const DEFAULT_CHECKIN: CheckInState = {
  sleep: null,
  energy: 3,
  stress: 3,
  dayIntensity: 3,
  caffeine: false,
  alcohol: false,
};

export function dateLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${d}-${m}-${y?.slice(2)}`;
}

export function useToday() {
  const queryClient = useQueryClient();
  const today = todayKey();

  const entriesQuery = useQuery({ queryKey: ["entries"], queryFn: () => fetchEntries(14) });
  const settingsQuery = useQuery({ queryKey: ["cycle-settings"], queryFn: fetchCycleSettings });

  const entries = entriesQuery.data ?? [];
  const todayEntry = entries.find((e) => e.entry_date === today) ?? null;
  const cycleSettings = settingsQuery.data ?? null;
  const parsedPlan = todayEntry?.plan ? parsePlan(todayEntry.plan) : null;

  const cycleMutation = useMutation({
    mutationFn: (value: CycleSettings) => saveCycleSettings(value),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cycle-settings"] }),
    onError: () => toast.error("Couldn't save cycle settings."),
  });

  const generate = useServerFn(generatePlan);

  const planMutation = useMutation({
    mutationFn: async (state: CheckInState) => {
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
      void skipTodaysReminder(readLocalPrefs());
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
    onError: (error: Error) => toast.error(error.message || "Couldn't build your plan."),
  });

  return {
    today,
    entries,
    todayEntry,
    cycleSettings,
    parsedPlan,
    cycleMutation,
    planMutation,
    loading: entriesQuery.isLoading,
  };
}
