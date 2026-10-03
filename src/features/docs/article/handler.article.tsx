import { docBody } from "@/lib/content";
import type { DocMeta } from "@/lib/content.types";
import { Card, Cards } from "fumadocs-ui/components/card";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import ArticlePageClient, { type ArticleData } from "./handler.article.view";

export type ArticlePageProps = {
  doc: DocMeta;
  readTime: number;
  others: { title: string; description?: string; url: string }[];
};

export default function ArticlePage({ doc, readTime, others }: ArticlePageProps) {
  const article: ArticleData = {
    title: doc.title,
    description: doc.description,
    category: doc.category,
    author: doc.author,
    tags: doc.tags,
    lastModified: doc.lastModified ? new Date(doc.lastModified).toISOString() : null,
    readTime,
  };

  const otherArticles = (
    <Cards>
      {others.map((p) => (
        <Card key={p.url} title={p.title} href={p.url}>
          {p.description}
        </Card>
      ))}
    </Cards>
  );

  return docBody.useContent(doc.path, {
    children: ({ body, toc }) => (
      <ArticlePageClient
        article={article}
        toc={<InlineTOC items={toc} />}
        otherArticles={otherArticles}
      >
        {body}
      </ArticlePageClient>
    ),
  });
}
