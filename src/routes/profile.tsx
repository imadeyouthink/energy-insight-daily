import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { TabBar } from "@/components/energy/TabBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — Dunami" },
      {
        name: "description",
        content: "Update your name, email address and password for your Dunami account.",
      },
      { property: "og:title", content: "Your profile — Dunami" },
      {
        property: "og:description",
        content: "Manage your Dunami account details in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const { displayName } = useProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setName(displayName ?? "");
  }, [displayName]);

  useEffect(() => {
    setEmail(user?.email ?? "");
  }, [user?.email]);

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    const next = name.trim().slice(0, 40);
    if (!next || !user?.id) return;
    setBusy(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, display_name: next }, { onConflict: "id" });
      if (error) throw error;
      await supabase.auth.updateUser({ data: { display_name: next } });
      await queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
      toast.success("Name updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save your name.");
    } finally {
      setBusy(false);
    }
  }

  async function saveEmail(e: React.FormEvent) {
    e.preventDefault();
    const next = email.trim();
    if (!next || next === user?.email) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: next });
      if (error) throw error;
      toast.success("Check your inbox to confirm the new email.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update your email.");
    } finally {
      setBusy(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setPassword("");
      setConfirm("");
      toast.success("Password updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update your password.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <main className="min-h-screen bg-background px-5 pb-40">
      <Toaster position="top-center" />
      <div className="mx-auto w-full max-w-md">
        <div className="aurora -mx-5 mb-5 px-5 pb-6 pt-5">
          <Link
            to="/"
            aria-label="Back to home"
            className="glass mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70"
          >
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </Link>
          <header className="py-1">
            <h1 className="text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground">
              Your profile
            </h1>
            <p className="mt-1 text-[15px] leading-relaxed tracking-tight text-muted-foreground">
              Update your name, email and password.
            </p>
          </header>
        </div>

        <div className="space-y-4">
          <form onSubmit={saveName} className="glass space-y-3 rounded-[1.75rem] px-5 py-5">
            <Label htmlFor="name" className="text-[12px] font-medium text-muted-foreground">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              maxLength={40}
              placeholder="Your name"
              className="rounded-xl text-[13px]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              type="submit"
              variant="outline"
              disabled={busy || !name.trim()}
              className="h-11 w-full rounded-full border-foreground/10 bg-foreground text-[15px] font-medium tracking-tight text-background hover:bg-foreground/90 hover:text-background"
            >
              Save name
            </Button>
          </form>

          <form onSubmit={saveEmail} className="glass space-y-3 rounded-[1.75rem] px-5 py-5">
            <Label htmlFor="email" className="text-[12px] font-medium text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              className="rounded-xl text-[13px]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              variant="outline"
              disabled={busy || !email.trim() || email.trim() === user?.email}
              className="glass h-11 w-full rounded-full text-[15px] tracking-tight"
            >
              Update email
            </Button>
          </form>

          <form onSubmit={savePassword} className="glass space-y-3 rounded-[1.75rem] px-5 py-5">
            <Label htmlFor="password" className="text-[12px] font-medium text-muted-foreground">
              New password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              className="rounded-xl text-[13px]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Label htmlFor="confirm" className="text-[12px] font-medium text-muted-foreground">
              Confirm password
            </Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              minLength={6}
              className="rounded-xl text-[13px]"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <Button
              type="submit"
              variant="outline"
              disabled={busy || !password || !confirm}
              className="glass h-11 w-full rounded-full text-[15px] tracking-tight"
            >
              Update password
            </Button>
          </form>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="mt-6 block w-full text-center text-[13px] font-medium tracking-tight text-muted-foreground underline underline-offset-4"
        >
          Sign out
        </button>
      </div>
      <TabBar />
    </main>
  );
}
