import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { History } from "@/components/energy/History";
import { TabBar } from "@/components/energy/TabBar";
import { fetchEntries } from "@/lib/data";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — Energy Coach" },
      {
        name: "description",
        content: "Look back at your last 14 days of sleep, energy, stress and day intensity.",
      },
      { property: "og:title", content: "History — Energy Coach" },
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
    <main className="min-h-screen bg-background px-5 pb-32">
      <div className="mx-auto w-full max-w-md">
        <div className="aurora -mx-5 safe-top mb-5 pb-5 pt-5">
          <header className="px-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/70">
              History
            </p>
            <h1 className="text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground">
              Last 14 days
            </h1>
            <p className="mt-1 text-[15px] leading-relaxed tracking-tight text-muted-foreground">
              Your recent check-ins at a glance.
            </p>
          </header>
        </div>

        {entries.length === 0 ? (
          <p className="text-[15px] text-muted-foreground">No check-ins yet.</p>
        ) : (
          <History entries={entries} />
        )}
      </div>
      <TabBar />
    </main>
  );
}

