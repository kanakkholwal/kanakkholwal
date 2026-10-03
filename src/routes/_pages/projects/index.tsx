import { createFileRoute } from "@tanstack/react-router";
import ProjectsShowcase from "~/features/projects/client";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/_pages/projects/")({
  head: () =>
    seo({
      title: "Projects Showcase",
      description:
        "Explore Kanak's most impactful and innovative projects: full-stack apps, AI integrations, and cloud-native solutions built with Next.js, AWS, Docker, and GCP.",
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
    }),
  component: ProjectsShowcase,
});
