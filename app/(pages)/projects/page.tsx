import { generateMetadata } from "~/utils/seo";
import ProjectsShowcase from "./client";

export default function ProjectsPage() {
  return <ProjectsShowcase />;
}

export const metadata = generateMetadata({
  title: "Projects Showcase",
  description:
    "Explore Kanak's most impactful and innovative projects — full-stack apps, AI integrations, and cloud-native solutions built with Next.js, AWS, Docker, and GCP.",
  path: "/projects",
  keywords: [
    "projects",
    "portfolio",
    "web development",
    "full-stack",
    "Next.js",
    "AWS",
    "Docker",
    "GCP",
    "AI integration",
    "cloud-native",
    "scalable systems",
    "Kanak Kholwal",
  ],
  image: "/projects/opengraph-image",
});
