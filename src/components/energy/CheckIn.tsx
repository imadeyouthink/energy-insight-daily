import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CycleSetup } from "./CycleSetup";
import type { CycleSettings } from "@/lib/cycle";

export type CheckInState = {
  sleep: number | null;
  energy: number;
  stress: number;
  dayIntensity: number | null;
  caffeine: boolean;
  alcohol: boolean;
};

const SLEEP_LABELS = ["Terrible", "Poor", "Okay", "Good", "Great"];
const DAY_LABELS = ["Light", "Easy", "Normal", "Busy", "Packed"];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pb-6 pt-1">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function ScaleButtons({
  labels,
  value,
  onChange,
}: {
  labels: string[];
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-1.5 rounded-full bg-secondary p-1">
      {labels.map((label, i) => {
        const v = i + 1;
        const active = value === v;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(v)}
            aria-pressed={active}
            className={cn(
              "rounded-full px-1 py-2.5 text-[11px] font-medium tracking-tight transition-all duration-200",
              active
                ? "bg-primary text-primary-foreground shadow-[0_2px_10px_-2px_oklch(0.18_0_0/0.35)]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function ScaleSlider({
  value,
  onChange,
  low,
  high,
}: {
  value: number;
  onChange: (v: number) => void;
  low: string;
  high: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <Slider
          value={[value]}
          min={1}
          max={5}
          step={1}
          onValueChange={([v]) => onChange(v ?? 3)}
          className="flex-1"
        />
        <span className="w-10 shrink-0 text-right text-3xl font-semibold tabular-nums tracking-tight text-foreground">
          {value}
        </span>
      </div>
      <div className="mt-2 flex justify-between text-[11px] tracking-tight text-muted-foreground">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );
}

function YesNo({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1.5 rounded-full bg-secondary p-1">
      {[false, true].map((option) => (
        <button
          key={String(option)}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={value === option}
            className={cn(
              "rounded-full px-4 py-2.5 text-sm font-medium tracking-tight transition-all duration-200",
              value === option
                ? "bg-primary text-primary-foreground shadow-[0_2px_10px_-2px_oklch(0.18_0_0/0.35)]"
                : "text-muted-foreground hover:text-foreground",
            )}
        >
          {option ? "Yes" : "No"}
        </button>
      ))}
    </div>
  );
}

type Props = {
  state: CheckInState;
  setState: React.Dispatch<React.SetStateAction<CheckInState>>;
  cycleSettings: CycleSettings | null;
  onSaveCycle: (v: CycleSettings) => void;
  onSubmit: () => void;
  submitting: boolean;
};

export function CheckIn({
  state,
  setState,
  cycleSettings,
  onSaveCycle,
  onSubmit,
  submitting,
}: Props) {
  return (
    <div>
      <div className="divide-y divide-border">
        <Section title="How did you sleep?">
          <ScaleButtons
            labels={SLEEP_LABELS}
            value={state.sleep}
            onChange={(sleep) => setState((s) => ({ ...s, sleep }))}
          />
        </Section>

        <Section title="Energy">
          <ScaleSlider
            value={state.energy}
            onChange={(energy) => setState((s) => ({ ...s, energy }))}
            low="Empty"
            high="Great"
          />
        </Section>

        <Section title="Stress">
          <ScaleSlider
            value={state.stress}
            onChange={(stress) => setState((s) => ({ ...s, stress }))}
            low="Calm"
            high="Overwhelmed"
          />
        </Section>

        <CycleSetup value={cycleSettings} onSave={onSaveCycle} />

        <Section title="Caffeine after 2pm yesterday?">
          <YesNo
            value={state.caffeine}
            onChange={(caffeine) => setState((s) => ({ ...s, caffeine }))}
          />
        </Section>

        <Section title="Alcohol last night?">
          <YesNo value={state.alcohol} onChange={(alcohol) => setState((s) => ({ ...s, alcohol }))} />
        </Section>

        <Section title="How packed is today?">
          <ScaleButtons
            labels={DAY_LABELS}
            value={state.dayIntensity}
            onChange={(dayIntensity) => setState((s) => ({ ...s, dayIntensity }))}
          />
        </Section>
      </div>

      <Button
        variant="outline"
        className="mt-6 h-12 w-full rounded-full text-[15px] tracking-tight"
        disabled={state.sleep === null || submitting}
        onClick={onSubmit}
      >
        {submitting ? "Building your plan…" : "Get today's plan"}
      </Button>
      {state.sleep === null && (
        <p className="pt-3 text-center text-xs text-muted-foreground">Tap how you slept to continue.</p>
      )}
    </div>
  );
}
