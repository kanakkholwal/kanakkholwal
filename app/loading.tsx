"use client";

import { StarsBackground } from "@/components/animated/bg.stars";
import { Logo } from "@/components/logo"; // Ensure Logo accepts className
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export default function LoadingPage() {
  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-background">
      <div className="relative z-50 flex size-full flex-col items-center justify-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5 },
          }}
        >
          {/* Add a pulsing effect while waiting for server */}
          <motion.div
            animate={{
              filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Ensure your Logo component passes props through */}
            <Logo size={isMobile ? "lg" : "xl"} draw isLoader />
          </motion.div>
        </motion.div>
      </div>

      <StarsBackground
        starColor={resolvedTheme === "dark" ? "#FFF" : "#000"}
        className={cn(
          "fixed inset-0 -z-10 h-full w-full opacity-50",
          "dark:bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)] bg-[radial-gradient(ellipse_at_bottom,_#f5f5f5_0%,_#fff_100%)]",
        )}
      />
    </div>
  );
}
