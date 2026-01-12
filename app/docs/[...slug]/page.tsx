import { source } from "@/lib/source";
import { notFound } from "next/navigation";

// --- COMPONENTS ---
import ArticlePage from "./handler.article";
import CategoryPage from "./handler.category";

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params;
  if (!params.slug) notFound();

  if (params.slug.length >= 2) {
    return <ArticlePage slug={params.slug} />
  }
  if (params.slug.length === 1) {
    return <CategoryPage category={params.slug[0]} />
  }
  notFound();
}

export async function generateStaticParams() {


  return source.generateParams()
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) return;
  return {
    title: `${page.data.title} | Engineering Blog`,
    description: page.data.description,
  };
}