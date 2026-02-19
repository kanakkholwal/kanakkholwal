import { cache } from "react";

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
