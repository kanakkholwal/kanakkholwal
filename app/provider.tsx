// provider.tsx
"use client";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { RootProvider } from "fumadocs-ui/provider/next";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ViewTransitions } from "next-view-transitions";
import { Next13ProgressBar } from "next13-progressbar";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type React from "react";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
      <RootProvider theme={{ enabled: false }}>
        <Next13ProgressBar
          height="4px"
          color="var(--primary)"
          options={{ showSpinner: true, trickle: true }}
          showOnShallow={true}
        />

        <NextThemesProvider
          themes={["light", "dark", "system"]}
          defaultTheme="dark"
          attribute={["class", "data-theme"]}
        >
          <TooltipProvider>
            <div
              className={cn(
                "min-h-screen w-full h-full overflow-x-hidden no-scrollbar",
              )}
            >
              <NuqsAdapter>{children}</NuqsAdapter>
            </div>
          </TooltipProvider>
        </NextThemesProvider>

        <Toaster position="bottom-right" richColors />
      </RootProvider>
    </ViewTransitions>
  );
}
