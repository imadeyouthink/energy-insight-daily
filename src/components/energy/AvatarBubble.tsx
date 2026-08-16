import { Link } from "@tanstack/react-router";

import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

function initials(name: string | null, email: string | null): string {
  const source = name?.trim() || email?.trim() || "";
  if (!source) return "?";
  const parts = source.replace(/@.*/, "").split(/[\s._-]+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((p) => p.charAt(0)).join("");
  return (letters || source.charAt(0)).toUpperCase();
}

export function AvatarBubble() {
  const { user } = useAuth();
  const { displayName } = useProfile();

  return (
    <Link
      to="/profile"
      aria-label="Open your profile"
      className="glass flex h-11 w-11 items-center justify-center rounded-full border border-white/70 text-[14px] font-semibold tracking-tight text-foreground shadow-[0_10px_28px_-14px_oklch(0_0_0/0.45)]"
    >
      {initials(displayName, user?.email ?? null)}
    </Link>
  );
}
