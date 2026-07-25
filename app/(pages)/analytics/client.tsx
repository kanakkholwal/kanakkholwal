"use client";

import { StyleSwap } from "@/components/animated/style-swap";
import { Serif, StoryReveal } from "@/components/application/story.frame";
import BlurFade from "@/components/magicui/blur-fade";
import { StyleModels, type StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import * as React from "react";
import type { AnalyticsResult, AnalyticsSnapshot, AnalyticsSource, RangeKey } from "~/lib/analytics/types";
import { AreaSpark } from "./_components/area-spark";
import { BarList } from "./_components/bar-list";
import { CountUp } from "./_components/count-up";
import { MetricTile } from "./_components/metric-tile";
import { RangeTabs } from "./_components/range-tabs";
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
      p.date ? new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "",
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

export default function AnalyticsClient({ result }: { result: AnalyticsResult }) {
  const [style] = useStorage<StylingModel>("styling.model", StyleModels[0].id);
  const [rangeKey, setRangeKey] = React.useState<RangeKey>("30d");
  const snapshot = result.ranges[rangeKey];
  const view = useView(snapshot);
  const shared: ViewProps = { snapshot, view, ok: result.ok, source: result.source, rangeKey, setRangeKey };

  return (
    <>
      {!result.ok && result.error && <ErrorBanner message={result.error} />}
      <StyleSwap swapKey={style}>
        {style === "minimal" ? (
          <MinimalAnalytics {...shared} />
        ) : style === "static" ? (
          <StaticAnalytics {...shared} />
        ) : style === "story" ? (
          <StoryAnalytics {...shared} />
        ) : (
          <DynamicAnalytics {...shared} />
        )}
      </StyleSwap>
    </>
  );
}

type ViewProps = {
  snapshot: AnalyticsSnapshot;
  view: ReturnType<typeof useView>;
  ok: boolean;
  source: AnalyticsSource;
  rangeKey: RangeKey;
  setRangeKey: (key: RangeKey) => void;
};

// --- shared bits ---
function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="w-full border-b border-amber-500/20 bg-amber-500/[0.06] px-6 py-2.5 text-center">
      <p className="text-xs text-amber-600 dark:text-amber-400">{message}</p>
    </div>
  );
}

function StatusPill({ ok, source }: { ok: boolean; source: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground backdrop-blur-md">
      <span className="relative flex size-1.5">
        {ok && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={cn(
            "relative inline-flex size-1.5 rounded-full",
            ok ? "bg-emerald-500" : "bg-muted-foreground/50",
          )}
        />
      </span>
      {ok ? `Live · ${source}` : "No data"}
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
  if (!snapshot.range.start || !snapshot.range.end) return "";
  const fmt = (s: string) => new Date(s).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${fmt(snapshot.range.start)} to ${fmt(snapshot.range.end)}`;
}

// --- DYNAMIC ---
function DynamicAnalytics({ snapshot, view, ok, source, rangeKey, setRangeKey }: ViewProps) {
  const span = rangeLabel(snapshot);
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
        <div className="mx-auto flex max-w-app flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <StatusPill ok={ok} source={source.toUpperCase()} />
            <h1 className="font-instrument-serif text-4xl font-medium tracking-tight text-foreground md:text-6xl">
              Site <span className="italic text-muted-foreground">Analytics</span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Real visitors, sessions, and where they come from on{" "}
              <span className="text-foreground">{snapshot.label}</span>
              {span ? `. ${span}.` : "."}
            </p>
          </div>
          <RangeTabs value={rangeKey} onChange={setRangeKey} />
        </div>
      </motion.div>

      <div key={rangeKey} className="mx-auto max-w-app space-y-14 px-6 py-14">
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
          <div className="mb-6">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Visitors over time</h2>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Daily unique visitors · last {snapshot.range.days} days
            </p>
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
function MinimalAnalytics({ snapshot, view, ok, source, rangeKey, setRangeKey }: ViewProps) {
  const span = rangeLabel(snapshot);
  return (
    <div className="mx-auto max-w-3xl space-y-12 px-6 py-16 md:py-24">
      <BlurFade delay={DELAY}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <StatusPill ok={ok} source={source.toUpperCase()} />
            <h1 className="text-2xl font-medium tracking-tight text-foreground">
              {snapshot.label} · analytics
            </h1>
            <p className="text-sm text-muted-foreground">
              Last {snapshot.range.days} days{span ? ` · ${span}` : ""}
            </p>
          </div>
          <RangeTabs value={rangeKey} onChange={setRangeKey} />
        </div>
      </BlurFade>

      <React.Fragment key={rangeKey}>
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
      </React.Fragment>
    </div>
  );
}

// --- STATIC ---
function StaticAnalytics({ snapshot, view, ok, source, rangeKey, setRangeKey }: ViewProps) {
  const span = rangeLabel(snapshot);
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 @container md:py-20 md:pt-32">
      <div className="mb-10 border-b border-border pb-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-2">
            <StatusPill ok={ok} source={source.toUpperCase()} />
            <h1 className="text-4xl font-medium tracking-tight text-foreground">
              {snapshot.label}
            </h1>
            <p className="text-sm text-muted-foreground">Web analytics{span ? ` · ${span}` : ""}</p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <RangeTabs value={rangeKey} onChange={setRangeKey} />
            <div className="rounded-lg border border-border px-4 py-2">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">Source</span>
              <span className="text-sm font-medium text-foreground">
                {source === "ga" ? "Google Analytics" : source === "posthog" ? "PostHog" : "Analytics"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <React.Fragment key={rangeKey}>
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
      </React.Fragment>
    </div>
  );
}

// --- STORY ---
function StoryAnalytics({ snapshot, view, rangeKey, setRangeKey }: ViewProps) {
  const best = [...snapshot.topPages].sort((a, b) => b.value - a.value)[0];
  return (
    <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-28 md:pt-36">
      <StoryReveal>
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            In the open
          </p>
          <RangeTabs value={rangeKey} onChange={setRangeKey} />
        </div>
        <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tighter text-foreground md:text-5xl">
          What the <Serif className="text-muted-foreground/80">numbers</Serif> say.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
          Over the last {snapshot.range.days} days, <span className="text-foreground">{snapshot.label}</span>{" "}
          drew{" "}
          <span className="font-semibold text-foreground">{full(snapshot.totals.users)}</span> visitors
          across <span className="font-semibold text-foreground">{full(snapshot.totals.sessions)}</span>{" "}
          sessions.
          {best ? (
            <>
              {" "}Most of them landed on <span className="text-foreground">{best.label}</span>.
            </>
          ) : null}{" "}
          This is the quiet signal that tells me whether any of it is useful.
        </p>
      </StoryReveal>

      <div key={rangeKey} className="mt-14 space-y-12">
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
