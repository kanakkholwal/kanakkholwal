"use client";

import { Header } from "@/components/header";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import { LayoutGroup, useReducedMotion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { Suspense, useRef } from "react";
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

const MINIMAL_HOME_LAYOUT = "mx-auto md:max-w-3xl *:[[id]]:scroll-mt-22 space-y-4";

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
  const { resolvedTheme } = useTheme();
  const [animationEnabled] = useStorage("animations.enabled", false);
  const [animationMode] = useStorage("animations.mode", "stars");
  const reduce = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);

  const isMinimalHome = selectedStyle === "minimal" && isHome;

  return (
    // Lenis hijacks native scroll, so it is off entirely under reduced motion —
    // otherwise there is no way for a user to get their own scrolling back.
    <ReactLenis
      root
      options={{ lerp: 0.12, smoothWheel: !reduce, syncTouch: false }}
    >
      <LayoutGroup>
        <div ref={containerRef} className="relative min-h-dvh w-full">
          <div className="fixed top-0 left-0 right-0 z-40">
            <Header />
          </div>

          {/* No splash, no gate. The markup is server-rendered and readable at
              first paint; the old 1.2s timer was tied to nothing and locked
              scroll while it ran. */}
          <main
            className={cn(
              "relative z-10 min-h-dvh w-full",
              isMinimalHome ? MINIMAL_HOME_LAYOUT : "pb-20",
              className,
            )}
          >
            {children}
          </main>

          <ConditionalRender condition={animationEnabled && !reduce}>
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
              <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
            </div>
          </ConditionalRender>

          <div className={cn(isMinimalHome && "mx-auto md:max-w-3xl")}>
            <Suspense fallback={null}>
              <FooterSection />
            </Suspense>
          </div>
        </div>
      </LayoutGroup>
    </ReactLenis>
  );
}
