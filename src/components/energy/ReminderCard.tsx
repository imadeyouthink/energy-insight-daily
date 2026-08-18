import { Bell } from "lucide-react";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useReminder } from "@/hooks/useReminder";

export function ReminderCard() {
  const { prefs, supported, permission, save, saving } = useReminder();

  async function update(next: { enabled?: boolean; time?: string }) {
    try {
      await save({
        enabled: next.enabled ?? prefs.enabled,
        time: next.time ?? prefs.time,
      });
    } catch {
      toast.error("Could not save your reminder.");
    }
  }

  return (
    <section className="glass-sheet mt-3 space-y-3 rounded-xl border-[0.5px] border-white/70 px-5 py-5">
      <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Daily reminder
      </Label>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/60">
            <Bell className="h-4 w-4 text-foreground" />
          </span>
          <div>
            <p className="text-[14px] font-medium tracking-tight text-foreground">
              Morning check-in nudge
            </p>
            <p className="text-[12px] text-muted-foreground">A gentle reminder, nothing more.</p>
          </div>
        </div>
        <Switch
          checked={prefs.enabled}
          disabled={saving}
          onCheckedChange={(checked) => update({ enabled: checked })}
          aria-label="Daily reminder"
        />
      </div>

      {prefs.enabled && (
        <div className="flex items-center justify-between gap-3 rounded-[14px] border border-white/70 bg-white/50 px-4 py-3">
          <span className="text-[13px] tracking-tight text-foreground">Remind me at</span>
          <input
            type="time"
            value={prefs.time}
            disabled={saving}
            onChange={(e) => update({ time: e.target.value })}
            className="rounded-[10px] border border-white/70 bg-white/70 px-2.5 py-1.5 text-[13px] tracking-tight text-foreground outline-none"
          />
        </div>
      )}

      {!supported && (
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          Reminders arrive once Dunami is installed on your iPhone. Your preference is saved and
          will apply there.
        </p>
      )}

      {supported && permission === "denied" && (
        <p className="text-[12px] leading-relaxed text-coral">
          Notifications are turned off for Dunami. Enable them in iOS Settings → Notifications →
          Dunami.
        </p>
      )}
    </section>
  );
}
