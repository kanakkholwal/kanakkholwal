import "@tanstack/react-start/server-only";
import { statsConfig } from "./../config";

export type VersionDatum = {
  date: string;
} & {
  [key: string]: Record<string, number>;
};

export async function getVersions(isBeta: boolean): Promise<VersionDatum[]> {
  // Fetch data from npm registry for each package
  const packages = statsConfig.npmPackages;

  // Helper to fetch download counts for a package
  async function fetchDownloads(pkg: string) {
    // Get last 30 days of downloads per version
    const res = await fetch(`https://api.npmjs.org/downloads/range/last-month/${pkg}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  }

  // Helper to fetch version publish dates
  async function fetchVersionDates(pkg: string) {
    const res = await fetch(`https://registry.npmjs.org/${pkg}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.time;
  }

  // Fetch all data in parallel
  const downloadsData = await Promise.all(packages.map(fetchDownloads));
  const versionDatesData = await Promise.all(packages.map(fetchVersionDates));

  // Build a map of date -> VersionDatum
  const dateMap: Record<string, VersionDatum> = {};

  packages.forEach((pkg, i) => {
    const downloads = downloadsData[i];
    const versionDates = versionDatesData[i];
    if (!downloads || !versionDates) return;
    // For each version, get its publish date and downloads
    downloads.downloads.forEach((entry: any) => {
      const version = entry.version;
      const date = versionDates[version]?.slice(0, 10) || entry.day;
      // Filter by beta/snapshot
      if (typeof version !== "string") return;

      if (isBeta) {
        if (!(version.includes("beta") || version.includes("snapshot"))) return;
      } else {
        if (version.includes("beta") || version.includes("snapshot")) return;
      }

      if (!dateMap[date]) {
        dateMap[date] = { date };
        packages.forEach((p) => {
          dateMap[date][p] = {};
        });
      }
      dateMap[date][pkg][version] = Math.round(entry.downloads / 7); // Normalize to daily
    });
  });

  return Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
}

export function sumVersions(versions: VersionDatum[]) {
  return versions.map((v) => {
    const merged: Record<string, number> = {};

    Object.entries(v).forEach(([key, downloads]) => {
      if (key === "date") return;
      Object.entries(downloads).forEach(([version, count]) => {
        merged[version] = (merged[version] ?? 0) + count;
      });
    });

    const sorted = Object.fromEntries(Object.entries(merged).sort(([, a], [, b]) => b - a));

    return { date: v.date, both: sorted };
  });
}
