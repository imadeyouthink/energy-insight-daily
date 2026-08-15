import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { BrandLockup } from "@/components/energy/BrandLockup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Energy Coach" },
      {
        name: "description",
        content:
          "Sign in to Energy Coach to keep your daily check-ins, cycle settings and plans private to you.",
      },
      { property: "og:title", content: "Sign in — Energy Coach" },
      {
        property: "og:description",
        content: "Your check-ins stay private to your account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "sign-up") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) toast.success("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(result.error.message || "Google sign-in failed.");
    }
    setBusy(false);
  }

  return (
    <main className="aurora min-h-screen px-5 pb-16">
      <Toaster position="top-center" />
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center py-12">
        <div className="glass rounded-[2rem] p-6 shadow-[0_18px_40px_-28px_oklch(0_0_0/0.45)]">
          <header>
            <h1 className="text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground">
              {mode === "sign-in" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-1 text-[15px] leading-relaxed tracking-tight text-muted-foreground">
              Your check-ins and cycle data stay private to you.
            </p>
          </header>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-[12px] font-medium text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                className="rounded-xl text-[13px]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="text-[12px] font-medium text-muted-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                required
                minLength={6}
                className="rounded-xl text-[13px]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="outline"
              disabled={busy}
              className="h-12 w-full rounded-full border-foreground/10 bg-foreground text-[15px] font-medium tracking-tight text-background shadow-[0_8px_24px_-12px_oklch(0_0_0/0.35)] hover:bg-foreground/90 hover:text-background"
            >
              {mode === "sign-in" ? "Sign in" : "Sign up"}
            </Button>
          </form>

          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={onGoogle}
            className="glass mt-3 h-12 w-full rounded-full border-white/60 text-[15px] tracking-tight shadow-[0_8px_24px_-12px_oklch(0_0_0/0.35)]"
          >
            Continue with Google
          </Button>

          <button
            type="button"
            className="mt-6 block w-full text-center text-[13px] font-medium tracking-tight text-muted-foreground underline underline-offset-4"
            onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
          >
            {mode === "sign-in" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </main>
  );
}
