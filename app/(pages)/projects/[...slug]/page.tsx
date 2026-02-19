import { getPageImage, source } from "@/lib/project.source";
import { notFound } from "next/navigation";

import { Metadata } from "next";
import { appConfig } from "root/project.config";
import ProjectPage from "./client";

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  if (!params.slug) notFound();

  if (params.slug.length === 1) {
    return <ProjectPage slug={params.slug} />;
  }
  notFound();
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata | null> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) return notFound();

  return {
    title: `${page.data.title} | Projects`,
    description: page.data.description,
    openGraph: {
      type: "article",
      title: `${page.data.title} | Projects`,
      description: page.data.description,
      images: [
        {
          url: getPageImage(page),
          width: 800,
          height: 600,
          alt: page.data.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.data.title} | Projects`,
      description: page.data.description,
      images: [
        {
          url: getPageImage(page),
          width: 800,
          height: 600,

          alt: `${appConfig.name} - UI/UX & Full Stack Engineer`,
        },
      ],
      creator: `@${appConfig.usernames.twitter}`,
    },
  };
}
