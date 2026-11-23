import { Await } from "@tanstack/react-router";
import { Page, PageHeader, Section } from "@/components/site/page";
import { SectionBoundary } from "@/components/utils/section-boundary";
import { GithubOverview, GithubSkeleton } from "./_components/github";
import { Usage, UsageSkeleton } from "./_components/usage";
import { NpmDownloads, NpmSkeleton } from "./_components/npm";
import { Stars, StarsSkeleton } from "./_components/stars";
import { Versions, VersionsSkeleton } from "./_components/versions";
import type { getGithubOverview, getUsage, getNpmStats, getStarHistories, getVersionData } from "./stats.functions";

type Resolved<F extends (...args: never[]) => unknown> = Awaited<ReturnType<F>>;

export type StatsPageData = {
  stars: Promise<Resolved<typeof getStarHistories>>;
  npm: Promise<Resolved<typeof getNpmStats>>;
  github: Promise<Resolved<typeof getGithubOverview>>;
  usage: Promise<Resolved<typeof getUsage>>;
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

      <Section
        id="github"
        icon="brand-github"
        title="github."
        description="A year of contributions and where the work went"
        index={1}
      >
        <SectionBoundary name="GitHub" icon="brand-github" ghost="calendar">
          <Await promise={data.github} fallback={<GithubSkeleton />}>
            {(github) => <GithubOverview data={github} />}
          </Await>
        </SectionBoundary>
      </Section>

      <Section id="npm" icon="brand-npm" title="npm." description="Downloads across every published package" index={2}>
        <SectionBoundary name="npm" icon="brand-npm" ghost="chart">
          <Await promise={data.npm} fallback={<NpmSkeleton />}>
            {(npm) => <NpmDownloads stats={npm} />}
          </Await>
        </SectionBoundary>
      </Section>

      {data.versions ? (
        <Section
          id="versions"
          icon="layers"
          title="versions."
          description="Which releases people actually run"
          index={3}
        >
          <SectionBoundary name="Versions" icon="layers" ghost="chart">
            <Await promise={data.versions} fallback={<VersionsSkeleton />}>
              {(v) => <Versions data={v} />}
            </Await>
          </SectionBoundary>
        </Section>
      ) : null}

      <Section id="stars" icon="star" title="stars." description="New stars over the last 12 days" index={4}>
        <SectionBoundary name="Stars" icon="star" ghost="chart">
          <Await promise={data.stars} fallback={<StarsSkeleton />}>
            {(stars) => <Stars data={stars} />}
          </Await>
        </SectionBoundary>
      </Section>

      <Section
        id="usage"
        icon="users-group"
        title="in use."
        description="Live traffic to the projects built on this work"
        index={5}
      >
        <SectionBoundary name="Usage" icon="users-group" ghost="grid">
          <Await promise={data.usage} fallback={<UsageSkeleton />}>
            {(items) => <Usage items={items} />}
          </Await>
        </SectionBoundary>
      </Section>
    </Page>
  );
}
