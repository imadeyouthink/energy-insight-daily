import { Zap } from "lucide-react";

export function BrandLockup() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/90 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.15)]">
        <Zap className="h-4 w-4 fill-white text-white" strokeWidth={2.5} />
      </div>
      <span className="text-[22px] font-semibold tracking-[-0.02em] text-foreground">
        Energy Coach
      </span>
    </div>
  );
}

