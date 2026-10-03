import { useLocation } from "@tanstack/react-router";
import { useLayoutEffect, useRef, useState } from "react";
import { appConfig, resume_link } from "root/project.config";
import { Icon, type IconType } from "@/components/icons";
import Link from "@/components/link";
import { GibberishText } from "@/components/text/gibberish-text";
import { RollText } from "@/components/text/roll-text";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip/tooltip";
import { cn } from "@/lib/cn";
import { useDocsCount, useProjects } from "@/lib/content";
import { IconRoll } from "./icon-roll";
import { isActive, SOCIALS } from "./nav";
import { PixelAvatar } from "./pixel-avatar";

type Item = { label: string; href: string; icon: IconType; count?: number };

const AVATAR = `https://avatars.githubusercontent.com/${appConfig.usernames.github}?s=320`;
const [SITE_NAME, ...SITE_TLD] = appConfig.siteUrl.split(".");

export function Sidebar() {
  const pathname = useLocation({ select: (l) => l.pathname });
  const projects = useProjects().length;
  const docs = useDocsCount();

  const groups: { title: string; items: Item[] }[] = [
    {
      title: "Navigation",
      items: [
        { label: "Home", href: "/", icon: "home" },
        { label: "Projects", href: "/projects", icon: "rocket", count: projects },
        { label: "Writing", href: "/docs", icon: "pen", count: docs },
        { label: "Stats", href: "/stats", icon: "graph-up" },
        { label: "Analytics", href: "/analytics", icon: "chart" },
        { label: "Contact", href: "/contact", icon: "mail" },
      ],
    },
    {
      title: "Extras",
      items: [
        { label: "Journey", href: "/journey", icon: "route" },
        { label: "Bucket list", href: "/bucket-list", icon: "checklist" },
        { label: "Blog", href: "/blog", icon: "notebook" },
        { label: "Links", href: "/links", icon: "link" },
        { label: "Attribution", href: "/attribution", icon: "heart" },
      ],
    },
  ];

  return (
    <div className="flex h-full flex-col overflow-y-auto px-8 pt-10 pb-6 no-scrollbar">
      <Link href="/" aria-label="Home" className="w-fit rounded-full">
        <PixelAvatar src={AVATAR} alt={appConfig.displayName} size={96} />
      </Link>
      <p className="mt-5 text-2xl tracking-tight">
        {SITE_NAME}
        <span className="text-muted-foreground">.{SITE_TLD.join(".")}</span>
      </p>
      <p className="mt-3 text-muted-foreground text-sm leading-6 text-pretty">
        {appConfig.displayName}, product engineer. Interfaces, tooling and the details in between.
      </p>

      {groups.map((group) => (
        <NavGroup key={group.title} title={group.title} items={group.items} pathname={pathname} />
      ))}

      <div className="mt-auto flex items-center justify-between gap-3 border-border border-t border-dashed pt-5">
        <div className="flex items-center gap-1.5">
          {SOCIALS.slice(0, 4).map((s) => (
            <Tooltip key={s.href}>
              <TooltipTrigger
                className="group/roll size-8 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground shadow-(--surface-shadow) transition-[color,scale] duration-(--duration-fast) hoverable:text-foreground active:scale-(--press-scale-icon) dark:bg-card"
                render={<a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} />}
              >
                <IconRoll name={s.icon} className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>{s.handle}</TooltipContent>
            </Tooltip>
          ))}
        </div>
        <a
          href={resume_link}
          target="_blank"
          rel="noopener noreferrer"
          className="group/roll text-muted-foreground text-sm transition-colors hoverable:text-foreground"
        >
          <RollText text="Resume" groupHover size="sm" className="cursor-[inherit]" />
        </a>
      </div>
    </div>
  );
}

/** A list whose active row is marked by one raised pill that slides between rows on navigation. */
function NavGroup({ title, items, pathname }: { title: string; items: Item[]; pathname: string }) {
  const list = useRef<HTMLUListElement>(null);
  const [box, setBox] = useState<{ y: number; h: number } | null>(null);
  const [glide, setGlide] = useState(false);
  const activeIndex = items.findIndex((i) => isActive(pathname, i.href));

  // Leaving the group keeps the last position, so re-entering fades in place instead of sliding from 0.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure only when the active row changes.
  useLayoutEffect(() => {
    // Measure the row, not the link: each li is its own positioning context.
    const el = list.current?.querySelector<HTMLElement>("[aria-current=page]")?.closest("li");
    if (el) setBox({ y: el.offsetTop, h: el.offsetHeight });
  }, [activeIndex]);

  // Placed before it may move, so the first paint never slides in from the top.
  useLayoutEffect(() => {
    if (!box || glide) return;
    const id = requestAnimationFrame(() => setGlide(true));
    return () => cancelAnimationFrame(id);
  }, [box, glide]);

  return (
    <nav aria-label={title} className="mt-6 border-border border-t border-dashed pt-5">
      <p className="mb-2 text-muted-foreground uppercase">
        <GibberishText text={title} className="min-w-0 text-xs tracking-widest" />
      </p>
      <ul ref={list} className="relative -mx-2 flex flex-col">
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 rounded-lg bg-background shadow-(--surface-shadow) dark:bg-card",
            glide &&
              "transition-[translate,height,opacity] duration-(--duration-slow) ease-(--ease-out) motion-reduce:transition-none",
            box && activeIndex >= 0 ? "opacity-100" : "opacity-0",
          )}
          style={box ? { translate: `0 ${box.y}px`, height: box.h } : undefined}
        />
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group/roll flex h-8 items-center gap-3 rounded-lg px-2 text-sm outline-none",
                  "transition-[color,background-color,scale] duration-(--duration-fast) ease-(--ease-out)",
                  "text-muted-foreground hoverable:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:scale-(--press-scale-row)",
                  active ? "font-medium text-foreground" : "hoverable:bg-foreground/[0.03]",
                )}
              >
                <Icon name={item.icon} className={cn("size-4 shrink-0", active && "text-accent-ink")} />
                <RollText
                  text={item.label}
                  groupHover
                  disabled={active}
                  size="sm"
                  className="flex-1 cursor-[inherit] truncate"
                />
                {item.count !== undefined ? (
                  <span className="font-mono text-muted-foreground text-xs tabular-nums">{item.count}</span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
