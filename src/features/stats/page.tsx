import { Await } from "@tanstack/react-router";
import { Page, PageHeader, Section } from "@/components/site/page";
import { Skeleton } from "@/components/ui/skeleton";
import { Insights } from "./_components/insight";
import { NpmDownloads, NpmSkeleton } from "./_components/npm";
import { Stars, StarsSkeleton } from "./_components/stars";
import { Versions, VersionsSkeleton } from "./_components/versions";
import type { getInsights, getNpmStats, getStarHistories, getVersionData } from "./stats.functions";

type Resolved<F extends (...args: never[]) => unknown> = Awaited<ReturnType<F>>;

export type StatsPageData = {
  stars: Promise<Resolved<typeof getStarHistories>>;
  npm: Promise<Resolved<typeof getNpmStats>>;
  insights: Promise<Resolved<typeof getInsights>>;
  versions: Promise<Resolved<typeof getVersionData>> | null;
};

export default function StatsPage({ data }: { data: StatsPageData }) {
  return (
    <Page className="flex flex-col gap-20">
      <PageHeader
        className="mb-0"
        title="stats."
        eyebrow="open source · npm / GitHub"
        description="Downloads and stars for the packages and repos I maintain, pulled live from the registries."
      />

      <Section id="npm" title="npm." number={1} description="Downloads across every published package" index={1}>
        <Await promise={data.npm} fallback={<NpmSkeleton />}>
          {(npm) => <NpmDownloads stats={npm} />}
        </Await>
      </Section>

      {data.versions ? (
        <Section id="versions" title="versions." description="Which releases people actually run" index={2}>
          <Await promise={data.versions} fallback={<VersionsSkeleton />}>
            {(v) => <Versions data={v} />}
          </Await>
        </Section>
      ) : null}

      <Section
        id="stars"
        title="stars."
        number={data.versions ? 3 : 2}
        description="New stars over the last 12 days"
        index={3}
      >
        <Await promise={data.stars} fallback={<StarsSkeleton />}>
          {(stars) => <Stars data={stars} />}
        </Await>
      </Section>

      <Section
        id="usage"
        title="in use."
        number={data.versions ? 4 : 3}
        description="Live usage from projects built on this work"
        index={4}
      >
        <Await promise={data.insights} fallback={<Skeleton shape="block" className="h-24 rounded-xl" />}>
          {(items) => <Insights items={items} />}
        </Await>
      </Section>
    </Page>
  );
}
