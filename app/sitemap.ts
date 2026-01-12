import { source } from "@/lib/source";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    // TODO: Update this to your production URL
    const baseUrl = "https://kanakkholwal.eu.org";

    // 1. Get all dynamic MDX pages (Docs & Blog)
    const contentPages = source.getPages().map((page) => {
        // Determine priority based on content type
        const isDoc = page.url.startsWith("/docs");
        const priority = isDoc ? 0.8 : 0.7;
        const changeFrequency = isDoc ? "weekly" : "monthly";

        return {
            url: `${baseUrl}${page.url}`,
            lastModified: page.data.lastModified
                ? new Date(page.data.lastModified).toISOString()
                : new Date().toISOString(),
            changeFrequency: changeFrequency as "weekly" | "monthly",
            priority: priority,
        };
    });

    // 2. Define your static routes manually
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}`,
            lastModified: new Date().toISOString(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date().toISOString(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/docs`,
            lastModified: new Date().toISOString(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        // Add other static pages here (e.g., /projects, /about)
    ];

    // 3. Optional: Generate Category Indices dynamically if you want them indexed
    // (e.g., /docs/architecture, /docs/systems)
    const categories = new Set<string>();
    source.getPages().forEach((page) => {
        const parts = page.url.split("/");
        if (parts.length > 3 && parts[1] === "docs") {
            categories.add(parts[2]); // e.g. 'architecture'
        }
    });

    const categoryRoutes = Array.from(categories).map((category) => ({
        url: `${baseUrl}/docs/${category}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    return [...staticRoutes, ...categoryRoutes, ...contentPages];
}