import { createFileRoute } from "@tanstack/react-router";
import { appConfig } from "root/project.config";
import { Page } from "@/components/site/page";
import BlogPosts from "~/features/blog/client";
import { getBlogPosts } from "~/server/home";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/_pages/blog")({
  loader: () => getBlogPosts(),
  staleTime: 60 * 60_000,
  head: () =>
    seo({
      title: "Blog",
      description: "Tutorials and longer pieces on software engineering, published on Medium.",
      path: "/blog",
    }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <Page>
      <BlogPosts posts={Route.useLoaderData()} mediumUrl={appConfig.social.medium} />
    </Page>
  );
}
