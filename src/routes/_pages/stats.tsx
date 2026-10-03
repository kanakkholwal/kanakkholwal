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
  // Unawaited promises stream into <Await> boundaries, like the old Suspense'd server components.
  loader: ({ deps }) => ({
    stars: getStarHistories(),
    npm: getNpmStats(),
    insights: getInsights(),
    versions: statsConfig.flags.versionAdoptionGraph ? getVersionData({ data: deps }) : null,
  }),
  head: () =>
    seo({
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
    }),
  component: StatsRoute,
});

function StatsRoute() {
  return <StatsPage data={Route.useLoaderData()} />;
}
