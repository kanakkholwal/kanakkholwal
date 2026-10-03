import { Await } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Terminal } from "lucide-react";
import { Suspense } from "react";
import { PiStackDuotone } from "react-icons/pi";
import {
  NPMDownloads,
  NPMDownloadsSkeleton,
  NPMStats,
  NPMStatsSkeleton,
} from "./_components/downloads";
import { InsightStats } from "./_components/insight";
import { StarHistoryGraph, StarHistoryGraphSkeleton } from "./_components/stars";
import { RepoBeatsActivityGraph } from "./_components/stars.graph";
import { Versions } from "./_components/versions";
import { Widget } from "./_components/widget";
import { WidgetSkeleton } from "./_components/widget.skeleton";
import StatsPageClient from "./client";
import { insightConfig, statsConfig } from "./config";
import type {
  getInsights,
  getNpmStats,
  getStarHistories,
  getVersionData,
} from "./stats.functions";

type Resolved<F extends (...args: never[]) => unknown> = Awaited<ReturnType<F>>;

export type StatsPageData = {
  stars: Promise<Resolved<typeof getStarHistories>>;
  npm: Promise<Resolved<typeof getNpmStats>>;
  insights: Promise<Resolved<typeof getInsights>>;
  versions: Promise<Resolved<typeof getVersionData>> | null;
};

export default function StatsPage({ data }: { data: StatsPageData }) {
  const header = (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          System Analytics
          <span className="text-border">/</span>
          Live Data
        </div>
        <h1 className="text-4xl md:text-6xl font-medium tracking-tight font-serif text-foreground">
          Project <span className="italic text-muted-foreground">Metrics</span>
        </h1>
        <p className="max-w-xl text-muted-foreground text-sm leading-relaxed">
          Real-time telemetry across open-source repositories, package
          registries, and deployment infrastructure.
        </p>
      </div>

      <div className="flex divide-x divide-border border border-border bg-background/50 backdrop-blur-sm rounded-lg overflow-hidden">
        <div className="px-4 py-2 flex flex-col justify-center">
          <span className="text-2xs uppercase font-mono text-muted-foreground">
            Sources
          </span>
          <span className="font-medium text-sm whitespace-nowrap">GitHub / NPM</span>
        </div>

      </div>
    </div>
  );

  const repoSection = (
    <div className="space-y-6">
      <Await promise={data.stars} fallback={<StarHistoryGraphSkeleton />}>
        {(stars) => <StarHistoryGraph data={stars} />}
      </Await>

      <Widget
        className={cn(
          "h-auto flex-col gap-2 border border-border rounded-xl bg-background/50 shadow-sm",
          statsConfig.flags.repoBeats ? "flex" : "hidden",
        )}
      >
        {statsConfig.flags.repoBeats && <RepoBeatsActivityGraph />}
        <div className="flex flex-1 items-center gap-6 p-6 border-t border-border">
          <Await promise={data.npm} fallback={<NPMStatsSkeleton />}>
            {(npmStats) => <NPMStats npmStats={npmStats} />}
          </Await>
        </div>
      </Widget>
    </div>
  );

  const registrySection = (
    <div className="space-y-6">
      <Await promise={data.npm} fallback={<NPMDownloadsSkeleton />}>
        {(npmStats) => <NPMDownloads npmStats={npmStats} />}
      </Await>

      {data.versions && (
        <div className="border border-border rounded-xl bg-background/50 overflow-hidden shadow-sm p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <PiStackDuotone className="text-lg" /> Version Adoption
          </div>
          <Await
            promise={data.versions}
            fallback={
              <div className="animate-pulse text-xs font-mono text-muted-foreground">
                Querying Registry...
              </div>
            }
          >
            {(v) => <Versions records={v.records as never} versions={v.versions} />}
          </Await>
        </div>
      )}
    </div>
  );

  const healthSection = (
    <div className="grid grid-cols-1 gap-4">
      <Suspense
        fallback={insightConfig.map((insight) => (
          <WidgetSkeleton key={insight.id} />
        ))}
      >
        <Await promise={data.insights}>
          {(insights) =>
            insights.map(({ project, insight }) =>
              insight ? (
                <InsightStats key={project.id} project={project} insightData={insight} />
              ) : null,
            )
          }
        </Await>
      </Suspense>

      <div className="mt-4 p-6 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center">
        <Terminal className="text-3xl text-muted-foreground/30 mb-3" />
        <p className="text-xs font-mono text-muted-foreground">End of Metrics Stream</p>
      </div>
    </div>
  );

  return (
    <StatsPageClient
      header={header}
      repoSection={repoSection}
      registrySection={registrySection}
      healthSection={healthSection}
    />
  );
}
