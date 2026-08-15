import { Button } from "@/components/ui/button";
import { parsePlan } from "@/lib/plan.functions";

export function PlanView({ plan, onEdit }: { plan: string; onEdit: () => void }) {
  const { headline, recap, bullets } = parsePlan(plan);

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
        <h2 className="text-2xl font-semibold leading-snug text-foreground">{headline}</h2>
        {recap && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{recap}</p>}

        <ul className="mt-6 space-y-3">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button variant="outline" className="h-12 w-full rounded-3xl" onClick={onEdit}>
        Edit today's check-in
      </Button>
    </div>
  );
}
