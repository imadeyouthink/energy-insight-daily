import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  onSkip: () => void;
};

export function NamePrompt({ onSkip }: Props) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const displayName = name.trim().slice(0, 40);
    if (!displayName || !user?.id) return;
    setBusy(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, display_name: displayName }, { onConflict: "id" });
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save your name.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground">
        What should we call you?
      </h1>
      <form onSubmit={save} className="mt-3 flex items-center gap-2">
        <Input
          type="text"
          autoComplete="given-name"
          maxLength={40}
          placeholder="Your name"
          aria-label="Your name"
          className="h-11 flex-1 rounded-full border-white/60 bg-white/70 px-4 text-[15px]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          type="submit"
          variant="outline"
          disabled={busy || !name.trim()}
          className="h-11 rounded-full border-foreground/10 bg-foreground px-5 text-[15px] font-medium tracking-tight text-background shadow-[0_8px_24px_-12px_oklch(0_0_0/0.35)] hover:bg-foreground/90 hover:text-background"
        >
          Save
        </Button>
      </form>
      <button
        type="button"
        onClick={onSkip}
        className="mt-2 text-[13px] font-medium tracking-tight text-muted-foreground underline underline-offset-4"
      >
        Skip
      </button>
    </div>
  );
}
