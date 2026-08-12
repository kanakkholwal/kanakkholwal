"use client";

import { GlowFillButton } from "@/components/animated/button.fill";
import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { motion } from "framer-motion";
import { StyleSwap } from "@/components/animated/style-swap";
import { Serif, StoryReveal } from "@/components/application/story.frame";
import { ArrowUpRight, BookOpen, CalendarDays, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaMedium } from "react-icons/fa6";

const BLUR_FADE_DELAY = 0.04;

/** Serializable post — pubDate as ISO string, not Date object */
export type SerializablePost = {
  title: string;
  link: string;
  pubDate: string;
  snippet: string;
  thumbnail: string | null;
  tags: string[];
  readingTime: string;
};

type Props = {
  posts: SerializablePost[];
  now: number;
  mediumUrl: string;
};

export default function AnimatedMediumPosts({ posts, now, mediumUrl }: Props) {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );

  return (
    <StyleSwap swapKey={selectedStyle}>
      {selectedStyle === "minimal" ? (
        <MinimalBlog posts={posts} now={now} mediumUrl={mediumUrl} />
      ) : selectedStyle === "static" ? (
        <StaticBlog posts={posts} now={now} mediumUrl={mediumUrl} />
      ) : selectedStyle === "story" ? (
        <StoryBlog posts={posts} now={now} mediumUrl={mediumUrl} />
      ) : (
        <DynamicBlog posts={posts} now={now} mediumUrl={mediumUrl} />
      )}
    </StyleSwap>
  );
}


function MinimalBlog({ posts, now, mediumUrl }: Props) {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        {/* Header */}
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="mb-16 space-y-4">
            <p className="text-2xs font-mono uppercase tracking-widest text-muted-foreground">
              // the engineering log
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Blog
            </h1>
            <p className="text-sm text-muted-foreground font-mono">
              {posts.length} articles, published on Medium
            </p>
          </div>
        </BlurFade>

        {/* List */}
        <ol className="space-y-0 divide-y divide-border/60">
          {posts.map((post, i) => {
            const isRecent =
              now - new Date(post.pubDate).getTime() <
              30 * 24 * 60 * 60 * 1000;
            return (
              <BlurFade key={post.link} delay={BLUR_FADE_DELAY * (i + 2)}>
                <li>
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-start gap-5 py-5 hover:bg-muted/30 rounded transition-colors"
                  >
                    <span className="text-xs font-mono text-muted-foreground/40 w-6 text-right shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                          {post.title}
                        </h3>
                        {isRecent && (
                          <span className="text-2xs font-mono uppercase tracking-widest text-emerald-500">
                            new
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-2xs font-mono text-muted-foreground/50 uppercase tracking-widest">
                        <time>
                          {new Date(post.pubDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </time>
                        <span>&middot;</span>
                        <span>{post.readingTime}</span>
                      </div>
                    </div>
                    <ArrowUpRight className="size-4 text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                  </a>
                </li>
              </BlurFade>
            );
          })}
        </ol>

        {/* CTA */}
        <BlurFade delay={BLUR_FADE_DELAY * (posts.length + 3)}>
          <div className="mt-16 pt-8 border-t border-dashed border-border/50 flex items-center justify-between">
            <p className="text-xs font-mono text-muted-foreground">
              More on Medium →
            </p>
            <a
              href={mediumUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary transition-colors"
            >
              <FaMedium className="size-4" />
              Follow
            </a>
          </div>
        </BlurFade>
      </div>
    </main>
  );
}

function StaticBlog({ posts, now, mediumUrl }: Props) {
  return (
    <main className="min-h-screen w-full relative overflow-hidden">
      <div className="fixed inset-0 -z-50 h-full w-full bg-background opacity-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]" />

      <div className="mx-auto max-w-5xl px-6 md:px-12 py-24">
        {/* Header */}
        <BlurFade delay={BLUR_FADE_DELAY}>
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
              Thoughts on distributed systems, frontend architecture, and the
              evolving landscape of web development.
            </p>
          </div>
        </BlurFade>

        {/* Posts */}
        <div className="flex flex-col gap-8">
          {posts.map((post, i) => (
            <BlurFade key={post.link} delay={BLUR_FADE_DELAY * (i + 2)}>
              <PostCard post={post} now={now} />
            </BlurFade>
          ))}
        </div>

        {/* CTA */}
        <BlurFade delay={BLUR_FADE_DELAY * (posts.length + 3)}>
          <div className="flex justify-center mx-auto mt-24 pt-16 border-t border-border/50">
            <GlowFillButton icon={ArrowUpRight}>
              <Link
                target="_blank"
                rel="noreferrer noopener"
                href={mediumUrl}
              >
                <FaMedium className="size-5 inline-block mr-2" />
                Read more on Medium
              </Link>
            </GlowFillButton>
          </div>
        </BlurFade>
      </div>
    </main>
  );
}


function StoryBlog({ posts, mediumUrl }: Props) {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-28 md:pt-36">
      <StoryReveal>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Writing
        </p>
        <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tighter text-foreground md:text-5xl">
          Notes, in <Serif className="text-muted-foreground/80">long form</Serif>.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
          Everything I have taken the time to write down properly, mostly over
          on Medium. Distributed systems, frontend architecture, and whatever I
          happened to be wrestling with that week.
        </p>
      </StoryReveal>

      <div className="mt-14 space-y-6">
        {posts.map((post, i) => (
          <StoryReveal key={post.link} delay={Math.min(i * 0.05, 0.3)}>
            <a
              href={post.link}
              target="_blank"
              rel="noreferrer noopener"
              className="group block border-b border-border/40 pb-5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
                <span className="shrink-0 font-mono text-xs text-muted-foreground/70">
                  {new Date(post.pubDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {post.snippet.replace(/<[^>]*>?/gm, "")}
              </p>
            </a>
          </StoryReveal>
        ))}
      </div>

      <StoryReveal className="mt-14" delay={0.1}>
        <a
          href={mediumUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
        >
          Read more on Medium
          <ArrowUpRight className="size-3.5" />
        </a>
      </StoryReveal>
    </main>
  );
}

function DynamicBlog({ posts, now, mediumUrl }: Props) {
  const [featured, ...rest] = posts;

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      {/* Dot-grid */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Hero strip */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full border-b border-border/40 bg-background/60 backdrop-blur-md"
      >
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              The Engineering Log
            </p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-none">
              Insights from{" "}
              <span className="italic font-normal text-muted-foreground">
                the pensieve
              </span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Thoughts on distributed systems, frontend architecture, and the
              evolving landscape of web development.
            </p>
          </div>
          <div className="flex flex-col gap-1 shrink-0 text-right">
            <span className="text-4xl md:text-5xl font-bold font-mono text-foreground/10 leading-none select-none">
              {String(posts.length).padStart(2, "0")}
            </span>
            <span className="text-2xs font-mono uppercase tracking-widest text-muted-foreground">
              Articles
            </span>
          </div>
        </div>
      </motion.div>

      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        {/* Featured post */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14"
          >
            <p className="text-2xs font-mono uppercase tracking-widest text-muted-foreground mb-5 flex items-center gap-2">
              <span className="h-px w-4 bg-border inline-block" />
              Latest
            </p>
            <a
              href={featured.link}
              target="_blank"
              rel="noreferrer noopener"
              className="group grid md:grid-cols-[minmax(0,1fr)_360px] gap-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-primary/30 hover:bg-card transition-all duration-300 overflow-hidden relative"
            >
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-2xs font-mono uppercase tracking-widest text-muted-foreground/50">
                    <time>
                      {new Date(featured.pubDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                    <span>&middot;</span>
                    <span>{featured.readingTime}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug">
                    {featured.title}
                  </h2>
                  <p className="text-sm text-muted-foreground font-mono leading-relaxed line-clamp-3">
                    {featured.snippet.replace(/<[^>]*>?/gm, "")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-6">
                  {featured.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-2xs font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border border-border/50 text-muted-foreground group-hover:border-primary/30 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              {featured.thumbnail && (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-muted border border-border/40 order-first md:order-last">
                  <Image
                    alt={featured.title}
                    src={featured.thumbnail}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
            </a>
          </motion.div>
        )}

        {/* Rest grid */}
        {rest.length > 0 && (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xs font-mono uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2"
            >
              <span className="h-px w-4 bg-border inline-block" />
              More Articles
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post, i) => {
                const isRecent =
                  now - new Date(post.pubDate).getTime() <
                  30 * 24 * 60 * 60 * 1000;
                return (
                  <motion.div
                    key={post.link}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      delay: i * 0.06,
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex flex-col h-full rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 hover:border-primary/40 hover:bg-card transition-all duration-300 overflow-hidden relative"
                    >
                      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {post.thumbnail && (
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted border border-border/30 mb-4">
                          <Image
                            alt={post.title}
                            src={post.thumbnail}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {isRecent && (
                            <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-emerald-500/90 text-white text-2xs font-bold uppercase tracking-wider rounded">
                              New
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex flex-col flex-1 space-y-2">
                        <div className="flex items-center gap-2 text-2xs font-mono uppercase tracking-widest text-muted-foreground/50">
                          <time>
                            {new Date(post.pubDate).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric", year: "numeric" },
                            )}
                          </time>
                          <span>&middot;</span>
                          <span>{post.readingTime}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                          {post.title}
                        </h3>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
                        <div className="flex gap-1.5 flex-wrap">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-2xs font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-full border border-border/40 text-muted-foreground"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <ArrowUpRight className="size-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                      </div>
                    </a>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 pt-12 border-t border-border/40 flex justify-center"
        >
          <GlowFillButton icon={ArrowUpRight}>
            <Link target="_blank" rel="noreferrer noopener" href={mediumUrl}>
              <FaMedium className="size-5 inline-block mr-2" />
              Read more on Medium
            </Link>
          </GlowFillButton>
        </motion.div>
      </div>
    </main>
  );
}

/*  Shared PostCard (used by Static variant) */
function PostCard({
  post,
  now,
}: {
  post: SerializablePost;
  now: number;
}) {
  const isRecent =
    now - new Date(post.pubDate).getTime() < 30 * 24 * 60 * 60 * 1000;

  return (
    <a
      href={post.link}
      target="_blank"
      rel="noreferrer noopener"
      className="group relative grid md:grid-cols-[280px_1fr] gap-6 md:gap-8 p-6 rounded-3xl bg-card/30 hover:bg-card/80 border border-transparent hover:border-border/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] md:aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted border border-border/50">
        {post.thumbnail ? (
          <Image
            alt={post.title}
            src={post.thumbnail}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <span className="text-4xl font-mono opacity-10 font-bold">
              BLOG
            </span>
          </div>
        )}
        {isRecent && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-emerald-500/90 backdrop-blur-md text-white text-2xs font-bold uppercase tracking-wider rounded-md shadow-sm">
            New
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between py-1">
        <div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground mb-3">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              <time dateTime={new Date(post.pubDate).toISOString()}>
                {new Date(post.pubDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </div>
            <span className="h-3 w-[1px] bg-border" />
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-indigo-500" />
              <span>{post.readingTime || "5 min read"}</span>
            </div>
          </div>

          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors mb-3">
            {post.title}
          </h3>

          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 md:line-clamp-3">
            {post.snippet.replace(/<[^>]*>?/gm, "")}
          </p>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-md px-2 py-0.5 text-2xs font-mono font-normal bg-background border border-border/50 text-muted-foreground group-hover:border-primary/20 transition-colors"
              >
                #{tag}
              </Badge>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-1 text-xs font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            Read Article <ArrowUpRight className="size-3" />
          </div>
        </div>
      </div>
    </a>
  );
}

