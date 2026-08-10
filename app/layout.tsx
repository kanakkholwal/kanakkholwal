import { cn } from "@/lib/utils";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Quicksand } from "next/font/google";
import { appConfig } from "root/project.config";
import "./global.css";
import { Provider } from "./provider";

export const metadata: Metadata = {
  title: {
    default: `${appConfig.displayName} | ${appConfig.role}`,
    template: `%s | ${appConfig.displayName}`,
  },
  description: appConfig.description,
  applicationName: appConfig.displayName,
  authors: appConfig.authors as unknown as { name: string; url?: string }[],
  creator: appConfig.creator,
  keywords: appConfig.keywords,
  metadataBase: new URL(appConfig.url),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/favicon/manifest.json",
  openGraph: {
    type: "website",
    locale: appConfig.seo.locale,
    url: appConfig.url,
    title: appConfig.displayName,
    description: appConfig.description,
    siteName: appConfig.displayName,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${appConfig.displayName} - UI/UX & Full Stack Engineer`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: appConfig.displayName,
    description: appConfig.description,
    images: [
      {
        url: "/twitter-image",
        width: 1200,
        height: 630,
        alt: `${appConfig.displayName} - UI/UX & Full Stack Engineer`,
      },
    ],
    creator: `@${appConfig.usernames.twitter}`,
  },
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/icon.png",
    apple: "/favicon/apple-icon.png",
  },
};

// Without this the mobile browser chrome stays one theme while the page is in
// the other. Values track --background in each theme block.
export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
};

// Editorial font for headers (keeps the "Design" feel)
const fontInstrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: "400",
  display: "swap",
});

// Logo font
const logoFont = Quicksand({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-logo",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {appConfig.verifications["google.adsense"] && (
          <meta name="google-adsense-account" content={appConfig.verifications["google.adsense"]} />
        )}
      </head>
      <body
        className={cn(
          // `min-w-screen` was here and beat the max-width clamp in global.css,
          // so the fluid width never applied — and 100vw includes the scrollbar
          // gutter, which is the overflow `overflow-x-clip` was hiding.
          "min-h-dvh w-full antialiased",
          "bg-background text-foreground",
          GeistSans.variable,
          GeistMono.variable,
          logoFont.variable,
          fontInstrumentSerif.variable,
        )}
      >
        <Provider>
          {/* z-0, not z-50: at z-50 this painted over the header. mix-blend is
              gone too — a full-viewport blend layer forces a compositing pass
              on every paint, and costs most on the phones it helps least. */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 bg-[url('/noise.svg')] opacity-[0.035]"
          />
          {children}
        </Provider>

        {/* JSON-LD for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(appConfig.seo.jsonLd),
          }}
          id="json-ld-personal"
          suppressHydrationWarning
        />

        {(process.env.NODE_ENV === "production" && appConfig.verifications["google.analytics"]) && (
          <GoogleAnalytics gaId={appConfig.verifications["google.analytics"]} />
        )}
      </body>
    </html>
  );
}
