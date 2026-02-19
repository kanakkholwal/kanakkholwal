import { cn } from "@/lib/utils";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
// Geist is the new standard for "Engineering" aesthetics (replaces Inter)
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Instrument_Serif, Quicksand } from "next/font/google";
import { appConfig } from "root/project.config";
import "./global.css";
import { Provider } from "./provider";
// You will need to install this: npm i lenis react-lenis

export const metadata: Metadata = {
  title: {
    default: `${appConfig.name} | ${appConfig.role}`,
    template: `%s | ${appConfig.name}`,
  },
  description: appConfig.description,
  applicationName: appConfig.name,
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
    title: appConfig.name,
    description: appConfig.description,
    siteName: appConfig.name,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${appConfig.name} - UI/UX & Full Stack Engineer`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: appConfig.name,
    description: appConfig.description,
    images: [
      {
        url: "/twitter-image",
        width: 1200,
        height: 630,
        alt: `${appConfig.name} - UI/UX & Full Stack Engineer`,
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

// Editorial font for headers (keeps the "Design" feel)
const fontInstrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: "400",
});

// Logo font (Playful accent)
const logoFont = Quicksand({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-logo",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-6988693445063744" />
      </head>
      <body
        className={cn(
          // Base Layout
          "min-h-screen min-w-screen w-full antialiased !overflow-x-hidden no-scrollbar h-full",
          // Colors: Ensure these are defined in your Tailwind CSS
          "bg-background text-foreground",
          // Typography Variables
          GeistSans.variable,
          GeistMono.variable,
          logoFont.variable,
          fontInstrumentSerif.variable,
          // Premium Feel: Custom Selection Color (Stripe-like)
          "selection:bg-primary/20 selection:text-primary",
        )}
      >
        <Provider>
          <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] bg-[url('/noise.svg')] mix-blend-overlay"></div>

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

        {process.env.NODE_ENV === "production" && (
          <GoogleAnalytics gaId={appConfig.verifications["google.analytics"]} />
        )}
      </body>
    </html>
  );
}
