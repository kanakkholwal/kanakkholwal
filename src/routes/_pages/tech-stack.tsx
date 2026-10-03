import { createFileRoute } from "@tanstack/react-router";
import TechStackPage from "~/features/tech-stack";

export const Route = createFileRoute("/_pages/tech-stack")({
  component: TechStackPage,
});
