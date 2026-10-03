import "@tanstack/react-start/server-only";
import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { docs } from "fumadocs-mdx:collections/server";
import { type DocMeta, toMeta } from "./content.types";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

type DocPage = InferPageType<typeof source>;

export function toDocMeta(page: DocPage): DocMeta {
  return { ...toMeta(page), slugs: page.slugs, url: page.url };
}

export function getPageImage(page: DocPage) {
  return `/og/docs/${[...page.slugs, "image.png"].join("/")}`;
}

/** Minutes at 200 wpm over the processed markdown. */
export async function getReadTime(page: DocPage): Promise<number> {
  const text = await page.data.getText("processed").catch(() => "");
  const words = text.split(/\s+/g).filter(Boolean).length || 500;
  return Math.max(1, Math.ceil(words / 200));
}
