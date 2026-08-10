"use client";

import { Icon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Socials } from "@/components/socials";
import { StyleHint } from "@/components/style-hint";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { TransitionLink } from "@/components/utils/link";
import {
  AnimationMode,
  animationModes,
  NAV_ITEMS,
  StyleModels,
  StylingModel,
} from "@/constants/ui";
import { useIsMobile } from "@/hooks/use-mobile";
import { useOutsideClick } from "@/hooks/use-outside-click";
import useStorage from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, LinkIcon, Menu, Palette, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export type NavbarType = "static" | "dynamic" | "minimal";

/**
 * Marks the nav item matching the current route. In-page anchors (`/#work`)
 * are never "current" — the route alone can't tell us which section is in view.
 */
function useIsCurrent() {
  const pathname = usePathname();

  return function isCurrent(href: string) {
    if (href.startsWith("/#") || href === "/") return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };
}

/** Applied on top of each navbar's own link classes when the route matches. */
const ACTIVE_LINK = "text-foreground font-medium";

/** One spring for every navbar enter/exit, so the three variants agree. */
const NAV_SPRING = { type: "spring", bounce: 0, duration: 0.32 } as const;
/** One duration for the menu/close icon swap. It was 150/200/200ms. */
const ICON_SWAP = { duration: 0.14, ease: [0.23, 1, 0.32, 1] } as const;

/**
 * True only once the visitor has actually switched style.
 *
 * `styling.model` lives in localStorage, so the first render is always the
 * default and the stored value arrives after hydration. That arrival is not an
 * interaction — but it changes the AnimatePresence key, so every page load in a
 * non-default mode played a full navbar exit + enter, with the shared layoutIds
 * dragging the logo and socials across the screen at the same time. Nothing
 * moved because the user did anything.
 */
function useIsUserSwitch(style: string) {
  const settled = useRef<string | null>(null);
  const [userSwitched, setUserSwitched] = useState(false);

  useEffect(() => {
    if (settled.current === null) {
      settled.current = style;
      return;
    }
    if (settled.current !== style) {
      settled.current = style;
      setUserSwitched(true);
    }
  }, [style]);

  return userSwitched;
}

export function Header() {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );
  const animateSwap = useIsUserSwitch(selectedStyle);
  const isMinimal = selectedStyle === "minimal";

  return (
    <header
      // Padding was a spring on paddingTop/Left/Right — layout properties
      // recalculated every frame. A class swap costs one layout, not sixty.
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-40",
        "transition-[padding] duration-300 ease-out",
        isMinimal ? "p-0" : "px-4 pt-6",
      )}
    >
      {/* Every navbar is absolutely positioned inside this box rather than a
          flex child of it. During a swap both are mounted at once (that is what
          lets the shared layoutIds morph), and as flex siblings they shared a
          row — so each got shoved off-centre for the length of the transition,
          which read as the navbar flying in from the right. Stacked, they
          overlay each other and neither can move the other. */}
      <div className="relative w-full">
        {/* popLayout, not wait: `wait` unmounts the outgoing navbar before the
            incoming one exists, which leaves every shared layoutId below
            without a counterpart to travel to. */}
        <AnimatePresence mode="popLayout" initial={false}>
          {isMinimal ? (
            <MinimalNavbar key="minimal" animate={animateSwap} />
          ) : selectedStyle === "dynamic" ? (
            <DynamicIslandNavbar key="dynamic" animate={animateSwap} />
          ) : (
            // Static + Story (and any future mode) share the floating capsule so
            // the style selector is always reachable — Story has no navbar of its
            // own, and without this there's no way to switch back out of it.
            <StaticNavbar key="static" animate={animateSwap} />
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

function DynamicIslandNavbar({ animate = true }: { animate?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"links" | "design">("links");
  const isCurrent = useIsCurrent();

  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref as React.RefObject<HTMLDivElement>, () =>
    setIsOpen(false),
  );

  // Outside-click alone strands keyboard users inside an open menu.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-6 px-4 pointer-events-none"
      initial={animate ? { opacity: 0, y: 24 } : false}
      animate={{ opacity: 1, y: 0 }}
      exit={animate ? { opacity: 0, y: 24 } : undefined}
      transition={NAV_SPRING}
    >
      {/* `layout` alone sizes this. The old version also animated width/height
          to `auto`/`min-content`, which Framer cannot interpolate — the two
          systems fought and the island snapped on open.
          `w-full max-w-sm` then pinned it to a constant 384px in a centred flex
          parent, so `layout` could only ever animate height — an island that
          cannot change width is an accordion. Worse, at md+ the collapsed row
          measures 439px (16 + 134 logo + 16 + 177 socials + 16 + 72 controls +
          8), so the content ran 55px past the cap and flex-shrink squeezed the
          social hit targets from 32px to ~27px while their glyphs stayed 20px.
          Content-sized now, capped against the viewport instead of a guess. */}
      <motion.div
        layout
        transition={NAV_SPRING}
        className={cn(
          "flex w-auto max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-border",
          "bg-background/80 backdrop-blur-xl shadow-lg pointer-events-auto",
        )}
        ref={ref}
      >
        {/* Rendered after the control row in the DOM so Tab moves from the
            toggle into the menu, not past it. `order` puts it back on top. */}
        {/* layout="position" so the row translates during the width morph
            instead of being scaled by the projection, which stretches glyphs. */}
        <motion.div
          layout="position"
          className="flex h-14 items-center justify-between gap-4 px-2 pl-4 order-2"
        >
          {/* shrink-0 throughout: these are icons and a wordmark, and a flex
              deficit was resolving itself by compressing them. */}
          <motion.div layoutId="brand-logo" className="shrink-0">
            <TransitionLink href="/" title="Home Page">
              <Logo size="sm" />
            </TransitionLink>
          </motion.div>
          <motion.div layoutId="socials" className="shrink-0">
            <Socials className="items-center gap-x-1 border-r border-border/50 hidden md:inline-flex [&>a]:shrink-0" />
          </motion.div>
          <div className="flex shrink-0 items-center gap-1">
            <ModeToggle />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="dynamic-island-menu"
              className="grid size-9 place-items-center rounded-full bg-muted/20 text-foreground transition-colors duration-150 ease-out hoverable:bg-muted/60 active:scale-[0.97]"
            >
              <MenuIcon isOpen={isOpen} />
            </button>
          </div>
        </motion.div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              id="dynamic-island-menu"
              // A floor, not a fixed width. Below md the collapsed row is only
              // ~246px (socials hidden), and the menu would otherwise open at
              // that width with the tab pair crushed against each other.
              className="order-1 flex min-w-[min(20rem,calc(100vw-2rem))] flex-col gap-4 px-4 pb-2 pt-4"
            >
              {/* role=tablist so the two panels announce as tabs, not buttons */}
              <div
                role="tablist"
                className="grid grid-cols-2 p-1 bg-muted/40 rounded-xl relative"
              >
                {(["links", "design"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "relative z-10 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors duration-150 ease-out",
                      activeTab === tab
                        ? "text-foreground"
                        : "text-muted-foreground hoverable:text-foreground",
                    )}
                  >
                    {activeTab === tab ? (
                      <motion.span
                        layoutId="dynamic-tab-bg"
                        className="absolute inset-0 rounded-lg border border-border/50 bg-background shadow-sm"
                        // Was bounce 0.2 over 600ms. A tab indicator is a
                        // utility move, not a flick — no overshoot, 220ms.
                        transition={{ type: "spring", bounce: 0, duration: 0.22 }}
                      />
                    ) : null}
                    <span className="relative z-10 flex items-center gap-2">
                      {tab === "links" ? (
                        <LinkIcon size={14} />
                      ) : (
                        <Palette size={14} />
                      )}
                      {tab === "links" ? "Links" : "Design"}
                    </span>
                  </button>
                ))}
              </div>

              <div className="overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  {activeTab === "links" ? (
                    <motion.div
                      key="links-content"
                      initial={{ x: -12, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -12, opacity: 0 }}
                      // ease-out, not easeInOut: easeIn delays the first frames,
                      // which is exactly where the eye is on a panel swap.
                      transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                      className="flex flex-col gap-1"
                    >
                      {NAV_ITEMS.map((item) => (
                        <TransitionLink
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          aria-current={
                            isCurrent(item.href) ? "page" : undefined
                          }
                          className={cn(
                            "group flex items-center justify-between rounded-xl p-3 transition-colors duration-150 ease-out hoverable:bg-muted/50",
                            isCurrent(item.href) && "bg-muted/40",
                          )}
                        >
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                          <ArrowRight className="size-4 -translate-x-2 text-muted-foreground opacity-0 transition-[transform,opacity] duration-150 ease-out group-hover:translate-x-0 group-hover:opacity-100" />
                        </TransitionLink>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="style-selector"
                      initial={{ x: 12, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 12, opacity: 0 }}
                      transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <StyleSelector />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-full h-px bg-border/50" />
              <Socials className="items-center gap-x-1 mx-auto inline-flex md:hidden" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/** Shared by all three navbars so the swap reads identically everywhere. */
function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {isOpen ? (
        <motion.span
          key="close"
          className="block"
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={ICON_SWAP}
        >
          <X className="size-4" />
        </motion.span>
      ) : (
        <motion.span
          key="menu"
          className="block"
          initial={{ rotate: 90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: -90, opacity: 0 }}
          transition={ICON_SWAP}
        >
          <Menu className="size-4" />
        </motion.span>
      )}
    </AnimatePresence>
  );
}
function StaticNavbar({ animate = true }: { animate?: boolean }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const isCurrent = useIsCurrent();

  return (
    <motion.div
      // `initial={false}` = start settled. The navbar is chrome; it should be
      // present when the page is, not fly in after hydration resolves storage.
      initial={animate ? { opacity: 0, y: -16 } : false}
      animate={{ opacity: 1, y: 0 }}
      exit={animate ? { opacity: 0, y: -16 } : undefined}
      transition={NAV_SPRING}
      className="pointer-events-auto absolute inset-x-0 top-0 mx-auto flex w-full max-w-4xl flex-col items-center"
    >
      <div className="flex items-center justify-between w-full gap-3">
        {/* Left capsule — logo + nav */}
        <motion.div
          className="flex items-center gap-1 px-3 py-2 rounded-full border border-border/60 bg-background/70 backdrop-blur-xl shadow-sm shrink-0"
        >
          <TransitionLink
            href="/"
            title="Home Page"
            className="flex items-center mr-2 shrink-0"
          >
            <motion.div layoutId="brand-logo">
              <Logo size="sm" />
            </motion.div>
          </TransitionLink>

          <div className="w-px h-4 bg-border/60 mr-1 hidden md:block" />

          <motion.nav
            layoutId="header-links"
            className="hidden md:flex items-center gap-0.5"
          >
            {NAV_ITEMS.map((item) => (
              <TransitionLink
                key={item.href}
                href={item.href}
                title={item.label}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
                onFocus={() => setHoveredItem(item.href)}
                onBlur={() => setHoveredItem(null)}
                className={cn(
                  "relative rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors duration-150 ease-out hoverable:text-foreground",
                  isCurrent(item.href) && ACTIVE_LINK,
                )}
              >
                {hoveredItem === item.href ? (
                  <motion.span
                    layoutId="static-nav-pill"
                    className="absolute inset-0 rounded-full bg-muted/70"
                    transition={{ type: "spring", bounce: 0, duration: 0.24 }}
                  />
                ) : null}
                <span className="relative z-10">{item.label}</span>
              </TransitionLink>
            ))}
          </motion.nav>
        </motion.div>

        {/* Right capsule — actions */}
        <motion.div
          layoutId="header-actions"
          className="flex items-center gap-1 px-2 py-2 rounded-full border border-border/60 bg-background/70 backdrop-blur-xl shadow-sm"
        >
          <motion.div layoutId="socials">
            <Socials className="hidden sm:inline-flex items-center gap-x-1 border-r border-border/50 pr-2 mr-0.5" />
          </motion.div>
          <ModeToggle />
          <StyleSelectorPopover
            triggerVariant="pill"
            align="end"
            layoutId="static-style-check"
          />
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="static-mobile-menu"
            className="grid size-9 place-items-center rounded-full transition-colors duration-150 ease-out md:hidden hoverable:bg-muted/50 active:scale-[0.97]"
          >
            <MenuIcon isOpen={isMobileMenuOpen} />
          </button>
        </motion.div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={NAV_SPRING}
            id="static-mobile-menu"
            className="md:hidden w-full mt-2 overflow-hidden rounded-3xl border border-border/60 bg-background/90 backdrop-blur-xl shadow-md"
          >
            <nav className="flex flex-col p-2 gap-0.5">
              {NAV_ITEMS.map((item) => (
                <TransitionLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className={cn(
                    // min-h-11 = 44px. These were ~38px.
                    "flex min-h-11 items-center justify-between rounded-2xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-150 ease-out hoverable:bg-muted/50 hoverable:text-foreground",
                    isCurrent(item.href) && ACTIVE_LINK,
                  )}
                >
                  {item.label}
                  <ArrowRight className="size-3.5 opacity-40" />
                </TransitionLink>
              ))}
            </nav>
            <div className="px-4 py-3 border-t border-border/50 flex justify-center">
              <Socials />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MinimalNavbar({ animate = true }: { animate?: boolean }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isCurrent = useIsCurrent();

  return (
    <motion.div
      className="pointer-events-auto absolute inset-x-0 top-0 w-full"
      initial={animate ? { opacity: 0, y: -8 } : false}
      animate={{ opacity: 1, y: 0 }}
      exit={animate ? { opacity: 0, y: -8 } : undefined}
      transition={NAV_SPRING}
    >
      {/* The rule runs full-bleed; the row inside sits on the page measure. The
          bar used to be capped at max-w-3xl, so its bottom border floated. */}
      <motion.div
        className="border-b border-border/50 bg-background/80 px-6 py-3 backdrop-blur-md"
      >
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-6">
          <TransitionLink
            href="/"
            title="Home Page"
            aria-label="Home"
            className="shrink-0"
          >
            <motion.div layoutId="brand-logo">
              <Logo size="sm" pathOnly />
            </motion.div>
          </TransitionLink>

          <motion.nav
            layoutId="header-links"
            className="hidden md:flex items-center gap-5"
          >
            {NAV_ITEMS.map((item) => (
              <TransitionLink
                key={item.href}
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                className={cn(
                  "rounded-md px-1 py-2 text-sm text-muted-foreground transition-colors duration-150 ease-out hoverable:text-foreground",
                  isCurrent(item.href) && ACTIVE_LINK,
                )}
              >
                {item.label}
              </TransitionLink>
            ))}
          </motion.nav>

          <motion.div layoutId="header-actions" className="flex shrink-0 items-center gap-2">
            {/* Socials only once there's real room — on the home page this bar
                sits directly above the hero's social grid, so below xl they're
                pure duplication competing with the nav for space. */}
            <motion.div layoutId="socials">
              <Socials className="hidden xl:inline-flex items-center gap-x-1 border-r border-border/50 pr-2 mr-1" />
            </motion.div>
            <ModeToggle />
            <StyleSelectorPopover
              triggerVariant="ghost"
              align="end"
              layoutId="minimal-style-check"
            />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="minimal-mobile-menu"
              className="grid size-9 place-items-center rounded-full transition-colors duration-150 ease-out md:hidden hoverable:bg-muted/50 active:scale-[0.97]"
            >
              <MenuIcon isOpen={isMobileMenuOpen} />
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* transform + opacity, matching the static navbar. Animating height:auto
          forces layout on every frame and was the only one of the three
          variants doing it. */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={NAV_SPRING}
            id="minimal-mobile-menu"
            className="md:hidden overflow-hidden border-b border-border/50 bg-background/80 backdrop-blur-md"
          >
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-6 py-3">
              {NAV_ITEMS.map((item) => (
                <TransitionLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center text-sm text-muted-foreground transition-colors duration-150 ease-out hoverable:text-foreground",
                    isCurrent(item.href) && ACTIVE_LINK,
                  )}
                >
                  {item.label}
                </TransitionLink>
              ))}
              <div className="pt-3 mt-1 border-t border-border/50">
                <Socials />
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StyleSelectorPopover({
  triggerVariant = "ghost",
  align = "end",
  layoutId = "style-check",
}: {
  triggerVariant?: "ghost" | "pill";
  align?: "start" | "center" | "end";
  layoutId?: string;
}) {
  const [selectedStyle, setSelectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );
  const [animationEnabled, setAnimationEnabled] = useStorage<boolean>(
    "animations.enabled",
    false,
  );
  const [animationMode, setAnimationMode] = useStorage<AnimationMode["id"]>(
    "animations.mode",
    "stars",
  );
  const current = StyleModels.find((s) => s.id === selectedStyle);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Shows on every load while still on the default style; switching to
          anything else is what retires it. The popover opens right on top of
          this, so hide it while open. */}
      <StyleHint
        active={selectedStyle === StyleModels[0].id}
        suppressed={open}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {triggerVariant === "pill" ? (
            <button
              aria-label={`Change site style, currently ${current?.label ?? "default"}`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-border/60 bg-background/70 hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground text-xs font-medium"
            >
              {current ? (
                <current.icon className={cn("size-3.5", current.color)} />
              ) : (
                <Palette className="size-3.5" />
              )}
              <span className="hidden sm:block">
                {current?.label ?? "Style"}
              </span>
            </button>
          ) : (
            // Icon-only reads as decoration — a bare dash especially so. Keep the
            // label alongside it wherever there's room.
            <button
              aria-label={`Change site style, currently ${current?.label ?? "default"}`}
              className="flex items-center gap-1.5 rounded-full px-2 py-2 sm:px-2.5 sm:py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              {current ? (
                <current.icon
                  className={cn("size-4 sm:size-3.5", current.color)}
                />
              ) : (
                <Palette className="size-4 sm:size-3.5" />
              )}
              <span className="hidden sm:block">
                {current?.label ?? "Style"}
              </span>
            </button>
          )}
        </PopoverTrigger>
        {/* Opaque. A menu you have to read should not sit on a translucent
            surface over moving content. */}
        <PopoverContent
          align={align}
          sideOffset={8}
          className="w-60 rounded-2xl border border-border bg-popover p-3 shadow-lg"
        >
          <p className="mb-2 px-1 text-2xs font-medium uppercase tracking-wider text-muted-foreground">
            Style
          </p>
          {/* radiogroup, not a list of buttons with aria-current — this is an
              exclusive choice, and aria-current means "current in a set of
              navigation links". */}
          <div role="radiogroup" aria-label="Site style" className="flex flex-col gap-0.5">
            {StyleModels.map((style) => (
              <button
                key={style.id}
                type="button"
                role="radio"
                aria-checked={selectedStyle === style.id}
                onClick={() => setSelectedStyle(style.id)}
                disabled={style?.disabled}
                className={cn(
                  "flex min-h-9 w-full items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors duration-150 ease-out",
                  "disabled:pointer-events-none disabled:opacity-50",
                  selectedStyle === style.id
                    ? "bg-accent font-medium text-foreground"
                    : "text-muted-foreground hoverable:bg-accent/60 hoverable:text-foreground",
                )}
              >
                <style.icon
                  className={cn(
                    "size-4 shrink-0",
                    selectedStyle === style.id
                      ? style.color
                      : "text-muted-foreground",
                  )}
                />
                {style.label}
                {selectedStyle === style.id ? (
                  <motion.span
                    layoutId={layoutId}
                    className="ml-auto size-1.5 rounded-full bg-foreground"
                    transition={{ type: "spring", bounce: 0, duration: 0.24 }}
                  />
                ) : null}
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-border/50 px-1 pt-3">
            {/* Static name. The label used to read "Animations Enabled" /
                "Animations Disabled", so the accessible name changed with the
                state it described. */}
            <Label
              htmlFor={`${layoutId}-animations`}
              className="text-xs text-muted-foreground"
            >
              Background animation
            </Label>
            <Switch
              id={`${layoutId}-animations`}
              checked={animationEnabled}
              onCheckedChange={setAnimationEnabled}
            />
          </div>

          <AnimatePresence initial={false}>
            {animationEnabled ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.24 }}
                className="overflow-hidden"
              >
                {/* Also a radiogroup. These were independent Switches, so
                    turning one on silently turned another off. */}
                <div
                  role="radiogroup"
                  aria-label="Background animation style"
                  className="mt-2 flex flex-col gap-0.5 px-1"
                >
                  {animationModes.map((mode) => {
                    if (mode.disabled) return null;
                    const active = animationMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setAnimationMode(active ? "none" : mode.id)}
                        className={cn(
                          "flex min-h-8 items-center gap-2 rounded-lg px-2 text-xs transition-colors duration-150 ease-out",
                          active
                            ? "bg-accent font-medium text-foreground"
                            : "text-muted-foreground hoverable:bg-accent/60 hoverable:text-foreground",
                        )}
                      >
                        <Icon name={mode.icon} className="size-3.5" />
                        {mode.label}
                        {active ? (
                          <span className="ml-auto size-1.5 rounded-full bg-foreground" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function StyleSelector() {
  const [selectedStyle, setSelectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );

  const [animationEnabled, setAnimationEnabled] = useStorage<boolean>(
    "animations.enabled",
    false,
  );
  const [animationMode, setAnimationMode] = useStorage<AnimationMode["id"]>(
    "animations.mode",
    "stars",
  );

  return (
    <div className="grid grid-cols-2 gap-2">
      <div role="radiogroup" aria-label="Site style" className="col-span-2 grid grid-cols-2 gap-2">
        {StyleModels.map((style) => {
          const active = selectedStyle === style.id;
          return (
            <button
              key={style.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelectedStyle(style.id)}
              disabled={style?.disabled}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-colors duration-150 ease-out",
                "disabled:pointer-events-none disabled:opacity-50",
                // Selected reads on the border and the ring, not on a 1.1:1
                // background wash that only the icon tint distinguished.
                active
                  ? "border-primary/50 bg-accent ring-1 ring-primary/30"
                  : "border-transparent bg-transparent hoverable:bg-accent/60",
              )}
            >
              <style.icon
                className={cn(
                  "mb-1 size-6",
                  active ? style.color : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {style.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="col-span-2 mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <Label htmlFor="island-animations">Background animation</Label>
        <Switch
          id="island-animations"
          onCheckedChange={setAnimationEnabled}
          checked={animationEnabled}
        />
      </div>

      <AnimatePresence initial={false}>
        {animationEnabled ? (
          <motion.div
            className="col-span-2 flex flex-col gap-0.5 overflow-hidden pt-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.24 }}
          >
            <div role="radiogroup" aria-label="Background animation style" className="flex flex-col gap-0.5">
              {animationModes.map((mode) => {
                if (mode.disabled) return null;
                const active = animationMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setAnimationMode(active ? "none" : mode.id)}
                    className={cn(
                      "flex min-h-9 items-center gap-2 rounded-lg px-2 text-xs transition-colors duration-150 ease-out",
                      active
                        ? "bg-accent font-medium text-foreground"
                        : "text-muted-foreground hoverable:bg-accent/60 hoverable:text-foreground",
                    )}
                  >
                    <Icon name={mode.icon} className="size-4" />
                    {mode.label}
                    {active ? (
                      <span className="ml-auto size-1.5 rounded-full bg-foreground" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
