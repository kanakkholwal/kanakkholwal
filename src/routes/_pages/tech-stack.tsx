import { createFileRoute } from "@tanstack/react-router";
import TechStackPage from "~/features/tech-stack";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/_pages/tech-stack")({
  head: () =>
    seo({
      title: "Tech Stack",
      description: "The languages, frameworks and tools Kanak Kholwal uses most.",
      path: "/tech-stack",
    }),
  component: TechStackPage,
});
