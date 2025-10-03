
import { ShimmeringText } from "@/components/animated/text.shimmer";
import { Metadata } from "next";
import { appConfig } from "root/project.config";
import { getAllResources } from "~/lib/markdown/mdx";
import { ResourcesList } from "./client";

// Site constants (should match those in your blog post page)

export const metadata: Metadata = {
  title: "Resources ",
  description:
    "Explore our comprehensive collection of articles, experiences, and case studies.",
  alternates: {
    canonical: "/resources",
  },
  openGraph: {
    title: "Resources  ",
    description:
      "Explore our comprehensive collection of articles, experiences, and case studies.",
    url: `${appConfig.url}/resources`,
    type: "website",
    siteName: appConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "Resources ",
    description:
      "Explore our comprehensive collection of articles, experiences, and case studies.",
    creator: appConfig.social.twitter,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
};

export default async function Page() {
  const resources = await getAllResources();

  // Structured data for CollectionPage
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Resources",
    description:
      "Explore our comprehensive collection of articles, experiences, and case studies.",
    url: `${appConfig.url}/resources`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: resources.map((resource, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": resource.type === "articles" ? "Article" : "CreativeWork",
          name: resource.title,
          url: `${appConfig.url}/resources/${resource.type}/${resource.slug}`,
          description: resource.summary,
          datePublished: new Date(resource.date).toISOString(),
          image: resource.coverImage
            ? {
                "@type": "ImageObject",
                url: resource.coverImage,
              }
            : undefined,
          articleSection: resource.category,
          keywords: resource.tags?.join(", ") || "",
        },
      })),
    },
  };
  const allCategories = [...new Set(resources.map((r) => r.type))] as string[];
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    <ShimmeringText className="text-3xl font-bold mb-8 text-center"
    text="Resources"
    />
      <ResourcesList resources={resources} />
    </>
  );
}
