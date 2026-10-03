import { getProjectList } from "@/lib/project.source";
import { source } from "@/lib/source";
import { createFileRoute } from "@tanstack/react-router";
import { appConfig } from "root/project.config";

type Entry = { path: string; lastModified?: Date | string; changefreq: string; priority: number };

const STATIC_ROUTES: Entry[] = [
  { path: "", changefreq: "daily", priority: 1.0 },
  { path: "/blog", changefreq: "daily", priority: 0.9 },
  { path: "/docs", changefreq: "weekly", priority: 0.9 },
  { path: "/projects", changefreq: "weekly", priority: 0.9 },
  { path: "/journey", changefreq: "monthly", priority: 0.7 },
  { path: "/stats", changefreq: "daily", priority: 0.6 },
  { path: "/contact", changefreq: "yearly", priority: 0.6 },
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
    })),
    ...getProjectList().map((p) => ({
      path: `/projects/${p.id}`,
      lastModified: p.lastModified,
      changefreq: "monthly",
      priority: 0.7,
    })),
  ];
}

function toXml(list: Entry[]) {
  const now = new Date().toISOString();
  const urls = list
    .map(
      (e) =>
        `<url><loc>${appConfig.url}${e.path}</loc><lastmod>${e.lastModified ? new Date(e.lastModified).toISOString() : now}</lastmod><changefreq>${e.changefreq}</changefreq><priority>${e.priority.toFixed(1)}</priority></url>`,
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
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
