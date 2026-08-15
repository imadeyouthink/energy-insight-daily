import { supabase } from "@/integrations/supabase/client";
import type { CycleSettings } from "./cycle";

export type DailyEntry = {
  entry_date: string;
  sleep: number;
  energy: number;
  stress: number;
  day_intensity: number;
  caffeine: boolean;
  alcohol: boolean;
  cycle_phase: string | null;
  cycle_day: number | null;
  plan: string | null;
};

const entries = () => supabase.from("daily_entries" as never);
const settings = () => supabase.from("cycle_settings" as never);

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("You need to be signed in.");
  return data.user.id;
}

export async function fetchEntries(limit = 14): Promise<DailyEntry[]> {
  const { data, error } = await entries()
    .select("*")
    .order("entry_date", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as DailyEntry[];
}

export async function saveEntry(entry: DailyEntry): Promise<DailyEntry> {
  const user_id = await requireUserId();
  const { data, error } = await entries()
    .upsert({ ...entry, user_id } as never, { onConflict: "user_id,entry_date" })
    .select()
    .single();
  if (error) throw error;
  return data as unknown as DailyEntry;
}

export async function fetchCycleSettings(): Promise<CycleSettings | null> {
  const { data, error } = await settings().select("*").maybeSingle();
  if (error) throw error;
  return (data as unknown as CycleSettings) ?? null;
}

export async function saveCycleSettings(value: CycleSettings): Promise<CycleSettings> {
  const user_id = await requireUserId();
  const { data, error } = await settings()
    .upsert({ ...value, user_id, updated_at: new Date().toISOString() } as never, {
      onConflict: "user_id",
    })
    .select()
    .single();
  if (error) throw error;
  return data as unknown as CycleSettings;
}
