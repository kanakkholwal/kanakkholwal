import { createServerFn } from "@tanstack/react-start";
import { appConfig } from "root/project.config";
import { getGithubStats } from "~/api/github";
import { getMediumPosts } from "~/api/medium";
import { getSiteResult } from "~/lib/analytics/service";
import { getRequestHeader } from "@tanstack/react-start/server";
import { memo } from "~/lib/cache";
import { loadHeroOrbitData } from "./hero-orbit.server";

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
