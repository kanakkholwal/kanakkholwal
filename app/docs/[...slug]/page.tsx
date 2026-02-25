import { source } from "@/lib/source";
import { notFound } from "next/navigation";


import { Metadata } from "next";
import { appConfig } from "root/project.config";
import ArticlePage from "./handler.article";
import CategoryPage from "./handler.category";

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  if (!params.slug) notFound();

  if (params.slug.length === 1) {
    return <CategoryPage category={params.slug[0]} />;
  }
  if (params.slug.length >= 2) {
    return <ArticlePage slug={params.slug} />;
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
    title: `${page.data.title} | Engineering Blog`,
    description: page.data.description,
    openGraph: {
      type: "article",
      title: `${page.data.title} | Engineering Blog`,
      description: page.data.description,
      images: [
        {
          url: appConfig.url + `/og/docs/${params.slug?.join("/")}`,
          width: 800,
          height: 600,
          alt: page.data.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.data.title} | Engineering Blog`,
      description: page.data.description,
      images: [
        {
          url: appConfig.url + `/og/docs/${params.slug?.join("/")}`,
          width: 800,
          height: 600,

          alt: `${appConfig.displayName} - UI/UX & Full Stack Engineer`,
        },
      ],
      creator: `@${appConfig.usernames.twitter}`,
    },
  };
}
