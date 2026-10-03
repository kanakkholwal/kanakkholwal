import Link from "@/components/link";
import { Meta } from "@/components/site/page";
import { cn } from "@/lib/cn";
import type { ProjectType } from "@/lib/content";
import { projectPreview, projectTitleTransition } from "./project-list";

/** Two-up cards with the preview in a card rim; hovering one dims the rest, like the list rows. */
export function ProjectGrid({ projects, className }: { projects: ProjectType[]; className?: string }) {
  return (
    <ul className={cn("group/grid grid grid-cols-1 gap-3 sm:grid-cols-2", className)}>
      {projects.map((p) => (
        <li key={p.id} className="flex">
          <Link
            href={`/projects/${p.id}`}
            className={cn(
              "group/card flex w-full flex-col rounded-2xl bg-card p-1 outline-none",
              "transition-[opacity,background-color,scale] duration-(--duration-base) ease-(--ease-out)",
              "pointer-fine:group-hover/grid:opacity-45 pointer-fine:hover:opacity-100!",
              "group-has-focus-visible/grid:opacity-45 focus-visible:opacity-100! focus-visible:ring-2 focus-visible:ring-ring",
              "active:scale-(--press-scale)",
            )}
          >
            <span className="block overflow-hidden rounded-xl bg-background shadow-(--surface-shadow) dark:bg-popover">
              <img
                src={projectPreview(p)}
                alt=""
                loading="lazy"
                decoding="async"
                className="aspect-[1200/630] w-full bg-muted object-cover"
              />
            </span>
            <span className="flex flex-1 flex-col gap-1 px-3 pt-3 pb-3">
              <span className="flex items-baseline justify-between gap-3">
                <span className="flex min-w-0 items-baseline gap-2">
                  <span className="font-medium text-foreground text-pretty" style={projectTitleTransition(p.id)}>
                    {p.title}
                  </span>
                  {p.active ? (
                    <span className="relative top-[-1px] size-1.5 shrink-0 rounded-full bg-success" title="Active" />
                  ) : null}
                </span>
                <Meta className="shrink-0">{p.dates}</Meta>
              </span>
              <span className="line-clamp-2 text-muted-foreground text-sm text-pretty">{p.description}</span>
              <span className="mt-auto truncate pt-1 font-mono text-muted-foreground/80 text-xs">
                {p.technologies.slice(0, 4).join(" / ")}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
