"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import * as React from "react";
import type { AnalyticsResult, RangeKey } from "~/lib/analytics/types";
import { AreaSpark } from "root/app/(pages)/analytics/_components/area-spark";
import { BarList } from "root/app/(pages)/analytics/_components/bar-list";
import { CountUp } from "root/app/(pages)/analytics/_components/count-up";
import { RangeTabs } from "root/app/(pages)/analytics/_components/range-tabs";
import { fmtDuration, full, ratePct } from "root/app/(pages)/analytics/_components/utils";

type ProjectContentProps = {
  result: AnalyticsResult | null;
  proseClassName?: string;
  children: React.ReactNode;
};

// Wraps project MDX in an Overview/Analytics tab pair; Analytics only when the project has GA.
export function ProjectContent({ result, proseClassName, children }: ProjectContentProps) {
  if (!result) return <div className={proseClassName}>{children}</div>;

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics" className="gap-1.5">
          Analytics
          <span
            className={cn(
              "inline-flex size-1.5 rounded-full",
              result.ok ? "bg-emerald-500" : "bg-amber-500",
            )}
          />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className={proseClassName}>{children}</div>
      </TabsContent>
      <TabsContent value="analytics">
        <ProjectAnalyticsPanel result={result} />
      </TabsContent>
    </Tabs>
  );
}

function ProjectAnalyticsPanel({ result }: { result: AnalyticsResult }) {
  const [rangeKey, setRangeKey] = React.useState<RangeKey>("30d");
  const snapshot = result.ranges[rangeKey];
  const users = snapshot.series.map((p) => p.users);
  const labels = snapshot.series.map((p) =>
    p.date ? new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "",
  );
  const stats = [
    { label: "Visitors", value: snapshot.totals.users, format: full },
    { label: "Sessions", value: snapshot.totals.sessions, format: full },
    { label: "Page Views", value: snapshot.totals.pageViews, format: full },
    { label: "Engagement", value: snapshot.totals.avgEngagementSeconds, format: fmtDuration },
  ];

  return (
    <div className="space-y-6">
      {!result.ok && result.error && (
        <p className="rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
          {result.error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {snapshot.label} · last {snapshot.range.days} days
        </p>
        <RangeTabs value={rangeKey} onChange={setRangeKey} />
      </div>

      <React.Fragment key={rangeKey}>
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
      </React.Fragment>

      <p className="text-xs text-muted-foreground">
        Bounce rate {ratePct(snapshot.totals.bounceRate)}. Numbers come straight from{" "}
        {snapshot.source === "ga" ? "Google Analytics" : snapshot.source === "posthog" ? "PostHog" : "analytics"}.
      </p>
    </div>
  );
}
