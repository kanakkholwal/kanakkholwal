import { createFileRoute } from "@tanstack/react-router";
import AttributionPageClient from "~/features/attribution/client";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/_pages/attribution")({
  head: () =>
    seo({
      title: "Attribution | Credits",
      description: "The people, sites and open source projects this portfolio borrows from.",
      path: "/attribution",
    }),
  component: AttributionPageClient,
});
