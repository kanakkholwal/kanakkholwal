"use client";

import DocsSearch from "@/components/docs.search";
import { Icon } from "@/components/icons";
import BlurFade from "@/components/magicui/blur-fade";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Terminal } from "lucide-react";
import Link from "next/link";

const BLUR_FADE_DELAY = 0.04;

export interface DocPost {
    url: string;
    data: {
        title: string;
        description?: string;
        lastModified?: string | Date;
        category?: string;
        tags?: string[];
    };
}

interface DocsPageClientProps {
    posts: DocPost[];
    latestPostDate: string;
}

export default function DocsPageClient({
    posts,
    latestPostDate,
}: DocsPageClientProps) {
    const [selectedStyle] = useStorage<StylingModel>(
        "styling.model",
        StyleModels[0].id,
    );

    return (
        <AnimatePresence mode="wait" initial={false}>
            {selectedStyle === "minimal" ? (
                <motion.div
                    key="docs-minimal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <MinimalDocs posts={posts} latestPostDate={latestPostDate} />
                </motion.div>
            ) : selectedStyle === "static" ? (
                <motion.div
                    key="docs-static"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                >
                    <StaticDocs posts={posts} latestPostDate={latestPostDate} />
                </motion.div>
            ) : (
                <motion.div
                    key="docs-dynamic"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                >
                    <DynamicDocs posts={posts} latestPostDate={latestPostDate} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function MinimalDocs({ posts, latestPostDate }: DocsPageClientProps) {
    return (
        <main className="min-h-screen w-full">
            <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
                {/* Header */}
                <BlurFade delay={BLUR_FADE_DELAY}>
                    <div className="mb-16 space-y-4">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              // research &amp; insights
                        </p>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-metallic">
                            Documentation
                        </h1>
                        <p className="text-sm text-muted-foreground font-mono">
                            {posts.length} entries &mdash; last modified {latestPostDate}
                        </p>
                    </div>
                </BlurFade>

                {/* Search */}
                <BlurFade delay={BLUR_FADE_DELAY * 2}>
                    <div className="mb-10">
                        <DocsSearch />
                    </div>
                </BlurFade>

                {/* List */}
                {posts.length === 0 ? (
                    <BlurFade delay={BLUR_FADE_DELAY * 3}>
                        <EmptyState />
                    </BlurFade>
                ) : (
                    <ol className="space-y-0 divide-y divide-border/60">
                        {posts.map((post, i) => (
                            <BlurFade key={post.url} delay={BLUR_FADE_DELAY * (i + 3)}>
                                <li>
                                    <Link
                                        href={post.url}
                                        className="group flex items-start gap-5 py-5 hover:bg-muted/30 rounded transition-colors"
                                    >
                                        <span className="text-xs font-mono text-muted-foreground/40 w-6 text-right shrink-0 mt-0.5">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                                                {post.data.title}
                                            </h3>
                                            {post.data.description && (
                                                <p className="text-xs text-muted-foreground line-clamp-2 font-mono leading-relaxed">
                                                    {post.data.description}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest pt-1">
                                                {post.data.lastModified && (
                                                    <time>
                                                        {new Date(
                                                            post.data.lastModified,
                                                        ).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })}
                                                    </time>
                                                )}
                                                {post.data.category && (
                                                    <>
                                                        <span>&middot;</span>
                                                        <span>{post.data.category}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <ArrowUpRight className="size-4 text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                                    </Link>
                                </li>
                            </BlurFade>
                        ))}
                    </ol>
                )}
            </div>
        </main>
    );
}


function StaticDocs({ posts, latestPostDate }: DocsPageClientProps) {
    return (
        <main className="min-h-screen w-full relative mt-20">
            <div className="fixed inset-0 z-0 pointer-events-none h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="relative z-10 max-w-app mx-auto px-4 md:px-8 py-12 md:py-20">
                {/* Header */}
                <BlurFade delay={BLUR_FADE_DELAY}>
                    <div className="mb-12 space-y-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-primary text-sm font-mono tracking-widest uppercase">
                                <Terminal className="size-4" />
                                <span>/ var / logs / engineering</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
                                Research &amp; <span className="text-metallic">Insights</span>
                            </h1>
                        </div>

                        <div className="w-full border-y border-border py-3 flex flex-wrap gap-x-8 gap-y-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                            <span className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                System Status: Online
                            </span>
                            <span>Total Entries: {posts.length}</span>
                            <span>Last Update: {latestPostDate}</span>
                            <span className="hidden md:inline">Region: AP-SOUTH-1</span>
                        </div>
                    </div>
                </BlurFade>

                {/* Toolbar */}
                <BlurFade delay={BLUR_FADE_DELAY * 2}>
                    <div className="flex gap-6 mb-12 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Icon name="book" />
                            <span className="shrink-1 text-sm font-mono font-semibold tracking-widest uppercase text-metallic">
                                ALL_LOGS
                            </span>
                        </div>
                        <div className="relative group">
                            <DocsSearch />
                        </div>
                    </div>
                </BlurFade>

                {/* Grid */}
                {posts.length === 0 ? (
                    <BlurFade delay={BLUR_FADE_DELAY * 3}>
                        <EmptyState />
                    </BlurFade>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post, i) => (
                            <BlurFade key={post.url} delay={BLUR_FADE_DELAY * (i + 3)}>
                                <Link
                                    href={post.url}
                                    className="group flex flex-col justify-between h-full bg-card shadow space-y-6 p-4 rounded-lg"
                                >
                                    <div className="flex flex-col space-y-4">
                                        <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground/60">
                                            {post.data.lastModified && (
                                                <time className="text-foreground font-medium">
                                                    {new Date(
                                                        post.data.lastModified,
                                                    ).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </time>
                                            )}
                                            <span>/</span>
                                            <span>{post.data.category}</span>
                                        </div>

                                        <h3 className="text-xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                                            {post.data.title}
                                        </h3>

                                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 font-mono">
                                            {post.data.description}
                                        </p>
                                    </div>

                                    <div className="pt-2 flex items-center justify-between border-t border-border/40 mt-auto">
                                        <div className="flex gap-3">
                                            {post.data.tags?.slice(0, 2).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/80 group-hover:text-foreground transition-colors"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            Read
                                            <ArrowUpRight className="size-4" />
                                        </div>
                                    </div>
                                </Link>
                            </BlurFade>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}


function DynamicDocs({ posts, latestPostDate }: DocsPageClientProps) {
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
                className="w-full"
            >
                <div className="mx-auto max-w-app px-6 py-14 md:py-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-3">
                        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            Research &amp; Insights
                        </p>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-none">
                            Engineering{" "}
                            <span className="italic font-normal text-muted-foreground">
                                Logs
                            </span>
                        </h1>
                        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                            Deep-dives, case studies, and technical breakdowns from the build
                            process.
                        </p>
                    </div>

                    <div className="flex flex-col gap-1 text-right">
                        <span className="text-4xl md:text-5xl font-bold font-mono text-foreground/10 leading-none select-none">
                            {String(posts.length).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                            Total Entries
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground/60">
                            Last: {latestPostDate}
                        </span>
                    </div>
                </div>
            </motion.div>

            <div className="mx-auto max-w-app px-6 py-12 md:py-16">
                {/* Search + label row */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center justify-between mb-12"
                >
                    <div className="flex items-center gap-2">
                        <span className="h-px w-6 bg-border" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                            All Entries
                        </span>
                    </div>
                    <DocsSearch />
                </motion.div>

                {/* Cards */}
                {posts.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post, i) => (
                            <motion.div
                                key={post.url}
                                initial={{ opacity: 0, y: 32 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{
                                    delay: i * 0.06,
                                    duration: 0.55,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            >
                                <Link
                                    href={post.url}
                                    className="group flex flex-col h-full rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 hover:border-primary/40 hover:bg-card transition-all duration-300 overflow-hidden relative"
                                >
                                    {/* Top accent line */}
                                    <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="flex flex-col space-y-3 flex-1">
                                        {/* Meta row */}
                                        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50">
                                            {post.data.lastModified && (
                                                <time>
                                                    {new Date(post.data.lastModified).toLocaleDateString(
                                                        "en-US",
                                                        { month: "short", day: "numeric", year: "numeric" },
                                                    )}
                                                </time>
                                            )}
                                            {post.data.category && (
                                                <>
                                                    <span>&middot;</span>
                                                    <span>{post.data.category}</span>
                                                </>
                                            )}
                                        </div>

                                        <h3 className="text-base font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">
                                            {post.data.title}
                                        </h3>

                                        {post.data.description && (
                                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 font-mono">
                                                {post.data.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-5 pt-4 border-t border-border/30 flex items-center justify-between">
                                        <div className="flex gap-2 flex-wrap">
                                            {post.data.tags?.slice(0, 2).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full border border-border/50 text-muted-foreground group-hover:border-primary/30 group-hover:text-foreground transition-colors"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                                            Read
                                            <ArrowUpRight className="size-3.5 -translate-x-0.5 translate-y-0.5 group-hover:translate-x-0 group-hover:-translate-y-0 transition-transform duration-200" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

/* ─── Shared ───────────────────────────────────────────── */
function EmptyState() {
    return (
        <div className="w-full py-20 flex flex-col items-center justify-center border border-dashed border-border rounded-xl bg-card/20">
            <Terminal className="size-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-bold font-mono">NO_LOGS_FOUND</h3>
            <p className="text-muted-foreground">
                Initialize sequence to write first entry.
            </p>
        </div>
    );
}
