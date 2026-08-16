import { Zap } from "lucide-react";

export function BrandLockup() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] backdrop-blur-md">
        <Zap className="h-5 w-5 fill-foreground text-foreground" />
      </div>
      <span className="text-[22px] font-semibold tracking-[-0.02em] text-foreground">
        Dunami
      </span>
    </div>
  );
}
