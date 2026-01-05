import { Metadata } from "next";
import { appConfig } from "root/project.config";

export function generateMetadata({
  title,
  description,
  path,
  image,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
}): Metadata {
  return {
    title,
    description,
    metadataBase: new URL(appConfig.url + path),
    applicationName: appConfig.siteName,
    authors: appConfig.authors as unknown as { name: string; url?: string }[],
    alternates: {
      canonical: appConfig.url + path,
    },
    openGraph: {
      title,
      description,
      url: appConfig.url + path,
      images: image ? [image] : undefined,
      siteName: appConfig.siteName,
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
