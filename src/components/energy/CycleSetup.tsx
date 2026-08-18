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
  const [isEditing, setIsEditing] = useState(() => !(value?.enabled && value?.last_period_start));
  const current = computeCycle(value);

  useEffect(() => {
    setDraft(value ?? EMPTY);
    if (value?.enabled && value?.last_period_start) setIsEditing(false);
  }, [value]);

  const canSave = Boolean(
    draft.enabled && draft.last_period_start && draft.cycle_length > 0 && draft.period_length > 0,
  );

  function toggle(enabled: boolean) {
    if (enabled) {
      setDraft((d) => ({ ...(value ?? EMPTY), enabled: true }));
      setIsEditing(true);
    } else {
      if (value) {
        onSave({ ...value, enabled: false });
      }
      setDraft(EMPTY);
      setIsEditing(false);
    }
  }

  function handleSave() {
    if (!canSave) return;
    onSave(draft);
    setIsEditing(false);
  }

  return (
    <div className="pb-1 pt-1">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Cycle phase
          </p>
          {current ? (
            <span className="mt-2 inline-flex items-center rounded-full bg-turquoise px-3 py-1.5 text-[13px] font-medium tracking-tight text-turquoise-foreground">
              {current.phase} · day {current.day}
            </span>
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

      {isEditing && draft.enabled && (
        <div className="mt-3 space-y-3">
          <div className="space-y-1">
            <Label htmlFor="last-period" className="text-[12px] font-medium text-muted-foreground">
              First day of last period
            </Label>
            <Input
              id="last-period"
              type="date"
              className="rounded-xl text-[13px]"
              value={draft.last_period_start ?? ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, last_period_start: e.target.value || null }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label
                htmlFor="cycle-length"
                className="text-[12px] font-medium text-muted-foreground"
              >
                Cycle length
              </Label>
              <Input
                id="cycle-length"
                type="number"
                min={15}
                max={60}
                className="rounded-xl text-[13px]"
                value={draft.cycle_length}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, cycle_length: Number(e.target.value) || 28 }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="period-length"
                className="text-[12px] font-medium text-muted-foreground"
              >
                Period length
              </Label>
              <Input
                id="period-length"
                type="number"
                min={1}
                max={14}
                className="rounded-xl text-[13px]"
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
              className="rounded-xl text-[13px]"
              disabled={saving || !canSave}
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl text-[13px]"
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
