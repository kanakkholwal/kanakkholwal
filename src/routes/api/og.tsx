import { getProjectList } from "@/lib/project.source";
import { createFileRoute } from "@tanstack/react-router";
import { generateOgImage } from "~/og/generator";
import { ProjectOgTemplate } from "~/og/og-templates";

export const Route = createFileRoute("/api/og")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const params = new URL(request.url).searchParams;
        if (params.get("gen_type") !== "project") return new Response("Not found", { status: 404 });

        const project = getProjectList().find((p) => p.id === params.get("slug"));
        if (!project) return new Response("Not found", { status: 404 });

        return generateOgImage(
          <ProjectOgTemplate
            title={project.title}
            description={project.href}
            dates={project.dates}
            status={project.status}
            isDark={params.get("dark") === "true"}
            metrics={project.metrics}
          />,
        );
      },
    },
  },
});
