import { createFileRoute } from "@tanstack/react-router";
import { appConfig } from "root/project.config";
import AttributionPageClient from "~/features/attribution/client";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/_pages/attribution")({
  head: () =>
    seo({
      title: "Attribution | Credits",
      description:
        "Acknowledging the open-source giants and designers who inspired this portfolio.",
      path: "/attribution",
    }),
  component: AttributionPage,
});

function AttributionPage() {
  return (
    <AttributionPageClient
      journey={appConfig.attribution.journey}
      credits={appConfig.attribution.list}
      displayName={appConfig.displayName}
      email={appConfig.emails[0]}
    />
  );
}
