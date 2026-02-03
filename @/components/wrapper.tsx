"use client";

import { StarsBackground } from "@/components/animated/bg.stars";
import { Header } from "@/components/header";
import { Logo } from "@/components/logo"; 
import useStorage from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import { AnimatePresence, LayoutGroup, motion, Variants } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FooterSection } from "./footer";

// Staggered animation for content elements
const CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3, // Wait for logo to move
    },
  },
};

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 100, damping: 20 }
  },
};

export default function PageWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { resolvedTheme } = useTheme();
  const [animationEnabled] = useStorage("animations.enabled", false);
  const [animationMode] = useStorage("animations.mode", "stars");

  useEffect(() => {
    // Slightly faster timing for a snappier feel
    const timer = setTimeout(() => setIsLoaded(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LayoutGroup>
      <div className={cn("relative min-h-dvh w-full overflow-x-hidden", !isLoaded && "h-dvh overflow-y-hidden")}>
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header transition={isLoaded} />
        </div>
        <AnimatePresence>
          {!isLoaded && (
            <motion.div
              className="fixed inset-0 z-[60] flex items-center justify-center bg-background"
              exit={{ opacity: 0, pointerEvents: "none" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <motion.div
                layoutId="brand-logo"
                className="relative z-20"
                transition={{ type: "spring", stiffness: 80, damping: 15 }}
              >
                <Logo size="xl" draw isLoader />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.main
          className={cn(
            "relative z-10 min-h-dvh w-full",
            "pb-20", 
            className
          )}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={CONTAINER_VARIANTS}
        >
          <motion.div variants={ITEM_VARIANTS}>
            {children}
          </motion.div>
        </motion.main>

        {animationEnabled && animationMode === "stars" && (
          <div className="fixed inset-0 -z-10 pointer-events-none">
            <StarsBackground
              starColor={resolvedTheme === "dark" ? "#f1f1f1" : "#1c1c1c"}
              defaultBg={false}
              className="h-full w-full opacity-60"
            />
            {/* Optional: Add a gradient overlay to blend stars at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <FooterSection />
        </motion.div>

      </div>
    </LayoutGroup>
  );
}