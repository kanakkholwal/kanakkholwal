import { GlowFillButton } from "@/components/animated/button.fill";
import { ButtonLink } from "@/components/utils/link";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FaMedium } from "react-icons/fa6";
import { appConfig } from "root/project.config";
import { parseStringPromise } from "xml2js";
import { calculateReadingTime } from "~/utils/string";
import AnimatedMediumPosts, { PostType } from "./client";


async function getMediumPosts(): Promise<PostType[]> {
    const rssUrl = `https://medium.com/feed/@${appConfig.usernames.medium}`;
    const res = await fetch(rssUrl, { next: { revalidate: 3600 } });
    const xml = await res.text();
    const json = await parseStringPromise(xml);

    return json.rss.channel[0].item.map((item: any) => {
        const content = item["content:encoded"]?.[0] || item.description[0];

        // Strip HTML tags for snippet
        const snippet = content
            .replace(/<[^>]+>/g, "")
            .trim()
            .split(/\s+/)
            .slice(0, 50)
            .join(" ") + "...";

        // Extract first image if it matches cdn or common extensions
        const imgMatch = content.match(
            /<img[^>]+src="([^">]*(cdn-images|\.png|\.jpe?g|\.webp|\.gif))"[^>]*>/i
        );
        const thumbnail = imgMatch ? imgMatch[1] : null;

        // Extract categories/tags
        const tags = (item.category || []).map((c: any) =>
            typeof c === "string" ? c : c._
        );

        return {
            title: item.title[0],
            link: item.link[0],
            pubDate: new Date(item.pubDate),
            snippet,
            thumbnail,
            tags,
            readingTime: calculateReadingTime(content as string),
        } as PostType;
    });
}

export default async function MediumPage() {
    const posts = await getMediumPosts();
    const now = Date.now();

    return (
        <main className="mx-auto flex flex-col justify-center px-4 py-16 md:px-6 max-w-6xl">
            {/* Heading */}
            <div className="mx-auto">
                <h2
                    className="relative z-2 text-5xl font-medium tracking-tight sm:text-5xl md:text-6xl text-center max-w-2xl text-balance mx-auto mb-10"
                    style={{
                        textShadow:
                            "rgba(255, 255, 255, 0.05) 0px 4px 8px, rgba(255, 255, 255, 0.25) 0px 8px 30px",
                    }}
                >
                    <p className="mb-3 font-mono text-xs font-normal tracking-widest text-black/80 uppercase md:text-sm dark:text-white/70">
                        The Blog
                    </p>
                    <span className="font-instrument-serif">
                        <span>Handpicked insights from</span>{" "}
                        <span className="text-colorfull animate-gradient-x italic pe-2">
                            the pensieve
                        </span>
                    </span>
                </h2>
                <div className="flex justify-center mx-auto">

                    <ButtonLink href={appConfig.social.medium} target="_blank" variant="dark" rounded="full" className="mx-auto" effect="shine"
                        rel="noreferrer noopener">
                        <FaMedium />
                        Checkout Medium Profile
                        <ArrowUpRight />
                    </ButtonLink>
                </div>
            </div>

            {/* Posts List */}
            <AnimatedMediumPosts posts={posts} now={now} />
            <div className="flex justify-center mx-auto">
                <GlowFillButton icon={ArrowUpRight} >
                    <Link target="_blank"
                        rel="noreferrer noopener" href={appConfig.social.medium}>
                        <FaMedium className="size-6 inline-block mr-2" />
                        Checkout Medium Profile
                    </Link>
                </GlowFillButton>

            </div>
        </main>
    );
}

