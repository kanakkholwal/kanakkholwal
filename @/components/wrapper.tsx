"use client";

import { StarsBackground } from "@/components/animated/bg.stars";
import { Header } from "@/components/header";
import useStorage from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FooterSection } from "./footer";

const CONTENT_VARIANTS:Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 30 },
  },
}

export default function PageWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [transition, setTransition] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { resolvedTheme } = useTheme();
  const [animationEnabled] = useStorage("animations.enabled", false);
  const [animationMode] = useStorage("animations.mode", "stars");

  useEffect(() => {
    const timer = setTimeout(() => setTransition(true), 1250);
    const timer2 = setTimeout(() => setIsLoaded(true), 2500);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);
  return (
    <div className={cn("relative h-dvh", !isLoaded && "overflow-y-hidden")}>
      <Header transition={transition} />
      <motion.div
        className={cn(
          "min-h-dvh w-full",
          "py-20 md:py-24 lg:py-28 pt-0!",
          className)}
        initial="hidden"
        animate={transition ? "visible" : "hidden"}
        variants={CONTENT_VARIANTS}
      >
        {children}
      </motion.div>
      {animationEnabled &&
        animationMode === "stars" && (
          <StarsBackground
            starColor={resolvedTheme === "dark" ? "#f1f1f1" : "#1c1c1c"}
            defaultBg={false}
            className={cn("fixed inset-0 flex items-center justify-center rounded-xl -z-1",)}
          />
        )
      }
      <FooterSection />
    </div>
  );
}
