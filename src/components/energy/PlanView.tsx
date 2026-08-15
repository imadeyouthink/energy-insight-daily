import { Button } from "@/components/ui/button";
import { parsePlan } from "@/lib/plan.functions";

export function PlanView({ plan, onEdit }: { plan: string; onEdit: () => void }) {
  const { headline, recap, bullets } = parsePlan(plan);

  return (
    <div className="space-y-4">
      <div className="aurora overflow-hidden rounded-[2rem] p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Today
        </p>
        <h2 className="mt-2 text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] text-foreground">
          {headline}
        </h2>
        {recap && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{recap}</p>}
      </div>

      <ul className="space-y-2">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-3 py-2 text-[15px] leading-relaxed tracking-tight text-foreground">
            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <Button variant="outline" className="h-12 w-full rounded-full text-[15px] tracking-tight" onClick={onEdit}>
        Edit today's check-in
      </Button>
    </div>
  );

}
