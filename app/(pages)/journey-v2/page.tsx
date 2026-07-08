import { Metadata } from "next";
import { generateMetadata } from "~/utils/seo";
import JourneyV2Client from "./client";

export default function JourneyV2Page() {
  return <JourneyV2Client />;
}

export const metadata:Metadata = generateMetadata({
  title: "Journey — Cinematic Cut",
  description:
    "A scroll-driven, cinematic retelling of Kanak’s work journey — each milestone pins while the story and its scenes animate in sync.",
  path: "/journey-v2",
  keywords: [
    "developer journey",
    "scrollytelling",
    "cinematic portfolio",
    "Kanak Kholwal",
  ],
});
