import { source } from "@/lib/source";
import DocsPageClient, { type DocPost } from "./client";

export default function BlogIndexPage() {
  const posts: DocPost[] = source.getPages().sort((a, b) => {
    return (
      new Date(b.data.lastModified ?? 0).getTime() -
      new Date(a.data.lastModified ?? 0).getTime()
    );
  }).map((post) => ({
      url:"/docs/" + post.slugs.join("/"),
      data:{
        title:post.data.title,
        description:post.data.description,
        lastModified:post.data.lastModified,
        category:post.data.category,
        tags:post.data.tags,
      }
  }))

  const latestPostDate = posts?.[0]?.data?.lastModified
    ? new Date(posts[0].data?.lastModified)?.toLocaleDateString()
    : "N/A";

  return <DocsPageClient posts={posts} latestPostDate={latestPostDate} />;
}
