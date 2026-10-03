import { createFileRoute } from "@tanstack/react-router";
import AnalyticsClient from "~/features/analytics/client";
import AnalyticsLoading from "~/features/analytics/loading";
import { getSiteAnalytics } from "~/server/home";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/_pages/analytics")({
  loader: () => getSiteAnalytics(),
  staleTime: 60 * 60_000,
  head: () =>
    seo({
      title: "Analytics",
      description:
        "Live web analytics for this portfolio: real visitors, sessions, top pages, and traffic sources from the last 24 hours to the last 90 days.",
      path: "/analytics",
      keywords: [
        "web analytics",
        "google analytics",
        "portfolio traffic",
        "visitors",
        "audience",
        "data visualization",
      ],
    }),
  pendingComponent: AnalyticsLoading,
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return <AnalyticsClient result={Route.useLoaderData()} />;
}
