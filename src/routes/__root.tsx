/// <reference types="vite/client" />
import { RouteProgress } from "@/components/route-progress";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorPageClient from "@/components/utils/error-page.view";
import { cn } from "@/lib/utils";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { RootProvider } from "fumadocs-ui/provider/tanstack";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import type { ReactNode } from "react";
import { appConfig } from "root/project.config";
import { getContentIndex } from "~/server/content";
import NotFound from "~/features/not-found";
import appCss from "~/styles/global.css?url";

const title = `${appConfig.displayName} | ${appConfig.role}`;
const imageAlt = `${appConfig.displayName} - UI/UX & Full Stack Engineer`;
const gaId = appConfig.verifications["google.analytics"];
const adsense = appConfig.verifications["google.adsense"];

export const Route = createRootRoute({
  loader: () => getContentIndex(),
  // Static content: fetched once on the server and never revalidated on navigation.
  staleTime: Number.POSITIVE_INFINITY,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title },
      { name: "description", content: appConfig.description },
      { name: "application-name", content: appConfig.displayName },
      { name: "author", content: appConfig.creator },
      { name: "keywords", content: appConfig.keywords.join(", ") },
      {
        name: "robots",
        content: "index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1",
      },
      { name: "color-scheme", content: "light dark" },
      { name: "theme-color", media: "(prefers-color-scheme: light)", content: "#fafafa" },
      { name: "theme-color", media: "(prefers-color-scheme: dark)", content: "#0b0b0b" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: appConfig.seo.locale },
      { property: "og:url", content: appConfig.url },
      { property: "og:title", content: appConfig.displayName },
      { property: "og:description", content: appConfig.description },
      { property: "og:site_name", content: appConfig.displayName },
      { property: "og:image", content: `${appConfig.url}/opengraph-image` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: imageAlt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: appConfig.displayName },
      { name: "twitter:description", content: appConfig.description },
      { name: "twitter:image", content: `${appConfig.url}/twitter-image` },
      { name: "twitter:creator", content: `@${appConfig.usernames.twitter}` },
      ...(adsense ? [{ name: "google-adsense-account", content: adsense }] : []),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon/favicon.ico" },
      { rel: "shortcut icon", href: "/favicon/icon.png" },
      { rel: "apple-touch-icon", href: "/favicon/apple-icon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(appConfig.seo.jsonLd) },
      ...(import.meta.env.PROD && gaId
        ? [
            { src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`, async: true },
            {
              children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${gaId}");`,
            },
          ]
        : []),
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
  errorComponent: ({ error, reset }) => <ErrorPageClient error={error as Error} reset={reset} />,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className={cn("min-h-dvh w-full antialiased", "bg-background text-foreground")}>
        <TooltipProvider>
          <RootProvider theme={{ enabled: false }}>
            <RouteProgress />
            <ThemeProvider
              themes={["light", "dark", "system"]}
              defaultTheme="dark"
              attribute={["class", "data-theme"]}
            >
              <div className="min-h-screen w-full h-full overflow-x-clip no-scrollbar">
                {/* z-0 keeps the grain under the header; a blend layer here forced a compositing pass per paint. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none fixed inset-0 z-0 bg-[url('/noise.svg')] opacity-[0.035]"
                />
                <NuqsAdapter>{children}</NuqsAdapter>
              </div>
            </ThemeProvider>
            <Toaster position="bottom-right" richColors />
          </RootProvider>
        </TooltipProvider>
        <Scripts />
      </body>
    </html>
  );
}
