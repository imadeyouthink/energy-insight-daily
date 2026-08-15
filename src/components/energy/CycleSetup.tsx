import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { computeCycle, type CycleSettings } from "@/lib/cycle";

type Props = {
  value: CycleSettings | null;
  onSave: (value: CycleSettings) => void;
  saving?: boolean;
};

const EMPTY: CycleSettings = {
  enabled: false,
  last_period_start: null,
  cycle_length: 28,
  period_length: 5,
};

export function CycleSetup({ value, onSave, saving }: Props) {
  const [draft, setDraft] = useState<CycleSettings>(value ?? EMPTY);
  const current = computeCycle(value);

  useEffect(() => {
    setDraft(value ?? EMPTY);
  }, [value]);

  function toggle(enabled: boolean) {
    if (enabled) {
      setDraft((d) => ({ ...(value ?? EMPTY), enabled: true }));
    } else {
      if (value) {
        onSave({ ...value, enabled: false });
      }
      setDraft(EMPTY);
    }
  }

  return (
    <div className="pb-1 pt-1">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Cycle phase
          </p>
          {current ? (
            <p className="mt-1 text-[15px] font-medium tracking-tight text-foreground">
              {current.phase} · day {current.day}
            </p>
          ) : (
            <p className="mt-1 text-[13px] font-medium tracking-tight text-foreground">
              Track my cycle
            </p>
          )}
        </div>

        <Switch
          id="cycle-enabled"
          checked={draft.enabled}
          onCheckedChange={toggle}
          aria-label="Track my cycle"
        />
      </div>

      {draft.enabled && (
        <div className="mt-3 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="last-period" className="text-sm">
              First day of last period
            </Label>
            <Input
              id="last-period"
              type="date"
              className="rounded-xl"
              value={draft.last_period_start ?? ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, last_period_start: e.target.value || null }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cycle-length" className="text-sm">
                Cycle length
              </Label>
              <Input
                id="cycle-length"
                type="number"
                min={15}
                max={60}
                className="rounded-xl"
                value={draft.cycle_length}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, cycle_length: Number(e.target.value) || 28 }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="period-length" className="text-sm">
                Period length
              </Label>
              <Input
                id="period-length"
                type="number"
                min={1}
                max={14}
                className="rounded-xl"
                value={draft.period_length}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, period_length: Number(e.target.value) || 5 }))
                }
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              className="rounded-xl"
              disabled={saving || !draft.last_period_start}
              onClick={() => onSave(draft)}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl"
              onClick={() => toggle(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
