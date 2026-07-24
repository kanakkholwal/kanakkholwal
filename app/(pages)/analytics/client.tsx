"use client";

import { StyleSwap } from "@/components/animated/style-swap";
import { Serif, StoryReveal } from "@/components/application/story.frame";
import BlurFade from "@/components/magicui/blur-fade";
import { StyleModels, type StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import * as React from "react";
import type { AnalyticsSnapshot } from "~/lib/analytics/types";
import { AreaSpark } from "./_components/area-spark";
import { BarList } from "./_components/bar-list";
import { CountUp } from "./_components/count-up";
import { MetricTile } from "./_components/metric-tile";
import { fmtDuration, full, ratePct } from "./_components/utils";

const DELAY = 0.05;

type MetricDef = {
  label: string;
  value: number;
  previous: number;
  series?: number[];
  color: string;
  format?: (n: number) => string;
  spark?: boolean;
};

function useView(snapshot: AnalyticsSnapshot) {
  return React.useMemo(() => {
    const users = snapshot.series.map((p) => p.users);
    const pageViews = snapshot.series.map((p) => p.pageViews);
    const sessions = snapshot.series.map((p) => p.sessions);
    const labels = snapshot.series.map((p) =>
      new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    );
    const metrics: MetricDef[] = [
      { label: "Visitors", value: snapshot.totals.users, previous: snapshot.previousTotals.users, series: users, color: "var(--chart-1)", format: full },
      { label: "Page Views", value: snapshot.totals.pageViews, previous: snapshot.previousTotals.pageViews, series: pageViews, color: "var(--chart-2)", format: full },
      { label: "Sessions", value: snapshot.totals.sessions, previous: snapshot.previousTotals.sessions, series: sessions, color: "var(--chart-3)", format: full },
      { label: "Avg. Engagement", value: snapshot.totals.avgEngagementSeconds, previous: snapshot.previousTotals.avgEngagementSeconds, color: "var(--chart-4)", format: fmtDuration, spark: false },
    ];
    return { users, pageViews, sessions, labels, metrics };
  }, [snapshot]);
}

export default function AnalyticsClient({ snapshot }: { snapshot: AnalyticsSnapshot }) {
  const [style] = useStorage<StylingModel>("styling.model", StyleModels[0].id);
  const view = useView(snapshot);
  const props = { snapshot, view };

  return (
    <StyleSwap swapKey={style}>
      {style === "minimal" ? (
        <MinimalAnalytics {...props} />
      ) : style === "static" ? (
        <StaticAnalytics {...props} />
      ) : style === "story" ? (
        <StoryAnalytics {...props} />
      ) : (
        <DynamicAnalytics {...props} />
      )}
    </StyleSwap>
  );
}

type ViewProps = { snapshot: AnalyticsSnapshot; view: ReturnType<typeof useView> };

// --- shared bits ---
function LiveBadge({ live, source }: { live: boolean; source: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground backdrop-blur-md">
      <span className="relative flex size-1.5">
        {live && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={cn(
            "relative inline-flex size-1.5 rounded-full",
            live ? "bg-emerald-500" : "bg-amber-500",
          )}
        />
      </span>
      {live ? `Live · ${source}` : "Sample data"}
    </span>
  );
}

function Breakdowns({ snapshot }: { snapshot: AnalyticsSnapshot }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <BarList title="Top Pages" items={snapshot.topPages} color="var(--chart-1)" />
      <BarList title="Countries" items={snapshot.topCountries} color="var(--chart-2)" />
      <BarList title="Referrers" items={snapshot.topReferrers} color="var(--chart-3)" />
      <BarList title="Devices" items={snapshot.devices} color="var(--chart-4)" />
    </div>
  );
}

function rangeLabel(snapshot: AnalyticsSnapshot) {
  const fmt = (s: string) => new Date(s).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${fmt(snapshot.range.start)} – ${fmt(snapshot.range.end)}`;
}

// --- DYNAMIC ---
function DynamicAnalytics({ snapshot, view }: ViewProps) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-app overflow-x-hidden">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full border-b border-border/40 bg-background/60 px-6 py-12 backdrop-blur-md md:py-16"
      >
        <div className="mx-auto max-w-app space-y-3">
          <LiveBadge live={snapshot.live} source={snapshot.source.toUpperCase()} />
          <h1 className="font-instrument-serif text-4xl font-medium tracking-tight text-foreground md:text-6xl">
            Site <span className="italic text-muted-foreground">Analytics</span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            How <span className="text-foreground">{snapshot.label}</span> is doing in public — real
            visitors, sessions, and where they come from. {rangeLabel(snapshot)}.
          </p>
        </div>
      </motion.div>

      <div className="mx-auto max-w-app space-y-14 px-6 py-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, staggerChildren: 0.08 }}
          className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {view.metrics.map((m) => (
            <MetricTile key={m.label} {...m} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Visitors over time</h2>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Daily unique visitors · last {snapshot.range.days} days
              </p>
            </div>
            <div className="absolute right-6 top-6">
              <LiveBadge live={snapshot.live} source={snapshot.source.toUpperCase()} />
            </div>
          </div>
          <AreaSpark
            data={view.users}
            labels={view.labels}
            color="var(--chart-1)"
            height={300}
            interactive
            formatValue={full}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <Breakdowns snapshot={snapshot} />
        </motion.div>
      </div>
    </main>
  );
}

// --- MINIMAL ---
function MinimalAnalytics({ snapshot, view }: ViewProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-12 px-6 py-16 md:py-24">
      <BlurFade delay={DELAY}>
        <div className="space-y-3">
          <LiveBadge live={snapshot.live} source={snapshot.source.toUpperCase()} />
          <h1 className="text-2xl font-medium tracking-tight text-foreground">
            {snapshot.label} · analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Last {snapshot.range.days} days — {rangeLabel(snapshot)}
          </p>
        </div>
      </BlurFade>

      <BlurFade delay={DELAY * 2}>
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 border-y border-border py-8 md:grid-cols-4">
          {view.metrics.map((m) => (
            <div key={m.label} className="space-y-1">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {m.label}
              </p>
              <p className="text-2xl font-semibold tabular-nums text-foreground">
                <CountUp value={m.value} format={m.format} />
              </p>
              {m.series && (
                <div className="pt-1" style={{ color: m.color }}>
                  <AreaSpark data={m.series} height={28} strokeWidth={1.25} fill={false} />
                </div>
              )}
            </div>
          ))}
        </div>
      </BlurFade>

      <BlurFade delay={DELAY * 3}>
        <div className="space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            // visitors
          </p>
          <div style={{ color: "var(--chart-1)" }}>
            <AreaSpark data={view.users} labels={view.labels} height={200} strokeWidth={1.5} interactive formatValue={full} />
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={DELAY * 4}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <BarList title="Top Pages" items={snapshot.topPages} color="var(--chart-1)" />
          <BarList title="Referrers" items={snapshot.topReferrers} color="var(--chart-3)" />
        </div>
      </BlurFade>
    </div>
  );
}

// --- STATIC ---
function StaticAnalytics({ snapshot, view }: ViewProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 @container md:py-20 md:pt-32">
      <div className="mb-10 border-b border-border pb-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-2">
            <LiveBadge live={snapshot.live} source={snapshot.source.toUpperCase()} />
            <h1 className="text-4xl font-medium tracking-tight text-foreground">
              {snapshot.label}
            </h1>
            <p className="text-sm text-muted-foreground">Web analytics · {rangeLabel(snapshot)}</p>
          </div>
          <div className="rounded-lg border border-border px-4 py-2">
            <span className="block font-mono text-[10px] uppercase text-muted-foreground">Source</span>
            <span className="text-sm font-medium text-foreground">
              {snapshot.source === "ga" ? "Google Analytics" : snapshot.source === "posthog" ? "PostHog" : "Sample"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-4">
        {view.metrics.map((m) => (
          <div key={m.label} className="bg-background p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {m.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
              <CountUp value={m.value} format={m.format} />
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-border p-6">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Visitors · last {snapshot.range.days} days
        </p>
        <div style={{ color: "var(--chart-1)" }}>
          <AreaSpark data={view.users} labels={view.labels} height={260} interactive formatValue={full} />
        </div>
      </div>

      <div className="mt-6">
        <Breakdowns snapshot={snapshot} />
      </div>
    </div>
  );
}

// --- STORY ---
function StoryAnalytics({ snapshot, view }: ViewProps) {
  const best = [...snapshot.topPages].sort((a, b) => b.value - a.value)[0];
  return (
    <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-28 md:pt-36">
      <StoryReveal>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          In the open
        </p>
        <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tighter text-foreground md:text-5xl">
          What the <Serif className="text-muted-foreground/80">numbers</Serif> say.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
          Over the last {snapshot.range.days} days, <span className="text-foreground">{snapshot.label}</span>{" "}
          drew{" "}
          <span className="font-semibold text-foreground">{full(snapshot.totals.users)}</span> visitors
          across <span className="font-semibold text-foreground">{full(snapshot.totals.sessions)}</span>{" "}
          sessions. Most of them landed on <span className="text-foreground">{best?.label}</span>. This
          is the quiet signal that tells me whether any of it is useful.
        </p>
      </StoryReveal>

      <div className="mt-14 space-y-12">
        <StoryReveal delay={0.1}>
          <div style={{ color: "var(--chart-1)" }}>
            <AreaSpark data={view.users} labels={view.labels} height={220} interactive formatValue={full} />
          </div>
        </StoryReveal>

        <StoryReveal delay={0.15}>
          <div className="grid grid-cols-2 gap-6 border-y border-border py-8 md:grid-cols-4">
            {view.metrics.map((m) => (
              <div key={m.label} className="space-y-1">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {m.label}
                </p>
                <p className="text-2xl font-semibold tabular-nums text-foreground">
                  <CountUp value={m.value} format={m.format} />
                </p>
              </div>
            ))}
          </div>
        </StoryReveal>

        <StoryReveal delay={0.2}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <BarList title="Where they read" items={snapshot.topPages} color="var(--chart-1)" />
            <BarList title="How they found me" items={snapshot.topReferrers} color="var(--chart-3)" />
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Bounce rate {ratePct(snapshot.totals.bounceRate)} · avg. engagement{" "}
            {fmtDuration(snapshot.totals.avgEngagementSeconds)}.
          </p>
        </StoryReveal>
      </div>
    </main>
  );
}
