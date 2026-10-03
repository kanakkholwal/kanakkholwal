import { appConfig } from "root/project.config";

type Meta = Record<string, string>;

/** Route `head()` payload replacing Next's metadata API: title template, canonical, Open Graph and Twitter tags. */
export function seo({
  title,
  description,
  path,
  image,
  keywords,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
}) {
  const trimmed = title.trim();
  const fullTitle = trimmed.includes(appConfig.displayName) ? trimmed : `${trimmed} | ${appConfig.displayName}`;
  const url = appConfig.url + path;
  const imageUrl = image && (image.startsWith("http") ? image : appConfig.url + image);

  const meta: Meta[] = [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:site_name", content: appConfig.siteName },
    { property: "og:type", content: type },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "robots", content: "index,follow" },
  ];
  if (imageUrl) {
    meta.push({ property: "og:image", content: imageUrl }, { name: "twitter:image", content: imageUrl });
  }
  if (keywords?.length) meta.push({ name: "keywords", content: keywords.join(", ") });

  return { meta, links: [{ rel: "canonical", href: url }] };
}
