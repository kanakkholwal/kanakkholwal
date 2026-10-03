import { createFileRoute } from "@tanstack/react-router";
import JourneyPageClient from "~/features/journey/client";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/_pages/journey")({
  head: () =>
    seo({
      title: "Journey",
      description:
        "How Kanak Kholwal got here: KoinX, Textify AI and ViralLens, open source and independent products, now Zoven AI.",
      path: "/journey",
      keywords: ["developer journey", "software engineer", "product engineer", "career", "Kanak Kholwal"],
    }),
  component: JourneyPageClient,
});
