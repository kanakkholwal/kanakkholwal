import { Metadata } from "next";
import { appConfig } from "root/project.config";

export function generateMetadata({
  title,
  description,
  url,
  image,
  keywords,
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  keywords?: string[];
}): Metadata {
  return {
    title,
    description,
    metadataBase: new URL(appConfig.url + url),
    openGraph: {
      title,
      description,
      url,
      images: image ? [image] : undefined,
      siteName: title,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
    other: {
      keywords: (keywords || []).join(", "),
      robots: "index,follow",
    },
  } as Metadata;
}
