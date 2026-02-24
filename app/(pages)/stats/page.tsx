import { cn } from "@/lib/utils";
import { Terminal } from "lucide-react";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import {
  PiStackDuotone
} from "react-icons/pi";
import { generateMetadata } from "~/utils/seo";
import {
  NPMDownloads,
  NPMDownloadsSkeleton,
  NPMStats,
  NPMStatsSkeleton,
} from "./_components/downloads";
import { InsightStats } from "./_components/insight";
import {
  StarHistoryGraph,
  StarHistoryGraphSkeleton,
} from "./_components/stars";
import { RepoBeatsActivityGraph } from "./_components/stars.client";
import { Versions } from "./_components/versions";
import { Widget } from "./_components/widget";
import { WidgetSkeleton } from "./_components/widget.skeleton";
import StatsPageClient from "./client";
import { insightConfig, statsConfig } from "./config";
import { getVersions, sumVersions } from "./lib/versions";
import { loadSearchParams } from "./searchParams";

export const dynamic = "force-dynamic";

type StatsPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function StatsPage(props: StatsPageProps) {
  const header = (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          System Analytics
          <span className="text-border">/</span>
          Live Data
        </div>
        <h1 className="text-4xl md:text-6xl font-medium tracking-tight font-instrument-serif text-foreground">
          Project <span className="italic text-muted-foreground">Metrics</span>
        </h1>
        <p className="max-w-xl text-muted-foreground text-sm leading-relaxed">
          Real-time telemetry across open-source repositories, package
          registries, and deployment infrastructure.
        </p>
      </div>

      <div className="flex divide-x divide-border border border-border bg-background/50 backdrop-blur-sm rounded-lg overflow-hidden">
        <div className="px-4 py-2 flex flex-col justify-center">
          <span className="text-[10px] uppercase font-mono text-muted-foreground">
            Sources
          </span>
          <span className="font-medium text-sm">GitHub / NPM</span>
        </div>
        <div className="px-4 py-2 flex flex-col justify-center">
          <span className="text-[10px] uppercase font-mono text-muted-foreground">
            Region
          </span>
          <span className="font-medium text-sm">Global</span>
        </div>
      </div>
    </div>
  );

  const repoSection = (
    <div className="space-y-6">
      <Suspense fallback={<StarHistoryGraphSkeleton />}>
        <StarHistoryGraph />
      </Suspense>

      <Widget
        className={cn(
          "h-auto flex-col gap-2 border border-border rounded-xl bg-background/50 shadow-sm",
          statsConfig.flags.repoBeats ? "flex" : "hidden",
        )}
      >
        {statsConfig.flags.repoBeats && <RepoBeatsActivityGraph />}
        <div className="flex flex-1 items-center gap-6 p-6 border-t border-border">
          <Suspense fallback={<NPMStatsSkeleton />}>
            <NPMStats />
          </Suspense>
        </div>
      </Widget>
    </div>
  );

  const registrySection = (
    <div className="space-y-6">
      <Suspense fallback={<NPMDownloadsSkeleton />}>
        <NPMDownloads />
      </Suspense>

      {statsConfig.flags.versionAdoptionGraph && (
        <Suspense fallback={<WidgetSkeleton />}>
          <div className="border border-border rounded-xl bg-background/50 overflow-hidden shadow-sm p-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <PiStackDuotone className="text-lg" /> Version Adoption
            </div>
            <VersionsLoader searchParams={props.searchParams} />
          </div>
        </Suspense>
      )}
    </div>
  );

  const healthSection = (
    <div className="grid grid-cols-1 gap-4">
      {insightConfig.map((insight) => (
        <Suspense fallback={<WidgetSkeleton />} key={insight.id}>
          <InsightStats project={insight} />
        </Suspense>
      ))}

      <div className="mt-4 p-6 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center">
        <Terminal className="text-3xl text-muted-foreground/30 mb-3" />
        <p className="text-xs font-mono text-muted-foreground">
          End of Metrics Stream
        </p>
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

export const metadata = generateMetadata({
  title: "Metrics & Telemetry",
  description:
    "Real-time visual analytics of open-source impact: GitHub star velocity, NPM download aggregation, and version distribution.",
  path: "/stats",
  keywords: [
    "metrics",
    "telemetry",
    "github analytics",
    "npm stats",
    "data visualization",
    "engineering dashboard",
  ],
});

//  LOADERS 
type VersionsLoaderProps = {
  searchParams: Promise<SearchParams>;
};

async function VersionsLoader({ searchParams }: VersionsLoaderProps) {
  const { pkg, beta } = await loadSearchParams(searchParams);
  const allVersions = await getVersions(beta);
  const pkgVersions = pkg === "both" ? sumVersions(allVersions) : allVersions;
  // @ts-expect-error
  const versionsToShow = Object.entries(pkgVersions.at(-1)?.[pkg] ?? {})
    .slice(0, 5)
    .map(([key, _]) => key);
  return (
    <Suspense
      fallback={
        <div className="animate-pulse text-xs font-mono text-muted-foreground">
          Querying Registry...
        </div>
      }
    >
      <Versions
        records={pkgVersions.map((v) => ({
          date: v.date,
          // @ts-ignore
          ...v[pkg],
        }))}
        versions={versionsToShow}
      />
    </Suspense>
  );
}
