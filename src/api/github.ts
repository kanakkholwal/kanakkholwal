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

export const getProfile = cache(async (username: string): Promise<GithubStats> => {
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

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query: githubQuery,
      variables: { login: username },
    }),
    next: { revalidate: 3600 }, // Optional: Revalidate every hour
  });

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub data");
  }

  const json = await response.json();

  // Check for GraphQL errors (e.g., user not found)
  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  const userData = json.data.user;

  // 3. Process Stats
  const repos = userData.repositories.nodes;
  const stats: GithubStats = {
    followers: userData.followers.totalCount,
    stars: repos.reduce((acc: number, r: any) => acc + r.stargazerCount, 0),
    forks: repos.reduce((acc: number, r: any) => acc + r.forkCount, 0),
    repos: userData.repositories.totalCount,
  };

  return stats;
})


// Helper to map GitHub's distinct levels to your 0-4 number format
const getLevel = (level: string): number => {
  switch (level) {
    case "FIRST_QUARTILE": return 1;
    case "SECOND_QUARTILE": return 2;
    case "THIRD_QUARTILE": return 3;
    case "FOURTH_QUARTILE": return 4;
    default: return 0;
  }
};

export const getContributions = cache(
  async (username: string): Promise<Contributions> => {
    // 2. Unified GraphQL Query
    // We fetch user stats AND contribution calendar in one go
    const query = `
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
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  contributionLevel
                }
              }
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
      next: { revalidate: 3600 }, // Optional: Revalidate every hour
    });

    if (!response.ok) {
      throw new Error("Failed to fetch GitHub data");
    }

    const json = await response.json();

    // Check for GraphQL errors (e.g., user not found)
    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    const userData = json.data.user;

    // 3. Process Stats
    const repos = userData.repositories.nodes;
    const stats: GithubStats = {
      followers: userData.followers.totalCount,
      stars: repos.reduce((acc: number, r: any) => acc + r.stargazerCount, 0),
      forks: repos.reduce((acc: number, r: any) => acc + r.forkCount, 0),
      repos: userData.repositories.totalCount,
    };

    // 4. Process Contributions
    // GitHub returns weeks -> days. We need to flatten this.
    const calendar = userData.contributionsCollection.contributionCalendar;
    const allDays: ContributionActivity[] = [];

    calendar.weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        allDays.push({
          date: day.date,
          count: day.contributionCount,
          level: getLevel(day.contributionLevel),
        });
      });
    });

    // 5. Group by Year (same structure as your previous function)
    const contributionsByYear: Record<string, ContributionActivity[]> = {};
    const totalByYear: Record<string, number> = {};

    allDays.forEach((day) => {
      const year = new Date(day.date).getFullYear().toString();

      if (!contributionsByYear[year]) {
        contributionsByYear[year] = [];
        totalByYear[year] = 0;
      }

      contributionsByYear[year].push(day);
      totalByYear[year] += day.count;
    });

    return {
      contributions: contributionsByYear,
      total: totalByYear,
      stats,
    };
  }
);
export type WeeklyContribution = {
  weekStart: string; // ISO string date of the Sunday for that week
  count: number;
  averageLevel: number; // Useful for coloring the graph
};

export const getWeeklyContributions = cache((dailyContributions: ContributionActivity[]): WeeklyContribution[] => {
  const weeklyMap = new Map<string, WeeklyContribution>();

  // Sort daily contributions by date first to ensure order
  const sorted = [...dailyContributions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
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
})

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
    if (!contribRes.value.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Invalid contributions response format");
    }
    if (!githubRes.value.headers.get("content-type")?.includes("application/json")) {
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