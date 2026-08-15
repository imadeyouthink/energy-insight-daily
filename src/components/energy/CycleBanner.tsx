import { PHASE_COPY, type CyclePhase } from "@/lib/cycle";

type Props = {
  phase: CyclePhase;
  day: number;
};

export function CycleBanner({ phase, day }: Props) {
  const copy = PHASE_COPY[phase];

  return (
    <div className="rounded-[1.75rem] bg-turquoise p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-turquoise-foreground/70">
            Cycle phase
          </p>
          <h3 className="mt-1 text-[17px] font-semibold leading-tight tracking-tight text-turquoise-foreground">
            {copy.title}
          </h3>
        </div>
        <span className="shrink-0 rounded-full bg-turquoise-foreground/10 px-3 py-1.5 text-[11px] font-semibold leading-none tracking-tight text-turquoise-foreground">
          Day {day}
        </span>
      </div>
      <p className="mt-2.5 text-[13px] leading-relaxed text-turquoise-foreground/90">
        {copy.description}
      </p>
    </div>
  );
}
