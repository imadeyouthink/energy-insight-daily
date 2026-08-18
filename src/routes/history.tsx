import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { History } from "@/components/energy/History";
import { TrendSparklines } from "@/components/energy/TrendSparklines";
import { TabBar } from "@/components/energy/TabBar";
import { todayKey } from "@/lib/cycle";
import { fetchEntries } from "@/lib/data";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — Dunami" },
      {
        name: "description",
        content: "Look back at your last 14 days of sleep, energy, stress and day intensity.",
      },
      { property: "og:title", content: "History — Dunami" },
      {
        property: "og:description",
        content: "Your last 14 daily check-ins at a glance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const entriesQuery = useQuery({ queryKey: ["entries"], queryFn: () => fetchEntries(14) });
  const entries = entriesQuery.data ?? [];

  return (
    <main className="flex min-h-screen flex-col aurora px-5">
      <div className="mx-auto flex w-full max-w-md flex-grow flex-col">
        <div className="relative z-0 aurora -mx-5 px-5 pb-24 pt-10">
          <header className="py-3">
            <h1 className="text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground">
              Last 14 days
            </h1>
            <p className="mt-1 text-[15px] leading-relaxed tracking-tight text-muted-foreground">
              Your recent check-ins.
            </p>
          </header>
        </div>

        <div className="relative z-10 -mx-5 -mt-14 flex-grow rounded-t-[28px] bg-white px-5 pt-8 pb-32 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.12)]">
          {entries.length === 0 ? (
            <p className="text-[15px] text-muted-foreground">No check-ins yet.</p>
          ) : (
            <>
              <section className="mb-6">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Last 7 days
                </h2>
                <div className="mt-3 rounded-[1.5rem] bg-white/70 p-4 shadow-[0_8px_28px_-14px_oklch(0.35_0.02_260/0.25)] backdrop-blur-sm">
                  <TrendSparklines entries={entries} today={todayKey()} />
                </div>
              </section>
              <History entries={entries} />
              <div className="mt-8 rounded-[1.75rem] bg-turquoise p-5">
                <p className="text-[15px] font-semibold tracking-tight text-turquoise-foreground">
                  Patterns take a couple weeks to show up.
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-turquoise-foreground/90">
                  Keep checking in daily — Dunami will start pointing out what's actually driving
                  your energy.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      <TabBar />
    </main>
  );
}
