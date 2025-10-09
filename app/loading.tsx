"use client";

import { StarsBackground } from "@/components/animated/bg.stars";
import { Logo } from "@/components/logo";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export default function LoadingPage() {
    const { resolvedTheme } = useTheme();
    const isMobile = useIsMobile();

    return (
        <div className={cn("relative h-dvh overflow-y-hidden")}>
            <div className="relative size-full">
                <motion.div
                    layout="position"
                    layoutId="logo"
                    className="absolute z-110 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6"
                >
                    <Logo size={isMobile ? "lg" : "xl"} draw isLoader />

                </motion.div>
            </div>

            <StarsBackground
                starColor={resolvedTheme === "dark" ? "#FFF" : "#000"}
                className={cn(
                    "fixed inset-0 flex items-center justify-center rounded-xl -z-1",
                    "dark:bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)] bg-[radial-gradient(ellipse_at_bottom,_#f5f5f5_0%,_#fff_100%)]"
                )}
            />
        </div>
    );
}
