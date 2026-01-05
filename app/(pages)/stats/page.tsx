import { cn } from "@/lib/utils";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
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
import { insightConfig, statsConfig } from "./config";
import { getVersions, sumVersions } from "./lib/versions";
import { loadSearchParams } from "./searchParams";

export const dynamic = "force-dynamic";

type StatsPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function StatsPage({ searchParams }: StatsPageProps) {



  return (
    <div className="mx-auto max-w-[88rem] px-4">
      <h2 className="text-shadow-glow relative z-2  text-5xl font-medium tracking-tight text-balance sm:text-5xl md:mb-36 md:text-6xl text-center max-w-xl mx-auto !mb-12">
        <p className="mb-3 font-mono text-xs font-normal tracking-widest text-black/80 uppercase md:text-sm dark:text-white/70">
          Project Stats
        </p>
        <span className="font-instrument-serif">
          <span className="md:text-6xl">Statistics & </span>{" "}
          <span className="text-colorful animate-gradient-x font-instrument-serif pe-2 tracking-tight italic">
            Insights
          </span>
        </span>
      </h2>
      <section className="my-4 grid grid-cols-1 gap-4 lg:grid-cols-2 max-w-(--max-app-width) mt-10">
        <h3 className="grid-cols-1 text-left lg:col-span-2 font-instrument-serif text-lg lg:text-3xl border-l-4 ps-4 border-colorful/30">
          <span className="text-colorful animate-gradient-x font-instrument-serif">Github</span>{"'s "}
          <span className="pe-2 tracking-tight italic">
            Insights
          </span>
        </h3>
        <Suspense fallback={<StarHistoryGraphSkeleton />}>
          <StarHistoryGraph />
        </Suspense>
        <Widget
          className={cn(
            "h-auto flex-col gap-2",
            statsConfig.flags.repoBeats ? "flex" : "hidden",
          )}
        >
          {statsConfig.flags.repoBeats && <RepoBeatsActivityGraph />}
          <div className="flex flex-1 items-center gap-6 p-4">
            <Suspense fallback={<NPMStatsSkeleton />}>
              <NPMStats />
            </Suspense>
          </div>
        </Widget>
      </section>
        <section className="my-4 grid grid-cols-1 gap-4 lg:grid-cols-2 max-w-(--max-app-width) mt-10">
        <h3 className="grid-cols-1 text-left lg:col-span-2 font-instrument-serif text-lg lg:text-3xl border-l-4 ps-4 border-colorful/30">
          <span className="text-colorful animate-gradient-x font-instrument-serif">Packages</span>{"'s "}
          <span className="pe-2 tracking-tight italic">
            Insights
          </span>
        </h3>
        <Suspense fallback={<NPMDownloadsSkeleton />}>
          <NPMDownloads />
        </Suspense>
        {statsConfig.flags.versionAdoptionGraph && (
          <Suspense fallback={<WidgetSkeleton />}>
            <VersionsLoader searchParams={searchParams} />
          </Suspense>
        )}

      </section>
      <section className="my-4 grid grid-cols-1 gap-4  max-w-(--max-app-width) mt-10">
        <h3 className="grid-cols-1 text-left lg:col-span-2 font-instrument-serif text-lg lg:text-3xl border-l-4 ps-4 border-colorful/30">
          <span className="text-colorful animate-gradient-x font-instrument-serif">Projects</span>{"'s "}
          <span className="pe-2 tracking-tight italic">
            Insights
          </span>
        </h3>
        {insightConfig.map((insight) => {
          return <Suspense fallback={<WidgetSkeleton />} key={insight.id}>
            <InsightStats key={insight.id} project={insight} />
          </Suspense>;
        })}
      </section>
    </div>
  );
}

export const metadata = generateMetadata({
  title: "Project Statistics & Insights",
  description:
    "Explore detailed visual analytics of Kanak’s open-source projects — GitHub star growth, NPM downloads, version adoption, and repository activity visualized in real-time.",
  path: "/stats",
  keywords: [
    "project statistics",
    "github stars",
    "npm downloads",
    "version adoption",
    "repository activity",
    "open source",
    "developer insights",
    "kanak kholwal",
    "portfolio",
    "analytics",
    "data visualization",
  ],
});



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
      fallback={<div className="animate-pulse text-center">Loading...</div>}
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
