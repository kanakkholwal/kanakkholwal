import Link from "@/components/link";
import { Meta } from "@/components/site/page";
import { cn } from "@/lib/cn";

export type PostRow = { url: string; title: string; description?: string; date?: string | Date; meta?: string };

const DATE = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export const formatDate = (d?: string | Date) => (d ? DATE.format(new Date(d)) : "");

/** Title-and-date rows; siblings dim while one is hovered so the eye lands on it. */
export function PostList({ posts, className }: { posts: PostRow[]; className?: string }) {
  return (
    <ul className={cn("group/list -mx-3 flex flex-col", className)}>
      {posts.map((post) => {
        const external = /^https?:/.test(post.url);
        return (
          <li key={post.url}>
            <Link
              href={post.url}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={cn(
                "flex flex-col gap-0.5 rounded-xl px-3 py-2.5 outline-none sm:flex-row sm:items-baseline sm:gap-4",
                "transition-[opacity,background-color,scale] duration-(--duration-base) ease-(--ease-out)",
                "pointer-fine:group-hover/list:opacity-45 pointer-fine:hover:opacity-100! hover:bg-foreground/[0.03]",
                "group-has-focus-visible/list:opacity-45 focus-visible:opacity-100! focus-visible:ring-2 focus-visible:ring-ring",
                "active:scale-(--press-scale-surface)",
              )}
            >
              <span className="min-w-0 flex-1">
                <span className="font-medium text-foreground">{post.title}</span>
                {post.description ? (
                  <span className="mt-0.5 line-clamp-1 text-muted-foreground text-sm">{post.description}</span>
                ) : null}
              </span>
              <Meta className="shrink-0">{post.meta ?? formatDate(post.date)}</Meta>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
