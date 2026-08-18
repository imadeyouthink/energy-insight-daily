import { Button } from "@/components/ui/button";
import { ArrowUpRight, Moon, Utensils, Coffee } from "lucide-react";

const CATEGORIES = [
  { label: "Movement", Icon: ArrowUpRight, chip: "bg-plan-movement text-plan-movement-foreground" },
  { label: "Food", Icon: Utensils, chip: "bg-plan-food text-plan-food-foreground" },
  { label: "Caffeine", Icon: Coffee, chip: "bg-plan-caffeine text-plan-caffeine-foreground" },
  { label: "Bedtime", Icon: Moon, chip: "bg-plan-bedtime text-plan-bedtime-foreground" },
] as const;


export function PlanView({ bullets, onEdit }: { bullets: string[]; onEdit: () => void }) {
  return (
    <div className="space-y-6">
      <ul className="space-y-3">
        {bullets.map((b, i) => {
          const cat = CATEGORIES[i % CATEGORIES.length]!;
          const Icon = cat.Icon;
          return (
            <li key={i} className="space-y-1.5">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${cat.chip}`}>
                <Icon aria-hidden className="h-3 w-3" strokeWidth={2.5} />
                {cat.label}
              </span>
              <p className="text-[15px] leading-relaxed tracking-tight text-foreground">{b}</p>
            </li>
          );
        })}
      </ul>

      <Button
        variant="outline"
        className="glass mt-2 h-12 w-full rounded-full text-[15px] tracking-tight shadow-[0_8px_24px_-12px_oklch(0_0_0/0.35)]"
        onClick={onEdit}
      >
        Edit today's check-in
      </Button>
    </div>
  );
}
