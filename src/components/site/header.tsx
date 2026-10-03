import { useLocation } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import { type CSSProperties, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/icons";
import Link from "@/components/link";
import { button } from "@/components/ui/button/variants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu/navigation-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip/tooltip";
import { cn } from "@/lib/cn";
import { useCommandMenu } from "./command-menu";
import { isActive, isGroup, NAV, type NavLink, SOCIALS } from "./nav";

const ITEM =
  "relative z-10 h-8 rounded-lg px-2.5 text-sm font-normal text-muted-foreground transition-colors hover:bg-transparent hoverable:text-foreground data-[popup-open]:bg-transparent data-[popup-open]:text-foreground aria-[current=page]:text-foreground aria-[current=page]:bg-transparent data-[active]:bg-transparent";

/** A hover pill that glides between top-level items instead of each item repainting. */
function useHoverPill() {
  const listRef = useRef<HTMLUListElement>(null);
  const [box, setBox] = useState<{ x: number; w: number } | null>(null);

  const onPointerOver = (e: React.PointerEvent) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>("[data-pill-target]");
    if (!item || !listRef.current?.contains(item)) return;
    setBox({ x: item.offsetLeft, w: item.offsetWidth });
  };
  return { listRef, box, onPointerOver, onPointerLeave: () => setBox(null) };
}

export function SiteHeader() {
  const pathname = useLocation({ select: (l) => l.pathname });
  const pill = useHoverPill();
  const [pillVisible, setPillVisible] = useState(false);

  // The pill should slide between items, but appear in place on first hover.
  useLayoutEffect(() => {
    if (!pill.box) setPillVisible(false);
    else requestAnimationFrame(() => setPillVisible(true));
  }, [pill.box]);

  return (
    <header className="fixed inset-x-0 top-0 z-40" style={{ "--vt-name": "site-header" } as CSSProperties}>
      {/* Scroll-edge effect: content blurs out under the bar instead of meeting a hard rule. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-background via-background/80 to-transparent backdrop-blur-[2px] [mask-image:linear-gradient(to_bottom,black_50%,transparent)]"
      />
      <div className="relative mx-auto flex h-16 max-w-page items-center justify-between gap-2 px-5 sm:px-6">
        <a
          href="#main"
          className="sr-only rounded-md bg-background px-3 py-2 text-sm focus:not-sr-only focus:absolute focus:left-4 focus:top-3"
        >
          Skip to content
        </a>

        <NavigationMenu className="-ml-2.5 hidden sm:flex" align="start">
          <NavigationMenuList
            className="relative"
            ref={pill.listRef}
            onPointerOver={pill.onPointerOver}
            onPointerLeave={pill.onPointerLeave}
          >
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute top-0 left-0 h-8 rounded-lg bg-foreground/[0.06] opacity-0",
                "transition-[opacity,translate,width] duration-(--duration-slow) ease-(--ease-out) motion-reduce:transition-none",
                pill.box && "opacity-100",
                !pillVisible && "[transition-property:opacity]",
              )}
              style={pill.box ? { translate: `${pill.box.x}px 0`, width: pill.box.w } : undefined}
            />
            {NAV.map((entry) =>
              isGroup(entry) ? (
                <NavigationMenuItem key={entry.label} data-pill-target>
                  <NavigationMenuTrigger
                    className={ITEM}
                    aria-current={entry.items.some((i) => isActive(pathname, i.href)) ? "page" : undefined}
                  >
                    {entry.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-72 gap-0.5">
                      {entry.items.map((item) => (
                        <li key={item.href}>
                          <MenuLink item={item} active={isActive(pathname, item.href)} />
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={entry.href} data-pill-target>
                  <NavigationMenuLink
                    className={cn(ITEM, "inline-flex items-center justify-center")}
                    aria-current={isActive(pathname, entry.href) ? "page" : undefined}
                    render={<Link href={entry.href} />}
                  >
                    {entry.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ),
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <MobileNav pathname={pathname} />

        <div className="-mr-2 flex items-center gap-0.5">
          <IconAction label="GitHub" href={SOCIALS[0].href} icon="brand-github" />
          <SearchAction />
          <ThemeAction />
        </div>
      </div>
    </header>
  );
}

function MenuLink({ item, active }: { item: NavLink; active: boolean }) {
  return (
    <NavigationMenuLink
      aria-current={active ? "page" : undefined}
      className="flex-row items-start gap-3 p-2.5"
      render={<Link href={item.href} />}
    >
      {item.icon ? (
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md bg-background text-muted-foreground shadow-(--surface-shadow) dark:bg-muted">
          <Icon name={item.icon} className="size-4" />
        </span>
      ) : null}
      <span className="flex min-w-0 flex-col">
        <span className="font-medium text-foreground">{item.label}</span>
        {item.description ? <span className="text-muted-foreground text-xs">{item.description}</span> : null}
      </span>
    </NavigationMenuLink>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <div className="flex items-center gap-1 sm:hidden">
      <Link
        href="/"
        className={cn(ITEM, "-ml-2.5 inline-flex items-center")}
        aria-current={pathname === "/" ? "page" : undefined}
      >
        home
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger className={cn(ITEM, "inline-flex items-center gap-1")}>
          menu
          <Icon
            name="chevron-down"
            className="size-3 transition-transform duration-(--duration-overlay) ease-(--ease-out) in-data-[popup-open]:rotate-180"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60" align="start">
          {NAV.map((entry, i) =>
            isGroup(entry) ? (
              <div key={entry.label}>
                {i > 0 ? <DropdownMenuSeparator /> : null}
                <DropdownMenuLabel>{entry.label}</DropdownMenuLabel>
                {entry.items.map((item) => (
                  <DropdownMenuItem key={item.href} render={<Link href={item.href} />}>
                    {item.icon ? <Icon name={item.icon} className="size-4 text-muted-foreground" /> : null}
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </div>
            ) : entry.href === "/" ? null : (
              <DropdownMenuItem key={entry.href} render={<Link href={entry.href} />} className="capitalize">
                {entry.label}
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const ICON_BUTTON = cn(button({ variant: "ghost", size: "icon-sm" }), "text-foreground");

export function IconAction({ label, href, icon }: { label: string; href: string; icon: "brand-github" }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={ICON_BUTTON} />}
      >
        <Icon name={icon} className="size-4" />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function SearchAction() {
  const { setOpen } = useCommandMenu();
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button type="button" aria-label="Search and jump" className={ICON_BUTTON} onClick={() => setOpen(true)} />
        }
      >
        <Icon name="command" className="size-4" />
      </TooltipTrigger>
      <TooltipContent>
        Search <kbd className="ml-1 font-mono text-muted-foreground">Ctrl K</kbd>
      </TooltipContent>
    </Tooltip>
  );
}

const noop = () => () => {};

export function ThemeAction() {
  const { resolvedTheme, setTheme } = useTheme();
  // The theme is only known on the client; the server renders a same-sized placeholder.
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  if (!mounted) return <span aria-hidden className={ICON_BUTTON} />;
  return (
    <ThemeToggle
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      onThemeChange={setTheme}
      variant="circle"
      start="top-right"
      className={ICON_BUTTON}
      iconClassName="size-4"
    />
  );
}
