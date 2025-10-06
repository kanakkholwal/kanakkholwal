import { GlowFillButton } from "@/components/animated/button.fill";
import { ButtonLink } from "@/components/utils/link";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FaMedium } from "react-icons/fa6";
import { appConfig } from "root/project.config";
import { getMediumPosts } from "~/api/medium";
import { generateMetadata } from "~/utils/seo";
import AnimatedMediumPosts from "./client";

export default async function MediumPage() {
  const posts = await getMediumPosts();
  const now = Date.now();

  return (
    <main className="mx-auto flex flex-col justify-center px-4 py-16 md:px-6 max-w-7xl">
      {/* Heading */}
      <div className="mx-auto">
        <h2 className="text-shadow-glow relative z-2 text-5xl font-medium tracking-tight sm:text-5xl md:text-6xl text-center max-w-2xl text-balance mx-auto mb-10">
          <p className="mb-3 font-mono text-xs font-normal tracking-widest text-black/80 uppercase md:text-sm dark:text-white/70">
            The Blog
          </p>
          <span className="font-instrument-serif">
            <span>Handpicked insights from</span>{" "}
            <span className="text-colorful animate-gradient-x italic pe-2">
              the pensieve
            </span>
          </span>
        </h2>
        <div className="flex justify-center mx-auto">
          <ButtonLink
            href={appConfig.social.medium}
            target="_blank"
            variant="dark"
            rounded="full"
            className="mx-auto"
            effect="shine"
            rel="noreferrer noopener"
          >
            <FaMedium />
            Checkout Medium Profile
            <ArrowUpRight />
          </ButtonLink>
        </div>
      </div>

      {/* Posts List */}
      <AnimatedMediumPosts posts={posts} now={now} />
      <div className="flex justify-center mx-auto">
        <GlowFillButton icon={ArrowUpRight}>
          <Link
            target="_blank"
            rel="noreferrer noopener"
            href={appConfig.social.medium}
          >
            <FaMedium className="size-6 inline-block mr-2" />
            Checkout Medium Profile
          </Link>
        </GlowFillButton>
      </div>
    </main>
  );
}

export const metadata = generateMetadata({
  title: "Blog",
  description:
    "Read Kanak's latest articles on web development, programming, and technology trends. Stay updated with insights and tutorials from his Medium blog.",
  url: "/blog",
  keywords: [
    "blog",
    "articles",
    "web development",
    "programming",
    "technology",
    "medium",
    "tutorials",
    "insights",
  ],
});
