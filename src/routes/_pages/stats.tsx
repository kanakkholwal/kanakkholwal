import { createFileRoute } from "@tanstack/react-router";
import { statsConfig } from "~/features/stats/config";
import StatsPage from "~/features/stats/page";
import { pkgOptions } from "~/features/stats/searchParams";
import {
  getInsights,
  getNpmStats,
  getStarHistories,
  getVersionData,
  type VersionsInput,
} from "~/features/stats/stats.functions";
import { seo } from "~/utils/seo";

type StatsSearch = Partial<VersionsInput> & { repo?: string };

export const Route = createFileRoute("/_pages/stats")({
  validateSearch: (search: Record<string, unknown>): StatsSearch => ({
    pkg: pkgOptions.find((p) => p === search.pkg),
    beta: search.beta === true || search.beta === "true" ? true : undefined,
    repo: typeof search.repo === "string" ? search.repo : undefined,
  }),
  loaderDeps: ({ search }) => ({ pkg: search.pkg ?? "both", beta: search.beta ?? false }),
  // Unawaited promises stream into the page's <Await> boundaries.
  loader: ({ deps }) => ({
    stars: getStarHistories(),
    npm: getNpmStats(),
    insights: getInsights(),
    versions: statsConfig.flags.versionAdoptionGraph ? getVersionData({ data: deps }) : null,
  }),
  // `repo` isn't a dep; without this every repo switch refetches npm and GitHub.
  staleTime: 5 * 60_000,
  head: () =>
    seo({
      title: "Open source stats",
      description: "npm downloads and GitHub stars for the packages and repos Kanak Kholwal maintains, pulled live.",
      path: "/stats",
      keywords: ["open source", "npm downloads", "github stars", "npm stats"],
    }),
  component: StatsRoute,
});

function StatsRoute() {
  return <StatsPage data={Route.useLoaderData()} />;
}
