import { createFileRoute } from "@tanstack/react-router";
import { appConfig } from "root/project.config";
import AnimatedMediumPosts from "~/features/blog/client";
import { getBlogPosts } from "~/server/home";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/_pages/blog")({
  loader: async () => ({ posts: await getBlogPosts(), now: Date.now() }),
  staleTime: 60 * 60_000,
  head: () =>
    seo({
      title: "Blog",
      description: "Technical deep dives, tutorials, and thoughts on software engineering.",
      path: "/blog",
    }),
  component: BlogPage,
});

function BlogPage() {
  const { posts, now } = Route.useLoaderData();
  return <AnimatedMediumPosts posts={posts} now={now} mediumUrl={appConfig.social.medium} />;
}
