import { docBody } from "@/lib/content";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { Suspense } from "react";
import { appConfig } from "root/project.config";
import ArticlePage from "~/features/docs/article/handler.article";
import CategoryPage from "~/features/docs/article/handler.category";
import { getDocPage, getDocsCategory } from "~/server/content";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/_plain/docs/$")({
  loader: async ({ params }) => {
    const slugs = (params._splat ?? "").split("/").filter(Boolean);
    if (slugs.length === 0) throw notFound();
    if (slugs.length === 1) {
      return {
        kind: "category" as const,
        category: slugs[0],
        pages: await getDocsCategory({ data: slugs[0] }),
      };
    }
    const article = await getDocPage({ data: slugs });
    await docBody.preload(article.doc.path);
    return { kind: "article" as const, ...article };
  },
  staleTime: Number.POSITIVE_INFINITY,
  head: ({ loaderData }) => {
    if (loaderData?.kind !== "article") return {};
    const { doc } = loaderData;
    return seo({
      title: `${doc.title} | Engineering Blog`,
      description: doc.description ?? appConfig.description,
      path: doc.url,
      image: `/og/docs/${doc.slugs.join("/")}`,
      type: "article",
    });
  },
  component: DocsSplatPage,
});

function DocsSplatPage() {
  const data = Route.useLoaderData();
  if (data.kind === "category") return <CategoryPage category={data.category} pages={data.pages} />;
  return (
    <Suspense fallback={null}>
      <ArticlePage doc={data.doc} readTime={data.readTime} others={data.others} />
    </Suspense>
  );
}
