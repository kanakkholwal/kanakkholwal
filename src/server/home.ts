import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { appConfig } from "root/project.config";
import { getGithubStats } from "~/api/github";
import { getMediumPosts } from "~/api/medium";
import { getSiteResult } from "~/lib/analytics/service";
import { memo } from "~/lib/cache";
import { type HeroOrbitPayload, loadHeroOrbitData } from "./hero-orbit.server";

export const getHeroOrbit = createServerFn({ method: "GET" }).handler(() => loadHeroOrbitData());

/** `null` when GitHub is down or the token is missing; the section then hides. */
export const getGithubSectionData = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return await getGithubStats(appConfig.usernames.github);
  } catch (err) {
    console.error("[github-section]", err);
    return null;
  }
});

const cachedMediumPosts = memo(async () =>
  (await getMediumPosts()).map((p) => ({ ...p, pubDate: p.pubDate.toISOString() })),
);

export const getBlogPosts = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return await cachedMediumPosts();
  } catch (err) {
    console.error("[blog] medium feed failed", err);
    return [];
  }
});

export const getSiteAnalytics = createServerFn({ method: "GET" }).handler(async () => {
  const host = getRequestHeader("host")?.replace(/^www\./, "") || appConfig.siteUrl;
  return getSiteResult(host);
});

const DAY = 86_400_000;

export type HomeData = {
  calendar: { date: string; count: number }[];
  github: { followers: number; stars: number; repos: number; contributions: number } | null;
  activity: HeroOrbitPayload["activity"];
  stats: HeroOrbitPayload["stats"];
};

/** Everything the home page needs, shaped on the server so the client renders it as is. */
export const getHomeData = createServerFn({ method: "GET" }).handler(async (): Promise<HomeData> => {
  const [orbit, github] = await Promise.all([
    loadHeroOrbitData(),
    getGithubStats(appConfig.usernames.github).catch((err) => {
      console.error("[home] github", err);
      return null;
    }),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const cutoff = new Date(Date.now() - 364 * DAY).toISOString().slice(0, 10);
  const calendar = github
    ? Object.values(github.stats.contributions)
        .flat()
        .filter((d) => d.date >= cutoff && d.date <= today)
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((d) => ({ date: d.date, count: d.count }))
    : [];

  return {
    calendar,
    github: github ? { ...github.stats.stats, contributions: calendar.reduce((sum, d) => sum + d.count, 0) } : null,
    activity: orbit.activity.slice(0, 4),
    stats: orbit.stats,
  };
});
