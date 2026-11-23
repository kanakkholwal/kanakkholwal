import { createFileRoute } from "@tanstack/react-router";
import { getProjectList } from "@/lib/project.source";
import { projectImageResponse } from "../../og/project-image";

export const Route = createFileRoute("/projects/og")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const params = new URL(request.url).searchParams;
        const project = getProjectList().find((p) => p.id === params.get("slug"));
        if (!project) return new Response("Not found", { status: 404 });
        return projectImageResponse(project, params.get("dark") === "true");
      },
    },
  },
});
