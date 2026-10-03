import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { ProseSkeleton } from "@/components/site/skeletons";
import { projectBody } from "@/lib/content";
import ProjectPageClient from "~/features/projects/detail/client";
import { OG_VERSION } from "~/og/version";
import { getProjectPage } from "~/server/content";
import { seo } from "~/utils/seo";
import { breadcrumbs, projectLd } from "~/utils/structured-data";

export const Route = createFileRoute("/_pages/projects/$slug")({
  loader: async ({ params }) => {
    const data = await getProjectPage({ data: params.slug });
    await projectBody.preload(data.project.path);
    return data;
  },
  staleTime: 60 * 60_000,
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { project } = loaderData;
    const path = `/projects/${project.id}`;
    const image = `/projects/og?slug=${project.id}&v=${OG_VERSION}`;
    const code = project.links?.find((l) => l.url.startsWith("https://github.com/"))?.url;
    return seo({
      title: `${project.title} | Projects`,
      description: project.description,
      path,
      image,
      type: "article",
      keywords: [project.title, ...project.technologies],
      jsonLd: [
        projectLd({ ...project, path, image, code, keywords: project.technologies }),
        breadcrumbs(["Projects", "/projects"], [project.title, path]),
      ],
    });
  },
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
