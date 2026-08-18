import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  DEFAULT_REMINDER_TIME,
  readLocalPrefs,
  remindersSupported,
  syncReminder,
  type PermissionState,
  type ReminderPrefs,
} from "@/lib/reminders";

function normalizeTime(value: string | null | undefined): string {
  if (!value) return DEFAULT_REMINDER_TIME;
  return value.slice(0, 5);
}

export function useReminder() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [permission, setPermission] = useState<PermissionState>("granted");

  const { data, isLoading } = useQuery({
    queryKey: ["reminder", user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<ReminderPrefs> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("reminder_enabled, reminder_time")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      if (!data) return readLocalPrefs();
      return {
        enabled: data.reminder_enabled ?? true,
        time: normalizeTime(data.reminder_time),
      };
    },
  });

  const prefs = data ?? readLocalPrefs();

  // Re-arm the device schedule whenever the stored preference is known.
  useEffect(() => {
    if (!data || !remindersSupported()) return;
    void syncReminder(data).then(setPermission);
  }, [data?.enabled, data?.time]);

  const mutation = useMutation({
    mutationFn: async (next: ReminderPrefs) => {
      const state = await syncReminder(next);
      setPermission(state);
      if (user?.id) {
        const { error } = await supabase
          .from("profiles")
          .upsert(
            { id: user.id, reminder_enabled: next.enabled, reminder_time: `${next.time}:00` },
            { onConflict: "id" },
          );
        if (error) throw error;
      }
      return next;
    },
    onSuccess: (next) => {
      queryClient.setQueryData(["reminder", user?.id], next);
    },
  });

  return {
    prefs,
    loading: isLoading,
    supported: remindersSupported(),
    permission,
    save: mutation.mutateAsync,
    saving: mutation.isPending,
  };
}
