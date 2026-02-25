import { source } from "@/lib/source";
import { Card, Cards } from "fumadocs-ui/components/card";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { notFound } from "next/navigation";
import ArticlePageClient, { type ArticleData } from "./handler.article.client";

export default async function ArticlePage(props: { slug: string[] }) {
  const page = source.getPage(props.slug);
  if (!page) notFound();

  const Mdx = page.data.body;

  const wordCount = page.data.body?.toString()?.split(/\s+/g).length || 500;
  const readTime = Math.ceil(wordCount / 200);

  const otherArticleSlugs = source
    .generateParams()
    .filter((p) => p.slug !== props.slug);

  const otherArticlePages = await Promise.all(
    otherArticleSlugs.map((slug) => source.getPage(slug.slug)),
  ).catch(() => []);

  const article: ArticleData = {
    title: page.data.title,
    description: page.data.description,
    category: page.data.category,
    author: page.data.author,
    tags: page.data.tags,
    lastModified: page.data.lastModified
      ? new Date(page.data.lastModified).toISOString()
      : null,
    readTime,
  };

  const toc = <InlineTOC items={page.data.toc} />;

  const otherArticles = (
    <Cards>
      {otherArticlePages.map((p) => (
        <Card
          key={p?.slugs.join("/")}
          title={p?.data.title}
          href={`/docs/${p?.slugs.join("/")}`}
        >
          {p?.data.description}
        </Card>
      ))}
    </Cards>
  );

  return (
    <ArticlePageClient
      article={article}
      toc={toc}
      otherArticles={otherArticles}
    >
      <Mdx components={defaultMdxComponents} />
    </ArticlePageClient>
  );
}
