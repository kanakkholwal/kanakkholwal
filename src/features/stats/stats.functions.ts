import { createServerFn } from "@tanstack/react-start";
import { getServerEnv } from "~/server/env.server";
import { insightConfig, statsConfig } from "./config";
import { type GitHubStarHistory, getStarHistory } from "./lib/github";
import { getProjectInsight } from "./lib/insight";
import { fetchNpmPackage } from "./lib/npm";
import { getVersions, sumVersions } from "./lib/versions";
import { pkgOptions } from "./searchParams";

export const getStarHistories = createServerFn({ method: "GET" }).handler(async () => {
  const stars = await Promise.all(
    statsConfig.repositories.map((r) =>
      getStarHistory(r.repo).catch((err): GitHubStarHistory => {
        console.error(`[stats] star history ${r.repo} failed`, err);
        return { count: 0, bins: [] };
      }),
    ),
  );
  const byRepo: Record<string, GitHubStarHistory> = {};
  statsConfig.repositories.forEach((r, i) => {
    byRepo[r.repo] = stars[i];
  });
  return byRepo;
});

/** One entry per `statsConfig.npmPackages`, same order. */
export const getNpmStats = createServerFn({ method: "GET" }).handler(() =>
  Promise.all(statsConfig.npmPackages.map((pkg) => fetchNpmPackage(pkg))),
);

const INSIGHT_HEADERS: Record<string, () => Record<string, string>> = {
  "college-ecosystem": () => ({ "X-Authorization": getServerEnv().PROJECTS_CE_TOKEN ?? "" }),
};

export const getInsights = createServerFn({ method: "GET" }).handler(() =>
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
);

export type VersionsInput = { pkg: (typeof pkgOptions)[number]; beta: boolean };

export const getVersionData = createServerFn({ method: "GET" })
  .validator((input: VersionsInput) => ({
    pkg: pkgOptions.includes(input.pkg) ? input.pkg : "both",
    beta: input.beta === true,
  }))
  .handler(async ({ data: { pkg, beta } }) => {
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
