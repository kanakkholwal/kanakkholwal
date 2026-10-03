import { createFileRoute } from "@tanstack/react-router";
import JourneyV2Client from "~/features/journey-v2/client";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/_pages/journey-v2")({
  head: () =>
    seo({
      title: "The Journey",
      description:
        "Kanak's work journey, told three ways: a cinematic scroll, a terminal log, or a keynote. Switch between them.",
      path: "/journey-v2",
      keywords: ["developer journey", "scrollytelling", "cinematic portfolio", "Kanak Kholwal"],
    }),
  component: JourneyV2Client,
});
