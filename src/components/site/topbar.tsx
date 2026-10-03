import { useLocation } from "@tanstack/react-router";
import { type CSSProperties, useSyncExternalStore } from "react";
import { Icon } from "@/components/icons";
import Link from "@/components/link";
import { TextTransition } from "@/components/text/text-transition";
import { shortcutCap } from "@/components/ui/shortcut/variants";
import { cn } from "@/lib/cn";
import { useCommandMenu } from "./command-menu";
import { IconAction, ThemeAction } from "./header";
import { SOCIALS } from "./nav";

const noop = () => () => {};
const isApple = () => /Mac|iPhone|iPad/.test(navigator.platform);

/** Desktop bar over the content pane: where you are on the left, tools on the right. */
export function TopBar() {
  const pathname = useLocation({ select: (l) => l.pathname });
  const segments = pathname.split("/").filter(Boolean);

  return (
    <div
      className="sticky top-0 z-30 hidden h-16 items-center justify-between gap-4 border-border border-b border-dashed bg-background/85 px-10 backdrop-blur-md lg:flex"
      style={{ "--vt-name": "site-topbar" } as CSSProperties}
    >
      <nav aria-label="Breadcrumb" className="min-w-0 font-mono text-muted-foreground text-xs">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="transition-colors hoverable:text-foreground">
              ~
            </Link>
          </li>
          {segments.map((seg, i) => {
            const href = `/${segments.slice(0, i + 1).join("/")}`;
            const last = i === segments.length - 1;
            return (
              <li key={href} className="flex min-w-0 items-center gap-1.5">
                <span aria-hidden>/</span>
                {last ? (
                  <span aria-current="page" className="truncate text-foreground">
                    <TextTransition text={decodeURIComponent(seg)} />
                  </span>
                ) : (
                  <Link href={href} className="truncate transition-colors hoverable:text-foreground">
                    {decodeURIComponent(seg)}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="flex items-center gap-1">
        <SearchButton />
        <span aria-hidden className="mx-2 h-4 w-px bg-border" />
        <IconAction label="GitHub" href={SOCIALS[0].href} icon="brand-github" />
        <ThemeAction />
      </div>
    </div>
  );
}

function SearchButton() {
  const { setOpen } = useCommandMenu();
  const mod = useSyncExternalStore(
    noop,
    () => (isApple() ? "⌘" : "Ctrl"),
    () => "Ctrl",
  );
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="group flex h-8 items-center gap-2 rounded-lg px-2 text-muted-foreground text-sm transition-[color,background-color,scale] duration-(--duration-fast) hoverable:bg-foreground/[0.06] hoverable:text-foreground active:scale-(--press-scale-sm)"
    >
      <Icon name="search" className="size-4" />
      <span>Search</span>
      <span className="flex items-center gap-1" aria-hidden>
        <kbd className={cn(shortcutCap({ size: "md" }))} suppressHydrationWarning>
          {mod}
        </kbd>
        <kbd className={cn(shortcutCap({ size: "md" }))}>K</kbd>
      </span>
    </button>
  );
}
