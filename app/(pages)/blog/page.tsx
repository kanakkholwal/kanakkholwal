import { appConfig } from "root/project.config";
import { getMediumPosts } from "~/api/medium";
import { generateMetadata } from "~/utils/seo";
import AnimatedMediumPosts, { type SerializablePost } from "./client";

export const metadata = generateMetadata({
  title: "Blog ",
  description:
    "Technical deep dives, tutorials, and thoughts on software engineering.",
  path: "/blog",
});

export default async function MediumPage() {
  const rawPosts = await getMediumPosts();
  const now = Date.now();

  const posts: SerializablePost[] = rawPosts.map((p) => ({
    ...p,
    pubDate: p.pubDate.toISOString(),
  }));

  return (
    <AnimatedMediumPosts
      posts={posts}
      now={now}
      mediumUrl={appConfig.social.medium}
    />
  );
}
