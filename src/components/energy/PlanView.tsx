import { Button } from "@/components/ui/button";

export function PlanView({ bullets, onEdit }: { bullets: string[]; onEdit: () => void }) {
  return (
    <div className="space-y-4">
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

