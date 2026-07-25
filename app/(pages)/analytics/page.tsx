import { headers } from "next/headers";
import { appConfig } from "root/project.config";
import { getSiteResult } from "~/lib/analytics/service";
import { generateMetadata as buildMetadata } from "~/utils/seo";
import AnalyticsClient from "./client";

export const revalidate = 3600;

export default async function AnalyticsPage() {
  const host = (await headers()).get("host")?.replace(/^www\./, "") || appConfig.siteUrl;
  const result = await getSiteResult(host);
  return <AnalyticsClient result={result} />;
}

export const metadata = buildMetadata({
  title: "Analytics",
  description:
    "Live web analytics for this portfolio: real visitors, sessions, top pages, and traffic sources across the last 7, 30, or 90 days.",
  path: "/analytics",
  keywords: [
    "web analytics",
    "google analytics",
    "portfolio traffic",
    "visitors",
    "audience",
    "data visualization",
  ],
});
