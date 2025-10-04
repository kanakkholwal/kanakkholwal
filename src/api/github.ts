import { cache } from "react";

type ContributionActivity = {
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

    const [contribRes, githubRes] = await Promise.all([
      fetch(contributionsUrl),
      fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
        body: JSON.stringify({ query: githubQuery, variables: { login: username } }),
      }),
    ]);

    const contribData = (await contribRes.json()) as ContributionResponse;
    const githubData = await githubRes.json();

    // Map contributions year-wise
    const contributionByYear = contribData.contributions.reduce(
      (mapping, item) => {
        const year = new Date(item.date).getFullYear().toString();
        if (!mapping[year]) mapping[year] = [];
        mapping[year].push(item);
        return mapping;
      },
      {} as Record<string, ContributionActivity[]>
    );

    // Aggregate stars and forks
    const repos = githubData.data.user.repositories.nodes;
    const totalStars = repos.reduce((acc: number, r: any) => acc + r.stargazerCount, 0);
    const totalForks = repos.reduce((acc: number, r: any) => acc + r.forkCount, 0);

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
