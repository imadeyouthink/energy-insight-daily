import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { label: "Movement", icon: "↗" },
  { label: "Food", icon: "◍" },
  { label: "Caffeine", icon: "☕" },
  { label: "Bedtime", icon: "☾" },
];

export function PlanView({ bullets, onEdit }: { bullets: string[]; onEdit: () => void }) {
  return (
    <div className="space-y-6">
      <ul className="space-y-3">
        {bullets.map((b, i) => {
          const cat = CATEGORIES[i % CATEGORIES.length]!;
          return (
            <li key={i} className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
                <span aria-hidden className="text-[11px] leading-none">
                  {cat.icon}
                </span>
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
