import { getSiteSnapshot } from "~/lib/analytics/service";
import { generateMetadata as buildMetadata } from "~/utils/seo";
import AnalyticsClient from "./client";

export const revalidate = 3600;

export default async function AnalyticsPage() {
  const snapshot = await getSiteSnapshot();
  return <AnalyticsClient snapshot={snapshot} />;
}

export const metadata = buildMetadata({
  title: "Analytics",
  description:
    "Live web analytics for this portfolio — real visitors, sessions, top pages, and traffic sources over the last 30 days.",
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
