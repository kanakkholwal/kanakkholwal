import { cache } from "react";
import { parseISO } from "date-fns";
import { appConfig } from "root/project.config";
import { getHeroOrbitDataSafe, type HeroOrbitActivityItem } from "~/api/github";
import { getProjectList } from "@/lib/project.source";
import { getWorkExperienceList } from "@/lib/work.source";
import { HeroOrbit } from "./hero.orbit.client";
import type { HeroOrbitPayload } from "./hero.orbit.shared";

const MS_PER_DAY = 86_400_000;
const DAYS_PER_YEAR = 365.25;

export type { HeroOrbitPayload };

function computeYearsOfExperience(): number {
  const experiences = getWorkExperienceList();
  if (!experiences.length) return 0;

  const now = new Date();
  const ranges: Array<{ start: Date; end: Date }> = [];

  for (const exp of experiences) {
    const start = parseDateLike(exp.startDate, false);
    if (!start) continue;
    const endDate = parseDateLike(exp.endDate, true);
    const end = endDate && endDate.getTime() > start.getTime() ? endDate : now;
    ranges.push({ start, end });
  }

  if (!ranges.length) return 0;

  // Merge overlapping/adjacent ranges so gaps (e.g. college years) don't
  // inflate the total. Use a 1-day overlap tolerance for inclusive ranges.
  const sorted = [...ranges].sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  );
  const merged: Array<{ start: Date; end: Date }> = [{ ...sorted[0] }];
  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];
    if (current.start.getTime() <= last.end.getTime() + MS_PER_DAY) {
      if (current.end.getTime() > last.end.getTime()) {
        last.end = current.end;
      }
    } else {
      merged.push({ ...current });
    }
  }

  const totalDays = merged.reduce((acc, r) => {
    const diff = (r.end.getTime() - r.start.getTime()) / MS_PER_DAY;
    return acc + Math.max(0, diff);
  }, 0);

  return Math.max(0, Math.round(totalDays / DAYS_PER_YEAR));
}

function parseDateLike(value: unknown, asEndOfMonth = false): Date | null {
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
  // "Mar 2024" → first day of that month (or last day if asEndOfMonth).
  const monthYear = /^([A-Za-z]{3,9})\s+(\d{4})$/.exec(trimmed);
  if (monthYear) {
    const d = new Date(`${monthYear[1]} 1, ${monthYear[2]}`);
    if (asEndOfMonth) {
      d.setMonth(d.getMonth() + 1);
      d.setDate(0);
    }
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const fallback = new Date(trimmed);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

export const loadHeroOrbitData = cache(async (): Promise<HeroOrbitPayload> => {
  const username = appConfig.usernames.github;
  const [orbitResult, projects, yearsExp] = await Promise.all([
    getHeroOrbitDataSafe(username),
    Promise.resolve(getProjectList().length),
    Promise.resolve(computeYearsOfExperience()),
  ]);

  const fallback = !orbitResult.activity.length && orbitResult.stats.totalStars === 0;
  const mergedActivity = orbitResult.activity.length
    ? orbitResult.activity
    : buildFallbackActivity({ username, projects, yearsExp });

  return {
    stats: {
      projects,
      // GitHub can be down/rate-limited at runtime; fall back to the tracked
      // repo list so the tile never shows a false "0".
      ossRepos: orbitResult.stats.ossRepos || appConfig.statsConfig.repositories.length,
      yearsExp,
    },
    activity: mergedActivity,
    fallback,
  };
});

function buildFallbackActivity({
  username,
  projects,
  yearsExp,
}: {
  username: string;
  projects: number;
  yearsExp: number;
}): HeroOrbitActivityItem[] {
  const profileUrl = `https://github.com/${username}`;
  return [
    {
      kind: "code",
      label: "GitHub",
      value: `@${username}`,
      occurredAt: null,
      time: "profile",
      url: profileUrl,
    },
    {
      kind: "rocket",
      label: "Projects",
      value: `${projects}+ shipped`,
      occurredAt: null,
      time: "ongoing",
      url: "/projects",
    },
    {
      kind: "stars:bs",
      label: "Experience",
      value: `${yearsExp}+ yrs`,
      occurredAt: null,
      time: "ongoing",
    },
  ];
}

export default async function HeroOrbitServer() {
  const data = await loadHeroOrbitData();
  return <HeroOrbit stats={data.stats} activity={data.activity} fallback={data.fallback} />;
}
