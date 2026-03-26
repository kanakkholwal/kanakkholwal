"use client";

import { Header } from "@/components/header";
import { Logo } from "@/components/logo";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useScroll,
  useSpring,
  useTransform,
  Variants,
} from "framer-motion";
import { ReactLenis } from "lenis/react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState } from "react";
import { FlickeringGrid } from "./animated/bg.flickering";
import ConditionalRender from "./utils/conditional-render";

// Lazy-load heavy components
const StarsBackground = dynamic(
  () => import("@/components/animated/bg.stars").then((m) => ({ default: m.StarsBackground })),
  { ssr: false },
);
const FooterSection = dynamic(
  () => import("./footer").then((m) => ({ default: m.FooterSection })),
);

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
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

export default function PageWrapper({
  children,
  className,
  isHome,
}: {
  children: React.ReactNode;
  className?: string;
  isHome?: boolean;
}) {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );
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
    offset: ["start start", "end end"],
  });

  // 3. Create a smooth spring physics for the parallax value to remove jitter
  const smoothY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // 4. Transform scroll 0-1 into a Y pixel value.
  // This makes the children move slightly slower/faster than the actual scroll, creating depth.
  // Move from 0px to -50px over the course of the page.
  const parallaxY = useTransform(smoothY, [0, 1], [0, -50]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <LayoutGroup>
        <div
          ref={containerRef}
          className={cn(
            "relative min-h-dvh w-full overflow-x-hidden",
            !isLoaded && "h-dvh overflow-y-hidden",
          )}
        >
          <div className="fixed top-0 left-0 right-0 z-50">
            <Header transition={isLoaded} />
          </div>

          <AnimatePresence>
            <ConditionalRender condition={!isLoaded}>
              <motion.div
                className="fixed inset-0 z-[60] flex items-center justify-center bg-background"
                exit={{ opacity: 0, pointerEvents: "none" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <motion.div
                  layoutId="splash"
                  className="relative z-20"
                  transition={{ type: "spring", stiffness: 80, damping: 15 }}
                >
                  <Logo size="xl" draw isLoader />
                </motion.div>
              </motion.div>

            </ConditionalRender>
          </AnimatePresence>

          <motion.main
            className={cn(
              "relative z-10 min-h-dvh w-full",
              (selectedStyle === "minimal" && isHome) ? "mx-auto md:max-w-3xl *:[[id]]:scroll-mt-22 space-y-4" : "overflow-x-hidden pb-20",
              className,
            )}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={CONTAINER_VARIANTS}
            // 6. Apply the Parallax Y value here
            style={{ y: parallaxY }}
          >
            {children}
          </motion.main>
          <ConditionalRender condition={animationEnabled}>
            <div className="fixed inset-0 -z-10 pointer-events-none">
              <ConditionalRender condition={animationMode === "stars"}>
                <StarsBackground
                  starColor={resolvedTheme === "dark" ? "#f1f1f1" : "#1c1c1c"}
                  defaultBg={false}
                  className="h-full w-full opacity-60"
                />
              </ConditionalRender>
              <ConditionalRender condition={animationMode === "flickering"}>
                <FlickeringGrid
                  className="absolute top-0 left-0 size-full"
                  squareSize={4}
                  gridGap={6}
                  color="#6B7280"
                  maxOpacity={0.2}
                  flickerChance={0.05}
                />
              </ConditionalRender>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          </ConditionalRender>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className={
              cn((selectedStyle === "minimal" && isHome) ? "mx-auto md:max-w-3xl *:[[id]]:scroll-mt-22 space-y-4" : "overflow-x-hidden")
            }
          >
            <Suspense fallback={<div className="min-h-48" />}>
              <FooterSection />
            </Suspense>
          </motion.div>
        </div>
      </LayoutGroup>
    </ReactLenis>
  );
}
