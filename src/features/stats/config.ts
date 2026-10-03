import { appConfig } from "root/project.config";

export const statsConfig = appConfig.statsConfig;

export type ProjectConfig = {
  id: string;
  title: string;
  description: string;
  endpoint: string;
};

// Auth headers are attached server-side in stats.functions.ts; this module ships to the browser.
export const insightConfig: ProjectConfig[] = [
  {
    id: "college-ecosystem",
    title: "College Ecosystem",
    description: "Analytics for College Ecosystem",
    endpoint: "https://nith.eu.org/api/stats?period=last_month",
  },
];
