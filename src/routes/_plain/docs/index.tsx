import { createFileRoute } from "@tanstack/react-router";
import DocsPageClient, { type DocPost } from "~/features/docs/client";
import { getDocsIndex } from "~/server/content";

export const Route = createFileRoute("/_plain/docs/")({
  loader: () => getDocsIndex(),
  staleTime: Number.POSITIVE_INFINITY,
  component: DocsIndexPage,
});

function DocsIndexPage() {
  const docs = Route.useLoaderData();
  const posts: DocPost[] = docs.map((doc) => ({
    url: doc.url,
    data: {
      title: doc.title,
      description: doc.description,
      lastModified: doc.lastModified,
      category: doc.category,
      tags: doc.tags,
    },
  }));
  const latest = posts[0]?.data.lastModified;
  const latestPostDate = latest ? new Date(latest).toLocaleDateString() : "N/A";
  return <DocsPageClient posts={posts} latestPostDate={latestPostDate} />;
}
