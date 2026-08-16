import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useProfile() {
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const metaName =
    (user?.user_metadata as { display_name?: string } | undefined)?.display_name ?? null;

  return { displayName: data?.display_name?.trim() || metaName?.trim() || null };
}
