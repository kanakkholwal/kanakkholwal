import type { CSSProperties } from "react";
import Link from "@/components/link";
import { PageHeader } from "@/components/site/page";
import { toggleGroup } from "@/components/ui/toggle-group/variants";
import { BackLink } from "@/components/writing/back-link";
import { formatDate, PostList } from "@/components/writing/post-list";
import type { WritingPost } from "./server";

const CATEGORY_NOTES: Record<string, string> = {
  systems: "CI/CD, deploys, infrastructure and the tooling around them.",
  ai: "Notes from building products on top of language models.",
  architecture: "Design decisions, the trade-offs behind them and the diagrams that explain them.",
  performance: "Benchmarks, latency and what it took to make things faster.",
};

export const categoryNote = (category: string) => CATEGORY_NOTES[category] ?? `Everything filed under ${category}.`;

export const writingMeta = (post: Pick<WritingPost, "date" | "readTime">) =>
  [post.date ? formatDate(post.date) : null, `${post.readTime} min read`].filter(Boolean).join(" · ");

export const writingRows = (posts: WritingPost[]) =>
  posts.map((p) => ({ url: p.url, title: p.title, description: p.description, meta: writingMeta(p) }));

function CategoryNav({ posts }: { posts: WritingPost[] }) {
  const counts = new Map<string, number>();
  for (const p of posts) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  const styles = toggleGroup({ variant: "outline", size: "md" });
  const items = [{ href: "/docs", label: "all", count: posts.length, current: true }].concat(
    [...counts].map(([c, count]) => ({ href: `/docs/${c}`, label: c, count, current: false })),
  );

  return (
    <nav aria-label="Categories" className={styles.root()}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.current ? "page" : undefined}
          data-pressed={item.current ? "" : undefined}
          className={styles.item()}
        >
          {item.label}
          <span className="font-mono text-muted-foreground tabular-nums">{item.count}</span>
        </Link>
      ))}
    </nav>
  );
}

/** `/docs` and `/docs/<category>`: one list, optionally narrowed to a category. */
export default function WritingIndex({ posts, category }: { posts: WritingPost[]; category?: string }) {
  const shown = category ? posts.filter((p) => p.category === category) : posts;

  return (
    <>
      {category ? (
        <BackLink href="/docs" className="rise mb-8">
          All writing
        </BackLink>
      ) : null}
      <PageHeader
        title={category ? `${category}.` : "writing."}
        description={
          category
            ? categoryNote(category)
            : "Write-ups on things I built or broke: what went wrong, what I tried and what stuck."
        }
      />
      <div className="flex flex-col gap-6">
        {category ? null : (
          <div className="rise" style={{ "--i": 1 } as CSSProperties}>
            <CategoryNav posts={posts} />
          </div>
        )}
        <div className="rise" style={{ "--i": 2 } as CSSProperties}>
          <PostList posts={writingRows(shown)} />
        </div>
      </div>
    </>
  );
}
