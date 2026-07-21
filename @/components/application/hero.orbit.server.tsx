import { cache } from "react";
import { differenceInDays, differenceInMonths, differenceInYears, parseISO } from "date-fns";
import { appConfig } from "root/project.config";
import { getHeroOrbitData, type HeroOrbitActivityItem } from "~/api/github";
import { getProjectList } from "@/lib/project.source";
import { getWorkExperienceList } from "@/lib/work.source";
import { HeroOrbit } from "./hero.orbit.client";
import type { HeroOrbitPayload } from "./hero.orbit.shared";

const MONTHS_IN_YEAR = 12;

export type { HeroOrbitPayload };

function computeYearsOfExperience(): number {
  const experiences = getWorkExperienceList();
  if (!experiences.length) return 0;

  let earliest: Date | null = null;
  for (const exp of experiences) {
    if (!exp.startDate) continue;
    const parsed = parseDateLike(exp.startDate);
    if (!parsed) continue;
    if (!earliest || parsed.getTime() < earliest.getTime()) {
      earliest = parsed;
    }
  }

  if (!earliest) return 0;

  const now = new Date();
  const totalDays = differenceInDays(now, earliest);
  if (totalDays <= 0) return 0;

  // Use years + (extra months / 12) for fractional accuracy.
  const years = differenceInYears(now, earliest);
  const monthsAfterYears = differenceInMonths(now, earliest) - years * MONTHS_IN_YEAR;
  const fractional = years + monthsAfterYears / MONTHS_IN_YEAR;

  return Math.max(0, Math.floor(fractional));
}

function parseDateLike(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  // YYYY-MM-DD or ISO format
  const iso = /^\d{4}-\d{2}-\d{2}/.test(trimmed) ? trimmed : null;
  if (iso) {
    const d = parseISO(iso);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  // "Mar 2024" → first day of that month.
  const monthYear = /^([A-Za-z]{3,9})\s+(\d{4})$/.exec(trimmed);
  if (monthYear) {
    const d = new Date(`${monthYear[1]} 1, ${monthYear[2]}`);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const fallback = new Date(trimmed);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

const EMPTY_ACTIVITY: HeroOrbitActivityItem[] = [];

export const loadHeroOrbitData = cache(async (): Promise<HeroOrbitPayload> => {
  const [orbitResult, projects, yearsExp] = await Promise.all([
    getHeroOrbitData(appConfig.usernames.github).catch(() => null),
    Promise.resolve(getProjectList().length),
    Promise.resolve(computeYearsOfExperience()),
  ]);

  if (!orbitResult) {
    return {
      stats: { projects, ossRepos: 0, yearsExp },
      activity: EMPTY_ACTIVITY,
      fallback: true,
    };
  }

  return {
    stats: {
      projects,
      ossRepos: orbitResult.stats.ossRepos,
      yearsExp,
    },
    activity: orbitResult.activity,
    fallback: false,
  };
});

export default async function HeroOrbitServer() {
  const data = await loadHeroOrbitData();
  return <HeroOrbit stats={data.stats} activity={data.activity} fallback={data.fallback} />;
}
