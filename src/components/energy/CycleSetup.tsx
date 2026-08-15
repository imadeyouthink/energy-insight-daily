import { useState } from "react";
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
  enabled: true,
  last_period_start: null,
  cycle_length: 28,
  period_length: 5,
};

export function CycleSetup({ value, onSave, saving }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CycleSettings>(value ?? EMPTY);
  const current = computeCycle(value);

  function startEdit() {
    setDraft(value ?? EMPTY);
    setOpen(true);
  }

  return (
    <div className="pb-2 pt-1">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Cycle phase
          </p>
          {current && (
            <p className="mt-1 text-[15px] font-medium tracking-tight text-foreground">
              {current.phase} · day {current.day}
            </p>
          )}
        </div>

        {!open && (

          <button
            type="button"
            onClick={startEdit}
            className="rounded-full bg-secondary px-4 py-2 text-[13px] font-medium tracking-tight text-primary transition-colors hover:bg-accent"
          >
            {value?.last_period_start ? "Edit" : "Set up"}
          </button>
        )}
      </div>

      {open && (
        <div className="mt-3 space-y-3">

          <div className="flex items-center justify-between">
            <Label htmlFor="cycle-enabled" className="text-sm">
              Track my cycle
            </Label>
            <Switch
              id="cycle-enabled"
              checked={draft.enabled}
              onCheckedChange={(enabled) => setDraft((d) => ({ ...d, enabled }))}
            />
          </div>

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
              disabled={saving}
              onClick={() => {
                onSave(draft);
                setOpen(false);
              }}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
