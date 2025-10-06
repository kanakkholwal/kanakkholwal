import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { appConfig } from "root/project.config";
import {
  NPMDownloads,
  NPMDownloadsSkeleton,
  NPMStats,
  NPMStatsSkeleton,
} from "./_components/downloads";
import {
  StarHistoryGraph,
  StarHistoryGraphSkeleton,
} from "./_components/stars";
import { RepoBeatsActivityGraph } from "./_components/stars.client";
import { Versions } from "./_components/versions";
import { Widget } from "./_components/widget";
import { WidgetSkeleton } from "./_components/widget.skeleton";
import { statsConfig } from "./config";
import { getStarHistory } from "./lib/github";
import { fetchNpmPackage } from "./lib/npm";
import { getVersions, sumVersions } from "./lib/versions";
import { loadSearchParams } from "./searchParams";

export const dynamic = "force-dynamic";

type StatsPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function StatsPage({ searchParams }: StatsPageProps) {
  const stars = await Promise.all(
    statsConfig.repositories.map((r) => r.repo).map(getStarHistory),
  );
  const npmStats = await Promise.all(
    statsConfig.npmPackages.map((pkg) => fetchNpmPackage(pkg)),
  );




  return (
    <div className="mx-auto max-w-[88rem] px-4">
      <h2
        className="text-shadow-glow relative z-2  text-5xl font-medium tracking-tight text-balance sm:text-5xl md:mb-36 md:text-6xl text-center max-w-xl mx-auto !mb-12"

      >
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
        <Suspense fallback={<StarHistoryGraphSkeleton />}>
          <StarHistoryGraph stars={stars} />
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
              <NPMStats npmStats={npmStats} />
            </Suspense>
          </div>
        </Widget>
        <Suspense fallback={<NPMDownloadsSkeleton />}>
          <NPMDownloads npmStats={npmStats} />
        </Suspense>
        {statsConfig.flags.versionAdoptionGraph && (
          <Suspense fallback={<WidgetSkeleton />}>
            <VersionsLoader searchParams={searchParams} />
          </Suspense>
        )}
      </section>
    </div>
  );
}
export const metadata: Metadata = {
  title: "Project Statistics & Insights",
  description:
    "Explore detailed analytics of Kanak’s open-source projects — GitHub star growth, NPM downloads, version adoption, and repository activity visualized in real-time.",
  alternates: {
    canonical: "/stats",
  },
  openGraph: {
    title: "Project Statistics & Insights | Kanak",
    description:
      "Visual analytics and metrics of Kanak’s projects — star history, NPM stats, repo activity, and version adoption trends.",
    url: `${appConfig.url}/stats`,
    siteName: "Kanak’s Portfolio",
    images: [
      {
        url: `${appConfig.url}/og/stats.png`,
        width: 1200,
        height: 630,
        alt: "Kanak’s Project Statistics Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Statistics & Insights | Kanak",
    description:
      "Track GitHub stars, NPM downloads, and version adoption for Kanak’s open-source work in one interactive dashboard.",
    creator: appConfig.social.twitter,
    images: [`${appConfig.url}/og/stats.png`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
};
// --

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
