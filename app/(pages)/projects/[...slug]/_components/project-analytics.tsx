"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import * as React from "react";
import type { AnalyticsSnapshot } from "~/lib/analytics/types";
import { AreaSpark } from "../../../analytics/_components/area-spark";
import { BarList } from "../../../analytics/_components/bar-list";
import { CountUp } from "../../../analytics/_components/count-up";
import { fmtDuration, full, ratePct } from "../../../analytics/_components/utils";

type ProjectContentProps = {
  snapshot: AnalyticsSnapshot | null;
  proseClassName?: string;
  children: React.ReactNode;
};

// Wraps project MDX in an Overview/Analytics tab pair — Analytics only when data exists.
export function ProjectContent({ snapshot, proseClassName, children }: ProjectContentProps) {
  if (!snapshot) return <div className={proseClassName}>{children}</div>;

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics" className="gap-1.5">
          Analytics
          <span
            className={cn(
              "inline-flex size-1.5 rounded-full",
              snapshot.live ? "bg-emerald-500" : "bg-amber-500",
            )}
          />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className={proseClassName}>{children}</div>
      </TabsContent>
      <TabsContent value="analytics">
        <ProjectAnalyticsPanel snapshot={snapshot} />
      </TabsContent>
    </Tabs>
  );
}

function ProjectAnalyticsPanel({ snapshot }: { snapshot: AnalyticsSnapshot }) {
  const users = snapshot.series.map((p) => p.users);
  const labels = snapshot.series.map((p) =>
    new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
  );
  const stats = [
    { label: "Visitors", value: snapshot.totals.users, format: full },
    { label: "Sessions", value: snapshot.totals.sessions, format: full },
    { label: "Page Views", value: snapshot.totals.pageViews, format: full },
    { label: "Engagement", value: snapshot.totals.avgEngagementSeconds, format: fmtDuration },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {snapshot.label} · last {snapshot.range.days} days
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          <span className={cn("size-1.5 rounded-full", snapshot.live ? "bg-emerald-500" : "bg-amber-500")} />
          {snapshot.live ? `Live · ${snapshot.source.toUpperCase()}` : "Sample data"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card/50 p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-1.5 text-xl font-semibold tabular-nums text-foreground">
              <CountUp value={s.value} format={s.format} />
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card/50 p-5" style={{ color: "var(--chart-1)" }}>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Visitors over time
        </p>
        <AreaSpark data={users} labels={labels} height={200} interactive formatValue={full} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BarList title="Top Pages" items={snapshot.topPages} color="var(--chart-1)" />
        <BarList title="Referrers" items={snapshot.topReferrers} color="var(--chart-3)" />
      </div>

      <p className="text-xs text-muted-foreground">
        Bounce rate {ratePct(snapshot.totals.bounceRate)}. Numbers are direct from{" "}
        {snapshot.source === "ga" ? "Google Analytics" : snapshot.source === "posthog" ? "PostHog" : "sample data"}.
      </p>
    </div>
  );
}
