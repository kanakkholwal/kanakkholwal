"use client";

import { StarsBackground } from "@/components/animated/bg.stars";
import { Header } from "@/components/header";
import { Logo } from "@/components/logo";
import useStorage from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import { AnimatePresence, LayoutGroup, motion, useScroll, useSpring, useTransform, Variants } from "framer-motion";
import { ReactLenis } from "lenis/react"; //
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { FooterSection } from "./footer";

// Staggered animation for content elements
const CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
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
  
  // 1. Ref for the scroll container
  const containerRef = useRef<HTMLDivElement>(null);

  // 2. Scroll Hooks for Parallax
  // We track the scroll progress of the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 3. Create a smooth spring physics for the parallax value to remove jitter
  const smoothY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 4. Transform scroll 0-1 into a Y pixel value. 
  // This makes the children move slightly slower/faster than the actual scroll, creating depth.
  // Move from 0px to -50px over the course of the page.
  const parallaxY = useTransform(smoothY, [0, 1], [0, -50]); 

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <LayoutGroup>
        <div 
            ref={containerRef} 
            className={cn("relative min-h-dvh w-full overflow-x-hidden", !isLoaded && "h-dvh overflow-y-hidden")}
        >
          
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
              "relative z-10 min-h-dvh w-full overflow-x-hidden",
              "pb-20",
              className
            )}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={CONTAINER_VARIANTS}
            // 6. Apply the Parallax Y value here
            style={{ y: parallaxY }} 
          >
              {children}
          </motion.main>

          {animationEnabled && animationMode === "stars" && (
            <div className="fixed inset-0 -z-10 pointer-events-none">
              <StarsBackground
                starColor={resolvedTheme === "dark" ? "#f1f1f1" : "#1c1c1c"}
                defaultBg={false}
                className="h-full w-full opacity-60"
              />
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
    </ReactLenis>
  );
}