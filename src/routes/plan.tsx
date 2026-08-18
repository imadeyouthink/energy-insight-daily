import { createFileRoute, Link } from "@tanstack/react-router";

import { FireflyCompanion, fireflyStateFor } from "@/components/energy/FireflyCompanion";
import { PlanView } from "@/components/energy/PlanView";
import { TabBar } from "@/components/energy/TabBar";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { dateLabel, useToday } from "@/hooks/useToday";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Today's plan — Dunami" },
      {
        name: "description",
        content:
          "Your personalized plan for movement, food, caffeine and bedtime, based on today's check-in.",
      },
      { property: "og:title", content: "Today's plan — Dunami" },
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
  const fireflyState = fireflyStateFor(todayEntry);

  return (
    <main className="flex min-h-screen flex-col aurora px-5">
      <Toaster position="top-center" />
      <div className="mx-auto flex w-full max-w-md flex-grow flex-col">
        <div className="relative z-0 aurora -mx-5 px-5 pb-28 pt-5">
          <header className="py-2">
            <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
              {dateLabel(today)}
            </span>
            <h1 className="mt-3 text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground">
              {hasPlan ? parsedPlan!.headline : "No plan yet today"}
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed tracking-tight text-muted-foreground">
              {hasPlan
                ? parsedPlan!.recap
                : "Do your check-in and your plan shows up right here."}
            </p>
          </header>
        </div>

        <div className="relative z-10 -mx-5 -mt-14 flex-grow rounded-t-[28px] bg-plan-sheet px-5 pt-16 pb-32 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.12)]">
          <div className="absolute -top-20 left-1/2 z-20 -translate-x-1/2">
            <FireflyCompanion
              state={fireflyState}
              className="h-40 w-40 drop-shadow-[0_12px_28px_rgba(0,0,0,0.15)]"
            />
          </div>
          {hasPlan ? (
            <PlanView bullets={parsedPlan!.bullets} />
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
      </div>
      <TabBar />
    </main>
  );
}
