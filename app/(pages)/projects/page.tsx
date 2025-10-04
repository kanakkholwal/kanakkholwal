import { Metadata } from "next";
import { appConfig } from "root/project.config";
import ProjectsShowcase from "./client";

export const metadata: Metadata = {
  title: "Projects Showcase",
  description:
    "Explore Kanak’s most impactful and innovative projects — full-stack apps, AI integrations, and cloud-native solutions built with Next.js, AWS, Docker, and GCP.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects Showcase | Kanak",
    description:
      "A curated selection of Kanak’s top software projects showcasing expertise in Next.js, AI, cloud, and scalable system design.",
    url: `${appConfig.url}/projects`,
    siteName: "Kanak’s Portfolio",
    images: [
      {
        url: `${appConfig.url}/og/projects.png`,
        width: 1200,
        height: 630,
        alt: "Kanak’s Projects Showcase",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects Showcase | Kanak",
    description:
      "Discover Kanak’s most innovative projects — modern web apps, AI systems, and scalable cloud solutions.",
    creator: appConfig.social.twitter,
    images: [`${appConfig.url}/og/projects.png`],
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

export default function ProjectsPage() {
  return <ProjectsShowcase />;
}
