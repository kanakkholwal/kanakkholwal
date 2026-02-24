"use client";

import { Icon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Socials } from "@/components/socials";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import { useRef, useState } from "react";

export type NavbarType = "static" | "dynamic" | "minimal";

export function Header({ transition }: { transition: boolean }) {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );
  const isMobile = useIsMobile();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      animate={{
        paddingTop: selectedStyle === "minimal" ? 0 : 24,
        paddingLeft: selectedStyle === "minimal" ? 0 : 16,
        paddingRight: selectedStyle === "minimal" ? 0 : 16,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!transition ? (
          <motion.div
            key="splash"
            className="absolute inset-0 flex items-center justify-center h-screen w-screen pointer-events-auto bg-background"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            <motion.div layoutId="brand-logo" className="relative z-10">
              <Logo size={isMobile ? "lg" : "xl"} draw />
            </motion.div>
          </motion.div>
        ) : selectedStyle === "minimal" ? (
          <MinimalNavbar key="minimal" />
        ) : selectedStyle === "dynamic" ? (
          <DynamicIslandNavbar key="dynamic" />
        ) : selectedStyle === "static" ? (
          <StaticNavbar key="static" />
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
};


function DynamicIslandNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"links" | "design">("links");

  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref as React.RefObject<HTMLDivElement>, () =>
    setIsOpen(false),
  );

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 px-4 pointer-events-none"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      <motion.div
        layout
        className={cn(
          "bg-background/80 backdrop-blur-xl border border-border shadow-lg pointer-events-auto overflow-hidden min-w-sm",
          "flex flex-col",
        )}
        style={{ borderRadius: 24 }}
        animate={{
          width: isOpen ? "min-content" : "auto",
          height: isOpen ? "auto" : "56px",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        ref={ref}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 pb-2 pt-4 flex flex-col gap-4"
            >
              <div className="grid grid-cols-2 p-1 bg-muted/40 rounded-xl relative overflow-hidden">
                {(["links", "design"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "relative z-10 py-2 text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2",
                      activeTab === tab ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="dynamic-tab-bg"
                        className="absolute inset-0 bg-background rounded-lg shadow-sm border border-border/50"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2 capitalize">
                      {tab === "links" ? <LinkIcon size={14} /> : <Palette size={14} />}
                      {tab}
                    </span>
                  </button>
                ))}
              </div>

              <div className="overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  {activeTab === "links" ? (
                    <motion.div
                      key="links-content"
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -50, opacity: 0 }}
                      transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }}
                      className="flex flex-col gap-1"
                    >
                      {NAV_ITEMS.map((item) => (
                        <TransitionLink
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 group transition-colors"
                        >
                          <span className="text-sm font-medium">{item.label}</span>
                          <ArrowRight className="size-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-muted-foreground" />
                        </TransitionLink>
                      ))}
                    </motion.div>
                  ) : (
                    <StyleSelector key="style-selector" />
                  )}
                </AnimatePresence>
              </div>

              <div className="w-full h-px bg-border/50" />
              <Socials className="items-center gap-x-1 mx-auto inline-flex md:hidden" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between px-2 pl-4 h-[56px] gap-4">
          <motion.div layoutId="brand-logo">
            <TransitionLink href="/">
              <Logo size="sm" />
            </TransitionLink>
          </motion.div>
          <motion.div layoutId="socials">
            <Socials className="items-center gap-x-1 border-r border-border/50 hidden md:inline-flex" />
          </motion.div>
          <div className="flex items-center gap-1">
            <ModeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full hover:bg-muted/60 transition-colors bg-muted/20"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="size-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="size-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
function StaticNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="pointer-events-auto relative flex flex-col items-center w-full max-w-[calc(var(--max-app-width)*0.85)]"
    >
      <div className="flex items-center justify-between w-full gap-3">
        {/* Left capsule — logo + nav */}
        <motion.div layoutId="brand-main" className="flex items-center gap-1 px-3 py-2 rounded-full border border-border/60 bg-background/70 backdrop-blur-xl shadow-sm shrink-0">
          <TransitionLink href="/" className="flex items-center mr-2 shrink-0">
            <motion.div layoutId="brand-logo">
              <Logo size="sm" />
            </motion.div>
          </TransitionLink>

          <div className="w-px h-4 bg-border/60 mr-1 hidden md:block" />

          <motion.nav layoutId="header-links" className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <TransitionLink
                key={item.href}
                href={item.href}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
                className="relative px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-full"
              >
                {hoveredItem === item.href && (
                  <motion.span
                    layoutId="static-nav-pill"
                    className="absolute inset-0 rounded-full bg-muted/70"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </TransitionLink>
            ))}
          </motion.nav>
        </motion.div>

        {/* Right capsule — actions */}
        <div className="flex items-center gap-1 px-2 py-2 rounded-full border border-border/60 bg-background/70 backdrop-blur-xl shadow-sm">
          <motion.div layoutId="socials">
            <Socials className="hidden sm:inline-flex items-center gap-x-1 border-r border-border/50 pr-2 mr-0.5" />
          </motion.div>
          <ModeToggle />
          <StyleSelectorPopover triggerVariant="pill" align="end" layoutId="static-style-check" />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-muted/50 transition-colors active:scale-90"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileMenuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="size-4" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu className="size-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="md:hidden w-full mt-2 overflow-hidden rounded-3xl border border-border/60 bg-background/90 backdrop-blur-xl shadow-md"
          >
            <nav className="flex flex-col p-2 gap-0.5">
              {NAV_ITEMS.map((item) => (
                <TransitionLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-2xl transition-colors"
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

function MinimalNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.div
      className="pointer-events-auto w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      <motion.div
        layoutId="brand-main"
        className="flex items-center justify-between px-6 py-3 border-b border-border/50 bg-background/80 backdrop-blur-md"
      >
        <TransitionLink href="/">
          <motion.div layoutId="brand-logo">
            <Logo size="sm" />
          </motion.div>
        </TransitionLink>

        <motion.nav layoutId="header-links" className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <TransitionLink
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </TransitionLink>
          ))}
        </motion.nav>

        <div className="flex items-center gap-2">
          <motion.div layoutId="socials">
            <Socials className="hidden sm:inline-flex items-center gap-x-1 border-r border-border/50 pr-2 mr-1" />
          </motion.div>
          <ModeToggle />
          <StyleSelectorPopover triggerVariant="ghost" align="end" layoutId="minimal-style-check" />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileMenuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="size-4" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="size-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="md:hidden overflow-hidden border-b border-border/50 bg-background/80 backdrop-blur-md"
          >
            <div className="flex flex-col px-6 py-3 gap-1">
              {NAV_ITEMS.map((item) => (
                <TransitionLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
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

  return (
    <Popover>
      <PopoverTrigger asChild>
        {triggerVariant === "pill" ? (
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-border/60 bg-background/70 hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground text-xs font-medium">
            {current ? (
              <current.icon className={cn("size-3.5", current.color)} />
            ) : (
              <Palette className="size-3.5" />
            )}
            <span className="hidden sm:block">{current?.label ?? "Style"}</span>
          </button>
        ) : (
          <button className="p-2 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
            {current ? (
              <current.icon className={cn("size-4", current.color)} />
            ) : (
              <Palette className="size-4" />
            )}
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={8}
        className="w-56 p-3 rounded-2xl border border-border/60 bg-background/90 backdrop-blur-md shadow-lg"
      >
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
          Style
        </p>
        <div className="flex flex-col gap-0.5">
          {StyleModels.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              disabled={style?.disabled}
              className={cn(
                "flex items-center gap-3 w-full px-2 py-1.5 rounded-lg text-sm transition-colors",
                selectedStyle === style.id
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              <style.icon
                className={cn(
                  "size-4 shrink-0",
                  selectedStyle === style.id ? style.color : "text-muted-foreground",
                )}
              />
              {style.label}
              {selectedStyle === style.id && (
                <motion.div
                  layoutId={layoutId}
                  className="ml-auto size-1.5 rounded-full bg-foreground"
                />
              )}
            </button>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between px-1">
          <Label htmlFor={`${layoutId}-animations`} className="text-xs text-muted-foreground">
            Animations
          </Label>
          <Switch
            id={`${layoutId}-animations`}
            checked={animationEnabled}
            onCheckedChange={setAnimationEnabled}
          />
        </div>

        <AnimatePresence initial={false}>
          {animationEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 flex flex-col gap-1 px-1">
                {animationModes.map((mode) => {
                  if (mode.disabled) return null;
                  return (
                    <div key={mode.id} className="flex items-center justify-between">
                      <Label
                        htmlFor={`${layoutId}-mode-${mode.id}`}
                        className={cn(
                          "text-xs inline-flex items-center gap-2",
                          animationMode === mode.id
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        <Icon name={mode.icon} className="size-3.5" />
                        {mode.label}
                      </Label>
                      <Switch
                        id={`${layoutId}-mode-${mode.id}`}
                        checked={animationMode === mode.id}
                        onCheckedChange={(checked) =>
                          setAnimationMode(checked ? mode.id : "none")
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PopoverContent>
    </Popover>
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
    <motion.div
      key="design-content"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 50, opacity: 0 }}
      className="grid grid-cols-2 gap-2"
    >
      {StyleModels.map((style) => (
        <button
          key={style.id}
          onClick={() => setSelectedStyle(style.id)}
          disabled={style?.disabled}
          className={cn(
            "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200",
            selectedStyle === style.id
              ? "bg-muted/60 shadow shadow-foreground/5"
              : "bg-transparent border-transparent hover:bg-muted/30",
          )}
        >
          <style.icon
            className={cn(
              "size-6 mb-1 transition-transform",
              selectedStyle === style.id
                ? style.color
                : "text-muted-foreground",
              selectedStyle === style.id && "scale-110",
            )}
          />
          <span
            className={cn(
              "text-xs font-medium",
              selectedStyle === style.id
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            {style.label}
          </span>
        </button>
      ))}
      <div className="flex items-center justify-between space-x-2 col-span-2 text-xs text-muted-foreground text-center mt-1">
        <Label htmlFor="animations">
          Animations {animationEnabled ? "Enabled" : "Disabled"}
        </Label>
        <Switch
          id="animations"
          onCheckedChange={setAnimationEnabled}
          checked={animationEnabled}
        />
      </div>
      <AnimatePresence mode="popLayout" initial={false}>
        {animationEnabled && (
          <motion.div
            className="col-span-2 px-2 pt-1 flex flex-col gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            layout
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            {animationModes.map((mode) => {
              if (mode.disabled) return null;
              return (
                <div
                  className="inline-flex items-center justify-between gap-2 w-full"
                  key={mode.id}
                >
                  <Label
                    htmlFor={`animationMode.${mode.id}`}
                    className={cn(
                      "inline-flex items-center gap-2",
                      animationMode === mode.id
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    <Icon name={mode.icon} className="size-4" />
                    {mode.label}
                  </Label>
                  <Switch
                    id="animationMode.stars"
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setAnimationMode("stars");
                      } else {
                        setAnimationMode("none");
                      }
                    }}
                    checked={animationMode === "stars"}
                  />
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
