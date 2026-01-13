"use client";

import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { TransitionLink } from "@/components/utils/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react"; // Make sure to install lucide-react
import { useState } from "react";
import { Socials } from "./socials";

const NAV_ITEMS = [
  { label: "Work", href: "/#work" },
  { label: "Projects", href: "/projects" },
  { label: "Stack", href: "/#skills" },
  { label: "Blog", href: "/blog" },
  { label: "Docs", href: "/docs" },
];

export const Header = ({ transition }: { transition: boolean }) => {
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <motion.div layoutId="logo-icon" className="relative z-10">
              <Logo size={isMobile ? "lg" : "xl"} draw />
            </motion.div>
          </motion.div>
        ) : (
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
            className="pointer-events-auto relative flex flex-col w-full max-w-5xl border border-border/40 bg-background/80 backdrop-blur-xl shadow-sm overflow-hidden"
            style={{
              padding: isMobileMenuOpen ? "16px" : "8px 16px"
            }}
          >

            <div className="flex items-center justify-between w-full z-20">
              <div className="flex items-center gap-2">
                <TransitionLink href="/" className="flex items-center gap-2 group">
                  <motion.div layoutId="logo-icon" className="relative">
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
                  className="md:hidden overflow-hidden"
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
        )}
      </AnimatePresence>
    </motion.header>
  );
};