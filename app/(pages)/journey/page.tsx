import { Timeline } from "@/components/extended/timeline";
import { journey_data } from "~/data/journey";
import { generateMetadata } from "~/utils/seo";

export default function JourneyPage() {
  return <Timeline data={journey_data} />;
}
export const metadata = generateMetadata({
  title: "My Developer Journey ",
  description:
    "Explore Kanak’s journey as a software engineer — from early coding days to mastering full-stack development with Next.js, AWS, Docker, and AI integration. A story of growth, challenges, and innovation.",
  path: "/journey",
  keywords: [
    "developer journey",
    "software engineer",
    "full-stack development",
    "Next.js",
    "AWS",
    "Docker",
    "AI integration",
    "career growth",
    "tech challenges",
    "innovation",
    "Kanak Kholwal",
  ],
});
