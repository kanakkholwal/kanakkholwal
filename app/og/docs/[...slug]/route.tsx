import { getPageImage, source } from "@/lib/source";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { ArticleOgTemplate } from "~/og/og-templates";

export const revalidate = false;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();
  const searchParams = req.nextUrl.searchParams;
  const darkMode = searchParams.get("dark") === "true";
  const wordCount = page.data.body?.toString()?.split(/\s+/g).length || 500;
  const readTime = Math.ceil(wordCount / 200);
  return new ImageResponse(
    <ArticleOgTemplate
      title={page.data.title}
      meta={readTime + " min read"}
      tags={page.data.tags}
      isDark={darkMode}
    />,
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments,
  }));
}
