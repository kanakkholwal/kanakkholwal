import { getProjectList } from "@/lib/project.source";
import { getPageImage, source } from "@/lib/source";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { ProjectOgTemplate } from "~/og/og-templates";

export const revalidate = false;
const projectsList = getProjectList();

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const gen_type = searchParams.get("gen_type");
  const darkMode = searchParams.get("dark") === "true";

  if (gen_type === "project") {
    const projectId = searchParams.get("slug");
    const project = projectsList.find((p) => p.id === projectId);
    if (!project) notFound();
    return new ImageResponse(
      <ProjectOgTemplate
        title={project.title}
        description={project.href}
        dates={project.dates}
        status={project.status}
        isDark={darkMode}
        metrics={project.metrics}
      />,
      {
        width: 1200,
        height: 630,
      },
    );
  }
  return notFound();
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments,
  }));
}
