import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { projectBody } from "@/lib/content";
import ProjectPageClient from "~/features/projects/detail/client";
import { getProjectPage } from "~/server/content";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/_pages/projects/$slug")({
  loader: async ({ params }) => {
    const data = await getProjectPage({ data: params.slug });
    await projectBody.preload(data.project.path);
    return data;
  },
  staleTime: 60 * 60_000,
  head: ({ loaderData }) =>
    loaderData
      ? seo({
          title: `${loaderData.project.title} | Projects`,
          description: loaderData.project.description,
          path: `/projects/${loaderData.project.id}`,
          image: `/api/og?gen_type=project&slug=${loaderData.project.id}`,
          type: "article",
        })
      : {},
  component: ProjectPage,
});

function ProjectPage() {
  const { project, analytics } = Route.useLoaderData();
  return (
    <ProjectPageClient project={project} analytics={analytics}>
      <Suspense fallback={null}>{projectBody.useContent(project.path)}</Suspense>
    </ProjectPageClient>
  );
}
