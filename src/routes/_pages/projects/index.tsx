import { createFileRoute } from "@tanstack/react-router";
import ProjectsShowcase from "~/features/projects/client";
import { seo } from "~/utils/seo";
import { breadcrumbs } from "~/utils/structured-data";

export const Route = createFileRoute("/_pages/projects/")({
  head: () =>
    seo({
      title: "Projects",
      description:
        "Things I've built and still run: Baby UI, Recast, GlyphTeX, Docvia, Orbit and more, each with the problem, what worked and the stack.",
      path: "/projects",
      jsonLd: [breadcrumbs(["Projects", "/projects"])],
      keywords: ["Kanak Kholwal projects", "Baby UI", "Recast", "GlyphTeX", "Docvia", "Orbit", "open source"],
    }),
  component: ProjectsShowcase,
});
