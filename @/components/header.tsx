"use client";

import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { TransitionLink } from "@/components/utils/link";
import { useIsMobile } from "@/hooks/use-mobile";
import useStorage from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Box, LinkIcon, Menu, Minus, Palette, Sparkles, X } from "lucide-react"; // Make sure to install lucide-react
import { useState } from "react";
import { IconComponent } from "./icons";
import { Socials } from "./socials";

type StylingModelOption = {
  id: string;
  label: string;
  icon: IconComponent;
  color: string;
  disabled?: boolean;
};
export const StyleModels: StylingModelOption[] = [
  { id: "dynamic", label: "Dynamic", icon: Sparkles, color: "text-blue-500" },
  { id: "static", label: "Static", icon: Box, color: "text-orange-500" },
  { id: "minimal", label: "Minimal", icon: Minus, color: "text-slate-500", disabled: true },
  // { id: "3d", label: "3D", icon: BoxSelect, color: "text-purple-500", disabled: true },
] as const;

export type StylingModel = (typeof StyleModels)[number]["id"];

const NAV_ITEMS = [
  { label: "Work", href: "/#work" },
  { label: "Projects", href: "/projects" },
  { label: "Stack", href: "/#skills" },
  { label: "Blog", href: "/blog" },
  { label: "Docs", href: "/docs" },
];




export const DynamicIslandNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  // New State for Tabs and Style Selection
  const [activeTab, setActiveTab] = useState<"links" | "design">("links");
  const [selectedStyle, setSelectedStyle] = useStorage<StylingModel>("styling.model", StyleModels[0].id);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 px-4 pointer-events-none">
      <motion.div
        key="header-nav"
        layout
        className={cn(
          "bg-background/80 backdrop-blur-xl border border-border shadow-lg pointer-events-auto overflow-hidden min-w-sm",
          "flex flex-col"
        )}
        style={{ borderRadius: 24 }}
        initial={{ width: "auto", height: "auto" }}
        animate={{
          width: isOpen ? "min-content" : "auto",
          height: isOpen ? "auto" : "56px" // Fixed height when closed
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
                        activeTab === tab ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {activeTab === tab && (
                        <motion.div
                          layoutId="active-tab-bg"
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
                  <AnimatePresence mode="popLayout" initial={false}>
                    {activeTab === "links" ? (
                      <motion.div
                        key="links-content"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        className="flex flex-col gap-1"
                      >
                        {NAV_ITEMS.map((item, i) => (
                          <motion.div
                            key={item.href}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <TransitionLink
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 group transition-colors"
                            >
                              <span className="text-sm font-medium">{item.label}</span>
                              <ArrowRight className="size-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-muted-foreground" />
                            </TransitionLink>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
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
                                ? "bg-muted/60 border-primary/20 shadow-inner"
                                : "bg-transparent border-transparent hover:bg-muted/30"
                            )}
                          >
                            <style.icon
                              className={cn(
                                "size-6 mb-1 transition-transform",
                                selectedStyle === style.id ? style.color : "text-muted-foreground",
                                selectedStyle === style.id && "scale-110"
                              )}
                            />
                            <span
                              className={cn(
                                "text-xs font-medium",
                                selectedStyle === style.id ? "text-foreground" : "text-muted-foreground"
                              )}
                            >
                              {style.label}
                            </span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="w-full h-px bg-border/50" />
                <Socials className="items-center gap-x-1 border-r border-border/50 mx-auto inline-flex md:hidden" />

              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center justify-between px-2 pl-4 h-[56px] gap-4">
            <motion.div layoutId="brand-logo" className="relative">
              <TransitionLink href="/">
                <Logo size="sm" />
              </TransitionLink>
            </motion.div>
            <Socials className="items-center gap-x-1 border-r border-border/50 hidden md:inline-flex" />


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
              {/* <GoToTopButton/> */}
            </div>
          </div>
      </motion.div>
    </div>
  );
};
export function StaticNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.div
      key="header-nav"
      layout
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        borderRadius: "1.5rem"
      }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={cn(
        "pointer-events-auto relative flex flex-col w-full max-w-[calc(var(--max-app-width)*0.85)]",
      )}
      style={{
        padding: isMobileMenuOpen ? "16px" : "8px 16px"
      }}
    >

      <div className="flex items-center justify-between w-full z-20 bg-background/80 backdrop-blur-md px-3 py-2 rounded-xl border border-border">
        <div className="flex items-center gap-2">
          <TransitionLink href="/" className="flex items-center gap-2 group">
            <motion.div layoutId="brand-logo" className="relative">
              <Logo size="sm" />
            </motion.div>
          </TransitionLink>
        </div>

        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {NAV_ITEMS.map((item) => (
            <TransitionLink
              key={item.href}
              href={item.href}
              className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-all duration-200"
            >
              {item.label}
            </TransitionLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <Socials className="items-center gap-x-1 border-r border-border/50 pr-2 mr-1" />
          </div>

          <ModeToggle />

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-muted/50 transition-colors active:scale-90"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="size-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="size-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="md:hidden overflow-hidden bg-card/80 backdrop-blur-md mt-2 rounded-xl border border-border"
          >
            <motion.nav
              className="flex flex-col gap-1 pt-4 pb-2"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
            >
              {NAV_ITEMS.map((item, i) => (
                <TransitionLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)} // Close on click
                  className="flex items-center justify-between px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all"
                >
                  <motion.span
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + (i * 0.05) }}
                  >
                    {item.label}
                  </motion.span>
                </TransitionLink>
              ))}

              {/* Mobile Socials */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 pt-4 border-t border-border/50 flex justify-center pb-2"
              >
                <Socials />
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )

}

export type NavbarType = "static" | "dynamic-island";


export const Header = ({ transition }: { transition: boolean }) => {
  const isMobile = useIsMobile();
  const [navbarModel] = useStorage<NavbarType>("navbar.model", "dynamic-island");

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none"
    >
      <AnimatePresence mode="popLayout">

        {!transition ? (
          <motion.div
            key="splash-logo"
            layoutId="logo-container"
            className="absolute inset-0 flex items-center justify-center h-screen w-screen pointer-events-auto bg-background"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <motion.div layoutId="brand-logo" className="relative z-10">
              <Logo size={isMobile ? "lg" : "xl"} draw />
            </motion.div>
          </motion.div>
        ) :
          (
            navbarModel === "dynamic-island" ? <DynamicIslandNavbar /> : <StaticNavbar />
          )
        }
      </AnimatePresence>
    </motion.header>
  );
};

