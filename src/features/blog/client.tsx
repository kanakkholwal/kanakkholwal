import type { CSSProperties } from "react";
import { ArrowLink, TextLink } from "@/components/site/link";
import { PageHeader } from "@/components/site/page";
import { formatDate, PostList } from "@/components/writing/post-list";

/** Serializable post: `pubDate` is an ISO string, not a Date. */
export type SerializablePost = {
  title: string;
  link: string;
  pubDate: string;
  snippet: string;
  thumbnail: string | null;
  tags: string[];
  readingTime: string;
};

// Medium's feed snippet is stripped HTML: image credits, "Continue reading" and run-together headings.
function summary(snippet: string, max = 140) {
  const text = snippet
    .replace(/&#x2026;|&hellip;/g, "…")
    .replace(/Continue reading on Medium\s*»?/gi, "")
    .replace(/^Photo by .+? on Unsplash/i, "")
    .replace(/^Introduction(?=[A-Z])/, "")
    .replace(/(\.{3}|…)\s*$/, "")
    .trim();
  if (text.length <= max) return text || undefined;
  return `${text.slice(0, text.lastIndexOf(" ", max)).replace(/[\s.,;:]+$/, "")}…`;
}

export default function BlogPosts({ posts, mediumUrl }: { posts: SerializablePost[]; mediumUrl: string }) {
  return (
    <>
      <PageHeader
        title="blog."
        description="Longer tutorials and opinion pieces I publish on Medium. The feed below syncs from there."
      >
        <ArrowLink href={mediumUrl} className="self-start text-sm">
          Follow on Medium
        </ArrowLink>
      </PageHeader>
      <div className="rise" style={{ "--i": 1 } as CSSProperties}>
        {posts.length ? (
          <PostList
            posts={posts.map((p) => ({
              url: p.link,
              title: p.title,
              description: summary(p.snippet),
              meta: `${formatDate(p.pubDate)} · ${p.readingTime}`,
            }))}
          />
        ) : (
          <p className="text-muted-foreground text-sm">
            The Medium feed did not load this time. The posts are all still on{" "}
            <TextLink href={mediumUrl}>Medium</TextLink>.
          </p>
        )}
      </div>
    </>
  );
}
