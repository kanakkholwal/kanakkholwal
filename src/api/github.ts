import { cache } from "react"

type ContributionResponse = {
    total: Record<string, number>,
    contributions: Array<{
        date: string
        count: number
        level: number
    }>
}

export const getCachedContributions = cache(async (username: string) => {
    const url = new URL(`/v4/${username}`, 'https://github-contributions-api.jogruber.de');
    const response = await fetch(url);
    const data = (await response.json()) as ContributionResponse;
    const total = data.total[new Date().getFullYear()];
    return { contributions: data.contributions, total };
});