import { getProjectList } from "@/lib/project.source";
import { createFileRoute } from "@tanstack/react-router";
import { appConfig } from "root/project.config";
import { generateOgImage } from "~/og/generator";
import { ProjectOgTemplate } from "~/og/og-templates";

export const Route = createFileRoute("/projects/og")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const slug = new URL(request.url).searchParams.get("slug");
        const project = getProjectList().find((p) => p.id === slug);

        if (!project) {
          return generateOgImage(
            <ProjectOgTemplate
              siteName={appConfig.siteUrl}
              title="Project Not Found"
              description="The requested project could not be located."
              status="404"
              metrics={[]}
              dates="N/A"
            />,
          );
        }

        return generateOgImage(
          <ProjectOgTemplate
            siteName={appConfig.siteUrl}
            title={project.title}
            description={`${project.description.slice(0, 100)}...`}
            dates={project.dates || new Date().getFullYear().toString()}
            status={project.status}
            metrics={project.metrics}
          />,
        );
      },
    },
  },
});
