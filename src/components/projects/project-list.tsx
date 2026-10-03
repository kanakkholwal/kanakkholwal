import { type CSSProperties, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "@/components/link";
import { Meta } from "@/components/site/page";
import { cn } from "@/lib/cn";
import type { ProjectType } from "@/lib/content";

export const projectPreview = (p: Pick<ProjectType, "id" | "image">) => p.image ?? `/projects/og?slug=${p.id}`;

/** Shared with the detail page so the title travels between them as one element. */
export const projectTitleTransition = (id: string) => ({ "--vt-name": `project-${id}` }) as CSSProperties;

/** A card that trails the pointer with a little lag, so it reads as carried rather than glued. */
function useCursorPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const frame = useRef(0);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const tick = () => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const k = reduce ? 1 : 0.18;
    pos.current.x += (target.current.x - pos.current.x) * k;
    pos.current.y += (target.current.y - pos.current.y) * k;
    if (ref.current) ref.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
    const settled =
      Math.abs(target.current.x - pos.current.x) < 0.3 && Math.abs(target.current.y - pos.current.y) < 0.3;
    frame.current = settled ? 0 : requestAnimationFrame(tick);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    target.current = { x: e.clientX + 20, y: e.clientY - 70 };
    if (!active) pos.current = { ...target.current };
    if (!frame.current) frame.current = requestAnimationFrame(tick);
  };

  return { ref, active, setActive, onPointerMove };
}

export function ProjectList({ projects, className }: { projects: ProjectType[]; className?: string }) {
  const preview = useCursorPreview();
  const current = projects.find((p) => p.id === preview.active);

  return (
    <div className={cn("relative", className)} onPointerMove={preview.onPointerMove}>
      <ul className="group/list -mx-3 flex flex-col" onPointerLeave={() => preview.setActive(null)}>
        {projects.map((p) => (
          <li key={p.id}>
            <Link
              href={`/projects/${p.id}`}
              onPointerEnter={(e) => e.pointerType === "mouse" && preview.setActive(p.id)}
              onFocus={() => preview.setActive(null)}
              className={cn(
                "group/row flex flex-col gap-1 rounded-xl px-3 py-3 outline-none",
                "transition-[opacity,background-color,scale] duration-(--duration-base) ease-(--ease-out)",
                "pointer-fine:group-hover/list:opacity-45 pointer-fine:hover:opacity-100! hover:bg-foreground/[0.03]",
                "group-has-focus-visible/list:opacity-45 focus-visible:opacity-100! focus-visible:ring-2 focus-visible:ring-ring",
                "active:scale-(--press-scale-row)",
              )}
            >
              <span className="flex items-baseline justify-between gap-4">
                <span className="flex min-w-0 items-baseline gap-2">
                  <span className="truncate font-medium text-foreground" style={projectTitleTransition(p.id)}>
                    {p.title}
                  </span>
                  {p.active ? (
                    <span className="relative top-[-1px] size-1.5 shrink-0 rounded-full bg-success" title="Active" />
                  ) : null}
                </span>
                <Meta className="shrink-0">{p.dates}</Meta>
              </span>
              <span className="line-clamp-2 text-muted-foreground text-sm text-pretty">{p.description}</span>
              <span className="mt-0.5 truncate font-mono text-muted-foreground/80 text-xs">
                {p.technologies.slice(0, 5).join(" / ")}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <PreviewPortal>
        <div
          ref={preview.ref}
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 z-30 hidden pointer-fine:block"
        >
          <div
            className={cn(
              "w-72 origin-top-left overflow-hidden rounded-xl bg-card p-1 shadow-(--overlay-shadow)",
              "transition-[opacity,scale,filter] duration-(--duration-base) ease-(--ease-out)",
              current ? "scale-100 opacity-100 blur-0" : "scale-[0.92] opacity-0 blur-[2px] duration-(--duration-exit)",
            )}
          >
            {projects.map((p) => (
              <img
                key={p.id}
                src={projectPreview(p)}
                alt=""
                loading="lazy"
                decoding="async"
                className={cn(
                  "aspect-[1200/630] w-full rounded-lg bg-muted object-cover",
                  p.id === preview.active ? "block" : "hidden",
                )}
              />
            ))}
          </div>
        </div>
      </PreviewPortal>
    </div>
  );
}

const noop = () => () => {};

// Entrance transforms on ancestors would trap a fixed element, so the preview lives on body.
function PreviewPortal({ children }: { children: React.ReactNode }) {
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  return mounted ? createPortal(children, document.body) : null;
}
