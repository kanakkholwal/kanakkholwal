import { GlowFillButton } from "@/components/animated/button.fill";
import { ArrowUpRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { FaMedium } from "react-icons/fa6";
import { appConfig } from "root/project.config";
import { getMediumPosts } from "~/api/medium";
import { generateMetadata } from "~/utils/seo";
import AnimatedMediumPosts from "./client";

export const metadata = generateMetadata({
  title: "Blog ",
  description: "Technical deep dives, tutorials, and thoughts on software engineering.",
  url: "/blog",
});

export default async function MediumPage() {
  const posts = await getMediumPosts();
  const now = Date.now();

  return (
    <main className="min-h-screen w-full relative overflow-hidden">
      {/* Background Texture */}
      <div className="fixed inset-0 -z-50 h-full w-full bg-background opacity-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)" />

      <div className="mx-auto max-w-5xl px-6 md:px-12 py-24">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col items-center text-center space-y-8 mb-24">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-border/50 text-xs font-mono text-muted-foreground uppercase tracking-widest backdrop-blur-md">
             <BookOpen className="size-3" />
             The Engineering Log
          </span>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground leading-[1.1]">
            Handpicked insights from
            <br />
            <span className="text-colorful-titanium italic">
              the pensieve.
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
             Thoughts on distributed systems, frontend architecture, and the evolving landscape of web development.
          </p>
        </div>

        {/* --- POSTS LIST --- */}
        <AnimatedMediumPosts posts={posts} now={now} />

        {/* --- FOOTER CTA --- */}
        <div className="flex justify-center mx-auto mt-24 pt-16 border-t border-border/50">
          <GlowFillButton icon={ArrowUpRight}>
            <Link
              target="_blank"
              rel="noreferrer noopener"
              href={appConfig.social.medium}
            >
              <FaMedium className="size-5 inline-block mr-2" />
              Read more on Medium
            </Link>
          </GlowFillButton>
        </div>

      </div>
    </main>
  );
}