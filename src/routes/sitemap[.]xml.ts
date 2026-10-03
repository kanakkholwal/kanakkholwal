import { createFileRoute } from "@tanstack/react-router";
import { appConfig } from "root/project.config";
import { getProjectList } from "@/lib/project.source";
import { source } from "@/lib/source";
import { OG_VERSION } from "~/og/version";

type Entry = { path: string; lastModified?: Date | string; changefreq: string; priority: number; image?: string };

const STATIC_ROUTES: Entry[] = [
  { path: "/", changefreq: "daily", priority: 1.0 },
  { path: "/blog", changefreq: "daily", priority: 0.9 },
  { path: "/docs", changefreq: "weekly", priority: 0.9 },
  { path: "/projects", changefreq: "weekly", priority: 0.9 },
  { path: "/journey", changefreq: "monthly", priority: 0.7 },
  { path: "/stats", changefreq: "daily", priority: 0.6 },
  { path: "/contact", changefreq: "yearly", priority: 0.6 },
  { path: "/analytics", changefreq: "daily", priority: 0.5 },
  { path: "/tech-stack", changefreq: "monthly", priority: 0.5 },
  { path: "/links", changefreq: "monthly", priority: 0.5 },
  { path: "/bucket-list", changefreq: "monthly", priority: 0.4 },
  { path: "/attribution", changefreq: "yearly", priority: 0.3 },
  { path: "/legal/privacy", changefreq: "yearly", priority: 0.2 },
  { path: "/legal/terms", changefreq: "yearly", priority: 0.2 },
];

function entries(): Entry[] {
  const pages = source.getPages();
  const categories = new Set(pages.filter((p) => p.slugs.length > 1).map((p) => p.slugs[0]));
  return [
    ...STATIC_ROUTES,
    ...[...categories].map((c) => ({ path: `/docs/${c}`, changefreq: "weekly", priority: 0.8 })),
    ...pages.map((p) => ({
      path: p.url,
      lastModified: p.data.lastModified,
      changefreq: "weekly",
      priority: 0.8,
      image: `/og/docs/${p.slugs.join("/")}?v=${OG_VERSION}`,
    })),
    ...getProjectList().map((p) => ({
      path: `/projects/${p.id}`,
      lastModified: p.lastModified,
      changefreq: "monthly",
      priority: 0.7,
      image: `/projects/og?slug=${p.id}&v=${OG_VERSION}`,
    })),
  ];
}

const xml = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function toXml(list: Entry[]) {
  const now = new Date().toISOString();
  const urls = list
    .map((e) => {
      const lastmod = e.lastModified ? new Date(e.lastModified).toISOString() : now;
      const image = e.image ? `<image:image><image:loc>${xml(appConfig.url + e.image)}</image:loc></image:image>` : "";
      return `<url><loc>${xml(appConfig.url + e.path)}</loc><lastmod>${lastmod}</lastmod><changefreq>${e.changefreq}</changefreq><priority>${e.priority.toFixed(1)}</priority>${image}</url>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls}</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(toXml(entries()), {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
