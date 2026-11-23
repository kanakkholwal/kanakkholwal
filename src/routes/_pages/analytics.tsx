import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader } from "@/components/site/page";
import { StatsEmpty } from "@/components/stats/stats-empty";
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
  // Google Analytics is third-party: keep the site chrome and show a retryable blank instead of the error page.
  errorComponent: AnalyticsError,
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return <AnalyticsClient result={Route.useLoaderData()} />;
}

function AnalyticsError() {
  return (
    <Page>
      <PageHeader title="analytics." description="Live web analytics for this portfolio." />
      <StatsEmpty
        icon="chart"
        retry
        title="Analytics couldn't load"
        description="The analytics provider didn't answer. Try again in a moment."
      />
    </Page>
  );
}
