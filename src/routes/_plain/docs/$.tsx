import { createFileRoute, notFound } from "@tanstack/react-router";
import { Suspense } from "react";
import { appConfig } from "root/project.config";
import { Page } from "@/components/site/page";
import { ProseSkeleton } from "@/components/site/skeletons";
import { docBody } from "@/lib/content";
import ArticlePage from "~/features/docs/article";
import WritingIndex, { categoryNote } from "~/features/docs/client";
import { getWriting } from "~/features/docs/server";
import { OG_VERSION } from "~/og/version";
import { getDocPage } from "~/server/content";
import { seo } from "~/utils/seo";
import { articleLd, breadcrumbs } from "~/utils/structured-data";

export const Route = createFileRoute("/_plain/docs/$")({
  loader: async ({ params }) => {
    const slugs = (params._splat ?? "").split("/").filter(Boolean);
    if (slugs.length === 0) throw notFound();
    if (slugs.length === 1) {
      const posts = await getWriting();
      if (!posts.some((p) => p.category === slugs[0])) throw notFound();
      return { kind: "category" as const, category: slugs[0], posts };
    }
    const [article, posts] = await Promise.all([getDocPage({ data: slugs }), getWriting()]);
    await docBody.preload(article.doc.path);
    return {
      kind: "article" as const,
      doc: article.doc,
      readTime: article.readTime,
      others: posts.filter((p) => p.url !== article.doc.url),
    };
  },
  staleTime: Number.POSITIVE_INFINITY,
  head: ({ loaderData }) => {
    if (loaderData?.kind === "category") {
      return seo({
        title: `${loaderData.category} | Writing`,
        description: categoryNote(loaderData.category),
        path: `/docs/${loaderData.category}`,
        jsonLd: [breadcrumbs(["Writing", "/docs"], [loaderData.category, `/docs/${loaderData.category}`])],
      });
    }
    if (loaderData?.kind !== "article") return {};
    const { doc } = loaderData;
    const image = `/og/docs/${doc.slugs.join("/")}?v=${OG_VERSION}`;
    const category = doc.slugs[0];
    return seo({
      title: doc.title,
      description: doc.description ?? appConfig.description,
      path: doc.url,
      image,
      type: "article",
      jsonLd: [
        articleLd({
          title: doc.title,
          description: doc.description,
          path: doc.url,
          image,
          modified: doc.lastModified ? new Date(doc.lastModified).toISOString() : undefined,
        }),
        breadcrumbs(["Writing", "/docs"], [category, `/docs/${category}`], [doc.title, doc.url]),
      ],
    });
  },
  component: DocsSplatPage,
});

function DocsSplatPage() {
  const data = Route.useLoaderData();
  return (
    <Page>
      {data.kind === "category" ? (
        <WritingIndex posts={data.posts} category={data.category} />
      ) : (
        <Suspense fallback={<ProseSkeleton />}>
          <ArticlePage doc={data.doc} readTime={data.readTime} others={data.others} />
        </Suspense>
      )}
    </Page>
  );
}
