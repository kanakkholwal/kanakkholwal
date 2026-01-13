"use client";

import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { TransitionLink } from "@/components/utils/link"; // Assuming you have this
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "framer-motion";
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

          /* --- STATE 2: THE FLOATING HEADER (Logo Left, Nav Center, Tools Right) --- */
          <motion.div
            key="header-nav"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="pointer-events-auto relative flex items-center justify-between w-full max-w-5xl rounded-full border border-border/40 bg-background/60 backdrop-blur-md shadow-sm px-4 py-2"
          >

            {/* LEFT: LOGO */}
            <div className="flex items-center gap-2">
              <TransitionLink href="/" className="flex items-center gap-2 group">
                <motion.div layoutId="logo-icon" className="relative">
                  <Logo size="sm" />
                </motion.div>
                {/* <span className="font-bold tracking-tight hidden sm:block group-hover:text-primary transition-colors">
                  {appConfig.name}
                </span> */}
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

            {/* RIGHT: TOOLS & SOCIALS */}
            <div className="flex items-center gap-2">

              <Socials className="items-center gap-x-1 hidden sm:flex border-r border-border/50 pr-2 mr-1" />

              <ModeToggle />

              {/* Mobile Menu Trigger could go here if needed */}
              {/* <MobileMenuButton /> */}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
