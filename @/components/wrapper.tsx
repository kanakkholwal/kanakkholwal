"use client";

import { StarsBackground } from "@/components/animated/bg.stars";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const CONTENT_VARIANTS = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: { type: 'spring', stiffness: 100, damping: 30 },
    },
} as const;

export default function PageWrapper({ children }: { children: React.ReactNode, }) {
    const [transition, setTransition] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        const timer = setTimeout(() => setTransition(true), 1250);
        const timer2 = setTimeout(() => setIsLoaded(true), 2500);
        return () => {
            clearTimeout(timer);
            clearTimeout(timer2);
        };
    }, []);
    return (
        <main className={cn('relative h-dvh', !isLoaded && 'overflow-y-hidden')}>
            <Header transition={transition} />
            <motion.div
                className={cn("h-dvh w-full pt-20 md:pt-24 lg:pt-28")}
                initial="hidden"
                animate={transition ? "visible" : "hidden"}
                variants={CONTENT_VARIANTS}
            >
                {children}
            </motion.div>

            <StarsBackground
                starColor={resolvedTheme === 'dark' ? '#FFF' : '#000'}
                className={cn(
                    'fixed inset-0 flex items-center justify-center rounded-xl -z-1',
                    'dark:bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)] bg-[radial-gradient(ellipse_at_bottom,_#f5f5f5_0%,_#fff_100%)]',
                )}
            />
        </main>
    )
}