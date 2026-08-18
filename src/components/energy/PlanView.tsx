import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Moon, Utensils, Coffee } from "lucide-react";

const CATEGORIES = [
  { label: "Movement", Icon: ArrowUpRight, chip: "bg-plan-movement text-plan-movement-foreground" },
  { label: "Food", Icon: Utensils, chip: "bg-plan-food text-plan-food-foreground" },
  { label: "Caffeine", Icon: Coffee, chip: "bg-plan-caffeine text-plan-caffeine-foreground" },
  { label: "Bedtime", Icon: Moon, chip: "bg-plan-bedtime text-plan-bedtime-foreground" },
] as const;


export function PlanView({ bullets }: { bullets: string[] }) {
  return (
    <div className="space-y-6">
      <ul className="space-y-5">
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

      <Link
        to="/check-in"
        className="mt-2 block text-center text-[13px] font-bold tracking-tight text-black"
      >
        Edit today's check-in
      </Link>
    </div>
  );
}
