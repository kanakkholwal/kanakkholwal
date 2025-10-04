import { Timeline } from "@/components/extended/timeline";
import { Metadata } from "next";
import { appConfig } from "root/project.config";
import { journey_data } from "~/data/journey";

export default function JourneyPage() {
    return <Timeline data={journey_data} />;
}

export const metadata: Metadata = {
    title: "My Developer Journey ",
    description:
        "Explore Kanak’s journey as a software engineer — from early coding days to mastering full-stack development with Next.js, AWS, Docker, and AI integration. A story of growth, challenges, and innovation.",
    alternates: {
        canonical: "/journey",
    },
    openGraph: {
        title: "My Developer Journey | Kanak",
        description:
            "A detailed look at Kanak’s evolution as a developer — experiences, milestones, and key projects that shaped his technical expertise.",
        url: `${appConfig.url}/journey`,
        siteName: "Kanak’s Portfolio",
        images: [
            {
                url: `${appConfig.url}/og/journey.png`,
                width: 1200,
                height: 630,
                alt: "Kanak’s Developer Journey",
            },
        ],
        locale: "en_US",
        type: "article",
    },
    twitter: {
        card: "summary_large_image",
        title: "My Developer Journey",
        description:
            "Discover Kanak’s developer journey — experiences, skills, and projects that define his career in tech.",
        creator: appConfig.social.twitter,
        // images: [`${appConfig.url}/og/journey.png`],
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
