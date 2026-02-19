import { appConfig } from "root/project.config";
import { ProjectConfig } from "./_components/insight";

export const statsConfig = appConfig.statsConfig;

export const insightConfig: ProjectConfig[] = [
  {
    id: "college-ecosystem",
    title: "College Ecosystem",
    description: "Analytics for College Ecosystem",
    endpoint: "https://app.nith.eu.org/api/stats?period=last_month",
    headers: {
      "X-Authorization": process.env.PROJECTS_CE_TOKEN || "",
    },
  },
];
