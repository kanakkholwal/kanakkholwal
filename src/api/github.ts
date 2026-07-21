import { cache } from "react";
import { unstable_cache } from "next/cache";
import { formatDistanceToNowStrict } from "date-fns";

export type HeroOrbitActivityKind =
  | "rocket"
  | "package"
  | "code"
  | "stars:bs"
  | "git-commit"
  | "git-pull-request"
  | "message-circle"
  | "star";

export type HeroOrbitActivityItem = {
  kind: HeroOrbitActivityKind;
  label: string;
  value: string;
  /** ISO timestamp for the activity (used to sort). */
  occurredAt: string | null;
  /** Pre-formatted relative time, e.g. "2d ago". */
  time: string;
  /** Optional URL the row links to. */
  url?: string;
};

export type HeroOrbitStats = {
  /** Total projects listed in the portfolio (counted from local source). */
  projects: number;
  /** GitHub repos owned by the user with at least one star. */
  ossRepos: number;
  /** Total stars earned across all own repos. */
  totalStars: number;
};

export type HeroOrbitData = {
  stats: HeroOrbitStats;
  activity: HeroOrbitActivityItem[];
};

export type ContributionActivity = {
  date: string;
  count: number;
  level: number;
};

export type ContributionResponse = {
  total: Record<string, number>;
  contributions: Array<ContributionActivity>;
};

export type GithubStats = {
  followers: number;
  stars: number;
  repos: number;
  forks: number;
};

export type Contributions = {
  contributions: Record<string, ContributionActivity[]>;
  total: Record<string, number>;
  stats: GithubStats;
};

// You need a GitHub token with public_repo access
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
export type ActivityOverview = {
  repositoriesContributedTo: Array<ContributedRepository>;
  totalRepositoriesContributedTo: number;
};

export type CodeReviewDistribution = {
  commits: number;
  issues: number;
  pullRequests: number;
  codeReviews: number;
  totalContributions: number;
};

export type Organization = {
  login: string;
  name: string;
  avatarUrl: string;
  url: string;
};

export type ContributedOrganization = {
  login: string;
  name: string;
  avatarUrl: string;
  url: string;
  repositoriesContributedTo: number;
};
export type ContributedRepository = {
  name: string;
  owner: string;
  url: string;
  description: string | null;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  isPrivate: boolean;
  updatedAt: string;
};

export const getContributedOrganizations = cache(
  async (username: string): Promise<ContributedOrganization[]> => {
    const query = `
      query($login: String!) {
        user(login: $login) {
          repositoriesContributedTo(
            first: 100,
            contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]
          ) {
            nodes {
              owner {
                login
                avatarUrl
                url
                ... on Organization {
                  name
                }
              }
              nameWithOwner
            }
          }
        }
      }
    `;

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        query,
        variables: { login: username },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch contributed organizations");
    }

    const json = await response.json();

    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    const repos = json.data.user.repositoriesContributedTo.nodes;

    // Group by organization and count contributions
    const orgMap = new Map<string, ContributedOrganization>();

    repos.forEach((repo: any) => {
      const owner = repo.owner;

      // Skip if it's a personal repository (user account, not organization)
      // Organizations have the 'name' field
      if (!owner.name && owner.login === username) {
        return; // Skip user's own repos
      }

      const existing = orgMap.get(owner.login);

      if (existing) {
        existing.repositoriesContributedTo++;
      } else {
        orgMap.set(owner.login, {
          login: owner.login,
          name: owner.name || owner.login,
          avatarUrl: owner.avatarUrl,
          url: owner.url,
          repositoriesContributedTo: 1,
        });
      }
    });

    // Convert to array and sort by number of repos contributed to
    return Array.from(orgMap.values()).sort(
      (a, b) => b.repositoriesContributedTo - a.repositoriesContributedTo,
    );
  },
);

export type DetailedActivity = {
  activityOverview: ActivityOverview;
  codeReviewDistribution: CodeReviewDistribution;
  contributedOrganizations: ContributedOrganization[];
  organizations: Organization[];
};

/**
 * Fetches a detailed activity summary for a user over the past year.
 *
 * This function:
 * - Queries GitHub's GraphQL API for repositories the user has contributed to (most-recent first) and
 *   the user's contributionsCollection for the past year (commits, issues, PRs, reviews).
 * - Builds an ActivityOverview listing repositories contributed to (with basic repo metadata).
 * - Computes a CodeReviewDistribution that summarizes counts of commits, issues, PRs, and code reviews.
 * - Gathers and counts organizations (only when owner type is Organization) the user contributed to.
 *
 * Notes:
 * - Uses the GITHUB_TOKEN environment variable for authentication.
 * - The time window is approximately one year from "now" (from = today - 1 year).
 * - Uses in-memory caching via `cache`.
 *
 * @param username - GitHub username to fetch detailed activity for.
 * @returns A Promise that resolves to a DetailedActivity object containing:
 *   - activityOverview: repositories contributed to and total count,
 *   - codeReviewDistribution: counts of contribution types,
 *   - contributedOrganizations: organization list with repo counts,
 *   - organizations: (currently returned as an empty array, reserved for future use).
 *
 * @throws {Error} If the network request fails or the GraphQL API returns an error.
 */
export const getDetailedActivity = cache(
  async (username: string): Promise<DetailedActivity> => {
    const query = `
      query($login: String!) {
        user(login: $login) {
          repositoriesContributedTo(
            first: 100,
            contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]
            orderBy: { field: UPDATED_AT, direction: DESC }
          ) {
            totalCount
            nodes {
              name
              description
              url
              stargazerCount
              forkCount
              isPrivate
              updatedAt
              primaryLanguage {
                name
                color
              }
              owner {
                __typename
                login
                avatarUrl
                url
                ... on Organization {
                  name
                }
              }
            }
          }
          
          contributionsCollection {
            totalCommitContributions
            totalIssueContributions
            totalPullRequestContributions
            totalPullRequestReviewContributions
          }
        }
      }
    `;

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        query,
        variables: {
          login: username,
        },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch detailed activity");
    }

    const json = await response.json();

    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    const userData = json.data.user;
    const contributions = userData.contributionsCollection;
    const repos = userData.repositoriesContributedTo.nodes;

    // Extract organizations from contributed repos
    const orgMap = new Map<string, ContributedOrganization>();

    repos.forEach((repo: any) => {
      const owner = repo.owner;

      // Only include Organizations
      if (owner.__typename !== "Organization") {
        return;
      }

      const existing = orgMap.get(owner.login);

      if (existing) {
        existing.repositoriesContributedTo++;
      } else {
        orgMap.set(owner.login, {
          login: owner.login,
          name: owner.name || owner.login,
          avatarUrl: owner.avatarUrl,
          url: owner.url,
          repositoriesContributedTo: 1,
        });
      }
    });

    // Calculate totals
    const totalCommits = contributions.totalCommitContributions;
    const totalIssues = contributions.totalIssueContributions;
    const totalPRs = contributions.totalPullRequestContributions;
    const totalReviews = contributions.totalPullRequestReviewContributions;
    const totalContributions =
      totalCommits + totalIssues + totalPRs + totalReviews;

    return {
      activityOverview: {
        repositoriesContributedTo: repos.map((repo: any) => ({
          name: repo.name,
          owner: repo.owner.login,
          url: repo.url,
          description: repo.description,
          stargazerCount: repo.stargazerCount,
          forkCount: repo.forkCount,
          primaryLanguage: repo.primaryLanguage,
          isPrivate: repo.isPrivate,
          updatedAt: repo.updatedAt,
        })),
        totalRepositoriesContributedTo:
          userData.repositoriesContributedTo.totalCount,
      },
      codeReviewDistribution: {
        commits: totalCommits,
        issues: totalIssues,
        pullRequests: totalPRs,
        codeReviews: totalReviews,
        totalContributions,
      },
      contributedOrganizations: Array.from(orgMap.values()).sort(
        (a, b) => b.repositoriesContributedTo - a.repositoriesContributedTo,
      ),
      organizations: [], // You can populate this if needed
    };
  },
);

/**
 * Combines profile stats and detailed activity into a single API call.
 *
 * This convenience function concurrently fetches:
 * - getProfile(username)  -> contributions and stats,
 * - getDetailedActivity(username) -> detailed activity overview and distributions.
 *
 * Behavior:
 * - Requires GITHUB_TOKEN; will early-throw if token is not defined.
 * - Uses Promise.allSettled to run both fetches concurrently and returns a combined result if both succeed.
 * - Logs detailed errors and throws a generic error if either fetch fails.
 * - Uses in-memory caching via `cache`.
 *
 * @param username - GitHub username to fetch combined stats and activity for.
 * @returns A Promise that resolves to an object with:
 *   - stats: Contributions (profile & calendar),
 *   - activity: DetailedActivity (activity overview & distributions).
 *
 * @throws {Error} If GITHUB_TOKEN is not defined, or if either underlying fetch fails.
 */

export const getGithubStats = cache(
  async (
    username: string,
  ): Promise<{
    stats: Contributions;
    activity: DetailedActivity;
  }> => {
    if (!GITHUB_TOKEN) {
      throw new Error("GitHub token is not defined");
    }

    const [stats, activity] = await Promise.allSettled([
      getCachedContributions(username),
      getDetailedActivity(username),
    ]);

    if (stats.status !== "fulfilled" || activity.status !== "fulfilled") {
      console.log("Error fetching GitHub data:", {
        statsError: stats.status === "rejected" ? stats.reason : null,
        activityError: activity.status === "rejected" ? activity.reason : null,
      });
      throw new Error("Failed to fetch GitHub stats or activity");
    }
    return {
      stats: stats.value,
      activity: activity.value,
    };
  },
);

/**
 * Maps GitHub contribution level strings to a numeric 0-4 scale.
 *
 * This helper converts GitHub's named contribution intensity levels
 * ("FIRST_QUARTILE", "SECOND_QUARTILE", "THIRD_QUARTILE", "FOURTH_QUARTILE")
 * into numeric values (1..4). Any unknown or empty value maps to 0.
 *
 * @param level - The contribution level string from the GitHub API.
 * @returns A number in the range 0-4 representing the intensity/level.
 */

const getLevel = (level: string): number => {
  switch (level) {
    case "FIRST_QUARTILE":
      return 1;
    case "SECOND_QUARTILE":
      return 2;
    case "THIRD_QUARTILE":
      return 3;
    case "FOURTH_QUARTILE":
      return 4;
    default:
      return 0;
  }
};

export type WeeklyContribution = {
  weekStart: string; // ISO string date of the Sunday for that week
  count: number;
  averageLevel: number; // Useful for coloring the graph
};

/**
 * Aggregates daily contributions into weekly buckets.
 *
 * Given an array of daily ContributionActivity entries, this function:
 * - Sorts the input by date,
 * - Determines the week-start (Sunday) for each date and groups days into that week,
 * - Sums counts per week and computes an average/representative level (currently the max level in the week).
 *
 * The returned array contains WeeklyContribution objects with:
 * - weekStart: ISO date string of the Sunday of that week,
 * - count: total contributions in that week,
 * - averageLevel: aggregated weekly level (useful for coloring or intensity).
 *
 * This function is synchronous and memoized via `cache`.
 *
 * @param dailyContributions - Array of ContributionActivity (daily entries) to aggregate.
 * @returns An array of WeeklyContribution objects ordered by week start (iteration order of the map).
 */

export const getWeeklyContributions = cache(
  (dailyContributions: ContributionActivity[]): WeeklyContribution[] => {
    const weeklyMap = new Map<string, WeeklyContribution>();

    // Sort daily contributions by date first to ensure order
    const sorted = [...dailyContributions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    for (const day of sorted) {
      const dateObj = new Date(day.date);
      // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
      const dayOfWeek = dateObj.getDay();

      // Calculate the start of the week (Sunday)
      // We subtract the day of the week from the date to get the previous Sunday
      const startOfWeek = new Date(dateObj);
      startOfWeek.setDate(dateObj.getDate() - dayOfWeek);
      const weekKey = startOfWeek.toISOString().split("T")[0];

      const existing = weeklyMap.get(weekKey);

      if (existing) {
        existing.count += day.count;
        // Weighted average for level roughly
        existing.averageLevel = Math.max(existing.averageLevel, day.level);
      } else {
        weeklyMap.set(weekKey, {
          weekStart: weekKey,
          count: day.count,
          averageLevel: day.level,
        });
      }
    }

    return Array.from(weeklyMap.values());
  },
);

/**
 * Fetches contributions from a public contributions API and supplements with GitHub GraphQL stats.
 *
 * This function:
 * - Calls an external cached contributions endpoint (github-contributions-api.jogruber.de) for raw daily contributions.
 * - Calls GitHub GraphQL to get followers, owned repositories, and repository counts to compute stars/forks.
 * - Validates both responses are JSON and successful, then combines data into the Contributions shape.
 *
 * Notes:
 * - Uses Promise.allSettled to parallelize the external and GitHub requests and errors when either fails.
 * - Requires GITHUB_TOKEN for the GitHub GraphQL request.
 * - Uses in-memory caching via `cache`.
 *
 * @param username - GitHub username to fetch cached contributions and stats for.
 * @returns A Promise that resolves to a Contributions object containing:
 *   - contributions: map of year -> ContributionActivity[] (from the external contributions service),
 *   - total: total contributions object as returned by the external API,
 *   - stats: aggregated GithubStats from GraphQL data.
 *
 * @throws {Error} If any network request fails, responses are non-JSON, or the GraphQL API returns an error.
 */
export const getCachedContributions = cache(
  async (username: string): Promise<Contributions> => {
    // 1️⃣ Contributions API
    const contributionsUrl = `https://github-contributions-api.jogruber.de/v4/${username}`;

    // 2️⃣ GitHub GraphQL API for followers, stars, repos, forks
    const githubQuery = `
      query($login: String!) {
        user(login: $login) {
          followers {
            totalCount
          }
          repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
            totalCount
            nodes {
              stargazerCount
              forkCount
            }
          }
        }
      }
    `;

    const [contribRes, githubRes] = await Promise.allSettled([
      fetch(contributionsUrl),
      fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
        body: JSON.stringify({
          query: githubQuery,
          variables: { login: username },
        }),
      }),
    ]);
    if (contribRes.status !== "fulfilled" || githubRes.status !== "fulfilled") {
      throw new Error("Failed to fetch contributions or GitHub data");
    }

    // Parse responses
    if (!contribRes.value.ok || !githubRes.value.ok) {
      throw new Error("Failed to fetch contributions or GitHub data");
    }
    // Type assertion for contributions response
    if (
      !contribRes.value.headers
        .get("content-type")
        ?.includes("application/json")
    ) {
      throw new Error("Invalid contributions response format");
    }
    if (
      !githubRes.value.headers.get("content-type")?.includes("application/json")
    ) {
      throw new Error("Invalid GitHub response format");
    }
    // Parse JSON responses
    const contribData = (await contribRes.value.json()) as ContributionResponse;
    const githubData = await githubRes.value.json();

    // Map contributions year-wise
    const contributionByYear = contribData.contributions.reduce(
      (mapping, item) => {
        const year = new Date(item.date).getFullYear().toString();
        if (!mapping[year]) mapping[year] = [];
        mapping[year].push(item);
        return mapping;
      },
      {} as Record<string, ContributionActivity[]>,
    );

    // Aggregate stars and forks
    const repos = githubData.data.user.repositories.nodes;
    const totalStars = repos.reduce(
      (acc: number, r: any) => acc + r.stargazerCount,
      0,
    );
    const totalForks = repos.reduce(
      (acc: number, r: any) => acc + r.forkCount,
      0,
    );

    const stats: GithubStats = {
      followers: githubData.data.user.followers.totalCount,
      stars: totalStars,
      forks: totalForks,
      repos: githubData.data.user.repositories.totalCount,
    };

    return {
      contributions: contributionByYear,
      total: contribData.total,
      stats,
    };
  },
);

const HERO_ORBIT_QUERY = `
  query($login: String!) {
    user(login: $login) {
      repositories(
        ownerAffiliations: OWNER
        isFork: false
        first: 50
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        totalCount
        nodes {
          name
          stargazerCount
          url
          pushedAt
          releases(first: 1, orderBy: { field: CREATED_AT, direction: DESC }) {
            nodes {
              tagName
              name
              publishedAt
              url
            }
          }
        }
      }
      contributionsCollection {
        pullRequestContributions(first: 10) {
          nodes {
            occurredAt
            pullRequest {
              number
              title
              url
              state
              merged
              mergedAt
              repository {
                nameWithOwner
              }
            }
          }
        }
        pullRequestReviewContributions(first: 10) {
          nodes {
            occurredAt
            pullRequest {
              number
              title
              url
              state
              repository {
                nameWithOwner
              }
            }
          }
        }
      }
      starredRepositories(first: 5, orderBy: { field: STARRED_AT, direction: DESC }) {
        nodes {
          nameWithOwner
          description
          url
        }
      }
    }
  }
`;

function formatRelative(date: Date | null, fallback: string): string {
  if (!date) return fallback;
  const diff = Date.now() - date.getTime();
  if (diff < 0) return fallback;
  if (diff < 60_000) return "just now";
  return `${formatDistanceToNowStrict(date, { addSuffix: false })} ago`;
}

function shorten(text: string, max = 34): string {
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

function pickRepoSlug(nameWithOwner: string | null | undefined): string {
  if (!nameWithOwner) return "";
  const slash = nameWithOwner.indexOf("/");
  return slash >= 0 ? nameWithOwner.slice(slash + 1) : nameWithOwner;
}

type RawRelease = {
  tagName: string | null;
  name: string | null;
  publishedAt: string | null;
  url: string | null;
};

type RawRepoNode = {
  name: string;
  stargazerCount: number;
  url: string;
  pushedAt: string | null;
  releases: { nodes: RawRelease[] };
};

type RawPRContribution = {
  occurredAt: string | null;
  pullRequest: {
    number: number;
    title: string;
    url: string;
    state: string;
    merged: boolean;
    mergedAt: string | null;
    repository: { nameWithOwner: string };
  } | null;
};

type RawReviewContribution = {
  occurredAt: string | null;
  pullRequest: {
    number: number;
    title: string;
    url: string;
    state: string;
    repository: { nameWithOwner: string };
  } | null;
};

type RawStarredRepo = {
  nameWithOwner: string;
  description: string | null;
  url: string;
};

function pushRelease(
  repos: RawRepoNode[],
  bucket: HeroOrbitActivityItem[],
): void {
  let best: { repo: string; tag: string; url: string; date: Date } | null = null;
  for (const r of repos) {
    for (const rel of r.releases.nodes) {
      if (!rel.publishedAt) continue;
      const d = new Date(rel.publishedAt);
      if (!best || d.getTime() > best.date.getTime()) {
        best = {
          repo: r.name,
          tag: rel.tagName ?? rel.name ?? "release",
          url: rel.url ?? r.url,
          date: d,
        };
      }
    }
  }
  if (best) {
    bucket.push({
      kind: "rocket",
      label: "Shipped",
      value: shorten(`${best.repo} ${best.tag}`),
      occurredAt: best.date.toISOString(),
      time: formatRelative(best.date, "recently"),
      url: best.url,
    });
  }
}

function pushPullRequestActivity(
  prs: RawPRContribution[],
  bucket: HeroOrbitActivityItem[],
): void {
  for (const node of prs) {
    const pr = node.pullRequest;
    if (!pr || !node.occurredAt) continue;
    const repo = pickRepoSlug(pr.repository?.nameWithOwner);
    const isMerged = pr.merged || pr.state === "MERGED";
    bucket.push({
      kind: "git-pull-request",
      label: isMerged ? "Merged" : "Opened",
      value: shorten(`${repo}#${pr.number} · ${pr.title}`),
      occurredAt: node.occurredAt,
      time: formatRelative(new Date(node.occurredAt), "recently"),
      url: pr.url,
    });
  }
}

function pushReviewActivity(
  reviews: RawReviewContribution[],
  bucket: HeroOrbitActivityItem[],
): void {
  for (const node of reviews) {
    const pr = node.pullRequest;
    if (!pr || !node.occurredAt) continue;
    const repo = pickRepoSlug(pr.repository?.nameWithOwner);
    bucket.push({
      kind: "code",
      label: "Reviewed",
      value: shorten(`${repo}#${pr.number} · ${pr.title}`),
      occurredAt: node.occurredAt,
      time: formatRelative(new Date(node.occurredAt), "recently"),
      url: pr.url,
    });
  }
}

function pushStarredActivity(
  stars: RawStarredRepo[],
  bucket: HeroOrbitActivityItem[],
): void {
  for (const repo of stars) {
    bucket.push({
      kind: "star",
      label: "Starred",
      value: shorten(repo.description || repo.nameWithOwner),
      occurredAt: null,
      time: "recently",
      url: repo.url,
    });
  }
}

const AGGREGATION_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

function pluralizeNoun(item: HeroOrbitActivityItem): string {
  switch (item.kind) {
    case "git-pull-request":
      return item.label === "Merged" ? "PRs merged" : "PRs opened";
    case "code":
      return item.label === "Reviewed" ? "reviews submitted" : "contributions";
    case "rocket":
      return "releases shipped";
    case "message-circle":
      return "comments posted";
    default:
      return "items";
  }
}

function extractRepoSlug(item: HeroOrbitActivityItem): string {
  if (!item.url) return "";
  const match = /github\.com\/[^/]+\/([^/?#]+)/.exec(item.url);
  return match?.[1] ?? "";
}

/**
 * Coalesces duplicate-style activity into a single summary row when several
 * items share the same action and the same repository within a rolling
 * 7-day window. Items without a clear repo (e.g. starred repos) group only
 * by action. The output is capped at 4 entries and always preserves the
 * rolling stars-earned summary at the tail.
 *
 * Examples (recent → displayed):
 *  - 6 PR merges in `orbit` this week
 *      → `Merged · 6 PRs merged in orbit · this week`
 *  - 4 starred repos within the window
 *      → `Starred · 4 repos · this week`
 *  - 1 merge + 2 reviews in different repos
 *      → shown individually as separate rows
 */
function aggregateActivity(items: HeroOrbitActivityItem[]): HeroOrbitActivityItem[] {
  const summary = items.find((item) => item.kind === "stars:bs");
  const timeBound = items.filter((item) => item.kind !== "stars:bs");

  // Group key includes the repo so actions on different repos stay distinct.
  const groups = new Map<string, HeroOrbitActivityItem[]>();
  for (const item of timeBound) {
    const repo = extractRepoSlug(item);
    const key = `${repo}::${item.kind}::${item.label}`;
    let bucket = groups.get(key);
    if (!bucket) {
      bucket = [];
      groups.set(key, bucket);
    }
    bucket.push(item);
  }

  const now = Date.now();
  const out: HeroOrbitActivityItem[] = [];

  for (const group of groups.values()) {
    group.sort((a, b) => {
      const at = a.occurredAt ? new Date(a.occurredAt).getTime() : 0;
      const bt = b.occurredAt ? new Date(b.occurredAt).getTime() : 0;
      return bt - at;
    });

    const recent = group.filter((item) => {
      if (!item.occurredAt) return false;
      const t = new Date(item.occurredAt).getTime();
      return now - t <= AGGREGATION_WINDOW_MS;
    });

    if (recent.length >= 2) {
      const latest = recent[0];
      const repo = extractRepoSlug(latest);
      const noun = pluralizeNoun(latest);
      // Stars are about the *target* repos — saying "in {repo}" reads
      // weirdly, so drop the suffix for that kind.
      const value =
        latest.kind === "star"
          ? `${recent.length} repos`
          : repo
            ? `${recent.length} ${noun} in ${repo}`
            : `${recent.length} ${noun}`;
      out.push({
        kind: latest.kind,
        label: latest.label,
        value,
        occurredAt: latest.occurredAt,
        time: "this week",
        url: latest.url,
      });
    } else if (group[0]) {
      // Either one recent item or older items only — show the freshest one.
      out.push(group[0]);
    }
  }

  if (summary) out.push(summary);

  out.sort((a, b) => {
    const at = a.occurredAt ? new Date(a.occurredAt).getTime() : 0;
    const bt = b.occurredAt ? new Date(b.occurredAt).getTime() : 0;
    return bt - at;
  });

  return out.slice(0, 4);
}

/**
 * Issues a single GraphQL query against the GitHub API and merges the
 * following signals into a unified, time-sorted activity feed:
 *  - Releases from the user's own non-fork repos (most recent).
 *  - Pull requests the user opened or got merged (via contributionsCollection).
 *  - Pull request reviews the user submitted.
 *  - Repos the user recently starred.
 *  - A rolling total-stars-earned row that anchors the feed.
 *
 * Logs and rethrows on failure so callers can decide how to recover. Cache
 * lifetimes and dedup are handled by {@link fetchHeroOrbitPayload}.
 *
 * Designed to run server-side; never expose GITHUB_TOKEN to the client.
 *
 * @throws {Error} If GITHUB_TOKEN is missing or the GraphQL request fails.
 */
async function fetchHeroOrbitPayload(username: string): Promise<HeroOrbitData> {
  if (!GITHUB_TOKEN) {
    throw new Error("GitHub token is not defined");
  }

  let response: Response;
  try {
    response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        query: HERO_ORBIT_QUERY,
        variables: { login: username },
      }),
      next: { revalidate: 3600 },
      cache: "force-cache",
    });
  } catch (err) {
    const wrapped = new Error(
      `Network error while contacting GitHub: ${(err as Error).message}`,
    ) as Error & { cause?: unknown };
    wrapped.cause = err;
    throw wrapped;
  }

  if (!response.ok) {
    const err = new Error(
      `GitHub GraphQL returned ${response.status} ${response.statusText}`,
    ) as Error & { status?: number; rateLimited?: boolean };
    err.status = response.status;
    err.rateLimited = response.status === 429 || response.status === 403;
    throw err;
  }

  let json: any;
  try {
    json = await response.json();
  } catch (err) {
    throw new Error(
      `Invalid JSON from GitHub GraphQL: ${(err as Error).message}`,
    );
  }

  if (json?.errors?.length) {
    const first = json.errors[0];
    throw new Error(`GitHub GraphQL error: ${first?.message ?? "unknown"}`);
  }

  if (!json?.data?.user) {
    throw new Error(`GitHub user "${username}" not found or inaccessible`);
  }

  const user = json.data.user;
  const repos: RawRepoNode[] = user.repositories?.nodes ?? [];
  const collection = user.contributionsCollection ?? {};
  const starred: RawStarredRepo[] = user.starredRepositories?.nodes ?? [];

  const ossRepos = repos.filter((r) => r.stargazerCount >= 1).length;
  const totalStars = repos.reduce((acc, r) => acc + r.stargazerCount, 0);

  const bucket: HeroOrbitActivityItem[] = [];
  pushRelease(repos, bucket);
  pushPullRequestActivity(
    collection.pullRequestContributions?.nodes ?? [],
    bucket,
  );
  pushReviewActivity(
    collection.pullRequestReviewContributions?.nodes ?? [],
    bucket,
  );
  pushStarredActivity(starred, bucket);

  bucket.push({
    kind: "stars:bs",
    label: "Stars",
    value: `${totalStars}+ earned`,
    occurredAt: null,
    time: "ongoing",
  });

  return {
    stats: {
      projects: 0,
      ossRepos,
      totalStars,
    },
    activity: aggregateActivity(bucket),
  };
}

const EMPTY_HERO_ORBIT: HeroOrbitData = {
  stats: { projects: 0, ossRepos: 0, totalStars: 0 },
  activity: [],
};

/**
 * Structured log entry for hero-orbit failures. Always printed so server
 * operators can spot rate-limit / auth / network errors in the logs even
 * when the page degrades gracefully to the fallback state.
 */
function logHeroOrbitFailure(
  stage: "fetch" | "cache" | "rate-limit",
  err: unknown,
  context: Record<string, unknown> = {},
) {
  const message = err instanceof Error ? err.message : String(err);
  const payload = {
    tag: "hero-orbit",
    stage,
    message,
    ...context,
  };
  if (stage === "rate-limit") {
    console.warn("[hero-orbit] rate-limited by GitHub:", payload);
  } else {
    console.error("[hero-orbit] failure:", payload);
  }
}

// Cross-request cache for SUCCESSFUL payloads only. We deliberately do NOT
// catch errors inside this wrapper — when the inner function throws,
// `unstable_cache` does not store the result, so the next call retries.
// This means a single transient failure never poisons the cache for an
// hour; only successful payloads get warm-cached.
const cachedHeroOrbitFetch = unstable_cache(
  async (username: string): Promise<HeroOrbitData> => {
    return await fetchHeroOrbitPayload(username);
  },
  ["hero-orbit-data"],
  { revalidate: 3600, tags: ["hero-orbit"] },
);

/**
 * Fetches a compact payload for the hero orbit panel.
 *
 * Caching strategy:
 *  - {@link unstable_cache} stores **successful** responses only (the inner
 *    fetch throws on every failure mode, so failures are never cached).
 *  - React `cache` dedupes calls within a single render.
 *
 * Behaviour on failure:
 *  - Logs the error with stage context (`fetch` / `cache` / `rate-limit`).
 *  - Returns `null`; the caller is expected to substitute its own
 *    fallback payload. The next render will retry.
 *
 * @param username - GitHub login to fetch the data for.
 * @returns A promise resolving to the payload, or `null` on failure.
 */
export const getHeroOrbitData = cache(
  async (username: string): Promise<HeroOrbitData | null> => {
    try {
      return await cachedHeroOrbitFetch(username);
    } catch (err) {
      // Distinguish rate-limit from generic failures so logs are greppable.
      const status = (err as { status?: number })?.status;
      const stage: "fetch" | "cache" | "rate-limit" =
        status === 429 || status === 403 ? "rate-limit" : "fetch";
      logHeroOrbitFailure(stage, err, {
        username,
        status,
        willRetryNextRender: true,
      });
      return null;
    }
  },
);

/**
 * Like {@link getHeroOrbitData} but always returns a non-null payload,
 * substituting {@link EMPTY_HERO_ORBIT} when the upstream call failed.
 * Convenient for callers that don't want to branch on `null`.
 */
export const getHeroOrbitDataSafe = cache(
  async (username: string): Promise<HeroOrbitData> => {
    const result = await getHeroOrbitData(username);
    return result ?? EMPTY_HERO_ORBIT;
  },
);

/**
 * Manually invalidate the cross-request hero-orbit cache. Useful after
 * pushing a release or doing something that should reflect immediately.
 * Can be called from a route handler / server action.
 */
export async function revalidateHeroOrbit(): Promise<void> {
  const { revalidateTag } = await import("next/cache");
  revalidateTag("hero-orbit","page");
}
