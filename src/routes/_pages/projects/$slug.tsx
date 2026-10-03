import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { ProseSkeleton } from "@/components/site/skeletons";
import { projectBody } from "@/lib/content";
import ProjectPageClient from "~/features/projects/detail/client";
import { OG_VERSION } from "~/og/version";
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
          image: `/projects/og?slug=${loaderData.project.id}&v=${OG_VERSION}`,
          type: "article",
        })
      : {},
  component: ProjectPage,
});

function ProjectPage() {
  const { project, analytics } = Route.useLoaderData();
  return (
    <ProjectPageClient project={project} analytics={analytics}>
      <Suspense fallback={<ProseSkeleton />}>{projectBody.useContent(project.path)}</Suspense>
    </ProjectPageClient>
  );
}
