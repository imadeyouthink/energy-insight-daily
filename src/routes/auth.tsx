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
      { title: "Sign in — Dunami" },
      {
        name: "description",
        content:
          "Sign in to Dunami to keep your daily check-ins, cycle settings and plans private to you.",
      },
      { property: "og:title", content: "Sign in — Dunami" },
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "sign-up") {
        const displayName = name.trim().slice(0, 40);
        if (!displayName) {
          toast.error("Please enter your name.");
          setBusy(false);
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: displayName },
          },
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

  async function onApple() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("apple", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(result.error.message || "Apple sign-in failed.");
    }
    setBusy(false);
  }


  async function onGuest() {
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Guest sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="aurora min-h-screen px-5 pb-16">
      <Toaster position="top-center" />
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center py-12">
        <div className="mb-6 flex justify-center">
          <BrandLockup />
        </div>
        <div className="glass rounded-[2rem] p-6 shadow-[0_18px_40px_-28px_oklch(0_0_0/0.45)]">
          <header>
            <h1 className="text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground">
              {mode === "sign-in" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-1 text-[15px] leading-relaxed tracking-tight text-muted-foreground">
              Your check-ins and cycle data stay private to you.
            </p>
          </header>

          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={onApple}
            className="mt-6 h-12 w-full gap-2 rounded-full border-foreground/10 bg-foreground text-[15px] font-medium tracking-tight text-background shadow-[0_8px_24px_-12px_oklch(0_0_0/0.35)] hover:bg-foreground/90 hover:text-background"
          >
            <svg viewBox="0 0 384 512" aria-hidden="true" className="h-[18px] w-[18px] fill-current">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
            </svg>
            Continue with Apple
          </Button>

          <div className="mt-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-foreground/10" />
            <span className="text-[12px] tracking-tight text-muted-foreground">or</span>
            <span className="h-px flex-1 bg-foreground/10" />
          </div>

          <form onSubmit={onSubmit} className="mt-4 space-y-4">

            {mode === "sign-up" && (
              <div className="space-y-1">
                <Label htmlFor="name" className="text-[12px] font-medium text-muted-foreground">
                  Your name
                </Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="given-name"
                  required
                  maxLength={40}
                  placeholder="Diri"
                  className="rounded-xl text-[13px]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
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

          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={onGuest}
            className="glass mt-3 h-12 w-full rounded-full border-white/60 text-[15px] tracking-tight shadow-[0_8px_24px_-12px_oklch(0_0_0/0.35)]"
          >
            Continue as guest
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
