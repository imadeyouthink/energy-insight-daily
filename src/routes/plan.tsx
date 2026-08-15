import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { PlanView } from "@/components/energy/PlanView";
import { TabBar } from "@/components/energy/TabBar";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { dateLabel, useToday } from "@/hooks/useToday";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Today's plan — Energy Coach" },
      {
        name: "description",
        content:
          "Your personalized plan for movement, food, caffeine and bedtime, based on today's check-in.",
      },
      { property: "og:title", content: "Today's plan — Energy Coach" },
      {
        property: "og:description",
        content: "Four practical moves for today, matched to how you actually feel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PlanPage,
});

function PlanPage() {
  const navigate = useNavigate();
  const { today, todayEntry, parsedPlan } = useToday();
  const hasPlan = !!todayEntry?.plan && !!parsedPlan;

  return (
    <main className="min-h-screen bg-background px-5 pb-40">
      <Toaster position="top-center" />
      <div className="mx-auto w-full max-w-md">
        <div className="aurora -mx-5 mb-5 px-5 pb-6 pt-5">
          <header className="glass rounded-[1.75rem] px-5 py-5 shadow-[0_18px_40px_-28px_oklch(0_0_0/0.45)]">
            <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
              {dateLabel(today)}
            </span>
            <h1 className="mt-2 text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground">
              {hasPlan ? parsedPlan!.headline : "No plan yet today"}
            </h1>
            <p className="mt-1 text-[15px] leading-relaxed tracking-tight text-muted-foreground">
              {hasPlan
                ? parsedPlan!.recap
                : "Do your check-in and your plan shows up right here."}
            </p>
          </header>
        </div>

        {hasPlan ? (
          <PlanView
            bullets={parsedPlan!.bullets}
            onEdit={() => navigate({ to: "/check-in" })}
          />
        ) : (
          <Button
            asChild
            variant="outline"
            className="glass h-12 w-full rounded-full text-[15px] tracking-tight shadow-[0_8px_24px_-12px_oklch(0_0_0/0.35)]"
          >
            <Link to="/check-in">Do the check-in</Link>
          </Button>
        )}
      </div>
      <TabBar />
    </main>
  );
}
