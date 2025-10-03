// provider.tsx
"use client";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ViewTransitions } from "next-view-transitions";
import { Next13ProgressBar } from "next13-progressbar";
import type React from "react";


export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
      <Next13ProgressBar
        height="4px"
        color="var(--primary)"
        options={{ showSpinner: true, trickle: true }}
        showOnShallow={true}
      />

      <NextThemesProvider
        themes={["light", "dark", "system"]}
        defaultTheme="system"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 grid grid-cols-2 -space-x-52 pattern_feed -z-1"
        >
          <div className="blur-[106px] h-56 bg-gradient-to-br from-secondary via-emerald-500 to-primary" />
          <div className="blur-[106px] h-32 bg-gradient-to-r from-primary via-violet-500 to-pink-500" />
        </div>

        <div className={cn("min-h-screen w-full h-full overflow-x-hidden")}>
          {children}
        </div>
      </NextThemesProvider>

      <Toaster position="bottom-right" richColors />

    </ViewTransitions>
  );
}
