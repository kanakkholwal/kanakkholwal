import { createServerFn } from "@tanstack/react-start";
import { edgeMemo } from "~/lib/cache";
import { getServerEnv } from "~/server/env.server";
import { cacheResponse } from "~/server/http-cache";
import { insightConfig, statsConfig } from "./config";
import { type GitHubStarHistory, getStarHistoriesBatch } from "./lib/github";
import { getProjectInsight } from "./lib/insight";
import { fetchNpmStats } from "./lib/npm";
import { getVersions, sumVersions } from "./lib/versions";
import { pkgOptions } from "./searchParams";

export const getStarHistories = createServerFn({ method: "GET" }).handler(async () => {
  cacheResponse(600);
  try {
    return await getStarHistoriesBatch(statsConfig.repositories.map((r) => r.repo));
  } catch (err) {
    console.error("[stats] star histories failed", err);
    const empty: GitHubStarHistory = { count: 0, bins: [] };
    return Object.fromEntries(statsConfig.repositories.map((r) => [r.repo, empty]));
  }
});

/** One entry per `statsConfig.npmPackages`, same order. */
export const getNpmStats = createServerFn({ method: "GET" }).handler(() => {
  cacheResponse(3600);
  return fetchNpmStats([...statsConfig.npmPackages]);
});

const INSIGHT_HEADERS: Record<string, () => Record<string, string>> = {
  "college-ecosystem": () => ({ "X-Authorization": getServerEnv().PROJECTS_CE_TOKEN ?? "" }),
};

export const getInsights = createServerFn({ method: "GET" }).handler(() => {
  cacheResponse(600);
  return cachedInsights();
});

const cachedInsights = edgeMemo(
  "insights",
  () =>
    Promise.all(
      insightConfig.map(async (project) => {
        try {
          return {
            project,
            insight: await getProjectInsight(project, INSIGHT_HEADERS[project.id]?.()),
          };
        } catch (err) {
          console.error(`[stats] insight ${project.id} failed`, err);
          return { project, insight: null };
        }
      }),
    ),
  600,
);

export type VersionsInput = { pkg: (typeof pkgOptions)[number]; beta: boolean };

export const getVersionData = createServerFn({ method: "GET" })
  .validator((input: VersionsInput) => ({
    pkg: pkgOptions.includes(input.pkg) ? input.pkg : "both",
    beta: input.beta === true,
  }))
  .handler(async ({ data: { pkg, beta } }) => {
    cacheResponse(3600);
    const allVersions = await getVersions(beta);
    const pkgVersions = pkg === "both" ? sumVersions(allVersions) : allVersions;
    const latest = (pkgVersions.at(-1) as Record<string, unknown> | undefined)?.[pkg];
    const versions = Object.keys((latest as Record<string, number> | undefined) ?? {}).slice(0, 5);
    const records = pkgVersions.map((v) => ({
      date: v.date,
      ...((v as Record<string, unknown>)[pkg] as Record<string, number>),
    }));
    return { records, versions };
  });
