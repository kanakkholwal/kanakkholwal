"use client";

import { Icon } from "@/components/icons";
import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const BLUR_FADE_DELAY = 0.04;

export interface ArticleData {
    title: string;
    description?: string;
    category: string;
    author?: string;
    tags?: string[];
    lastModified?: string | null;
    readTime: number;
}

interface ArticlePageClientProps {
    article: ArticleData;
    /** Rendered MDX content */
    children: React.ReactNode;
    /** TOC rendered inline (fumadocs InlineTOC) */
    toc: React.ReactNode;
    /** Other articles cards (fumadocs Cards) */
    otherArticles: React.ReactNode;
}

export default function ArticlePageClient({
    article,
    children,
    toc,
    otherArticles,
}: ArticlePageClientProps) {
    const [selectedStyle] = useStorage<StylingModel>(
        "styling.model",
        StyleModels[0].id,
    );

    return (
        <AnimatePresence mode="wait" initial={false}>
            {selectedStyle === "minimal" ? (
                <motion.div
                    key="article-minimal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <MinimalArticle
                        article={article}
                        toc={toc}
                        otherArticles={otherArticles}
                    >
                        {children}
                    </MinimalArticle>
                </motion.div>
            ) : selectedStyle === "static" ? (
                <motion.div
                    key="article-static"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                >
                    <StaticArticle
                        article={article}
                        toc={toc}
                        otherArticles={otherArticles}
                    >
                        {children}
                    </StaticArticle>
                </motion.div>
            ) : (
                <motion.div
                    key="article-dynamic"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                >
                    <DynamicArticle
                        article={article}
                        toc={toc}
                        otherArticles={otherArticles}
                    >
                        {children}
                    </DynamicArticle>
                </motion.div>
            )}
        </AnimatePresence>
    );
}


function MinimalArticle({
    article,
    children,
    toc,
    otherArticles,
}: ArticlePageClientProps) {
    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
                {/* Breadcrumb */}
                <BlurFade delay={BLUR_FADE_DELAY}>
                    <Link
                        href="/docs"
                        className="group inline-flex items-center text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mb-12"
                    >
                        <ArrowLeft className="mr-2 size-3.5 group-hover:-translate-x-1 transition-transform" />
                        docs / {article.category.toLowerCase()}
                    </Link>
                </BlurFade>

                {/* Header */}
                <BlurFade delay={BLUR_FADE_DELAY * 2}>
                    <header className="mb-12 space-y-5">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-[1.15]">
                            {article.title}
                        </h1>
                        {article.description && (
                            <p className="text-base text-muted-foreground font-mono leading-relaxed">
                                {article.description}
                            </p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-muted-foreground pt-2 border-t border-dashed border-border/50">
                            {article.author && <span>{article.author}</span>}
                            {article.lastModified && (
                                <time>
                                    {new Date(article.lastModified).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </time>
                            )}
                            <span>{article.readTime} min read</span>
                        </div>
                    </header>
                </BlurFade>

                {/* Inline TOC on mobile */}
                <BlurFade delay={BLUR_FADE_DELAY * 3}>
                    <div className="mb-8 text-sm">{toc}</div>
                </BlurFade>

                {/* Content */}
                <BlurFade delay={BLUR_FADE_DELAY * 4}>
                    <article
                        className={cn(
                            "prose dark:prose-invert max-w-none",
                            "prose-headings:font-mono prose-headings:tracking-tight prose-headings:font-bold",
                            "prose-p:font-mono prose-p:leading-6 prose-p:text-zinc-600 dark:prose-p:text-zinc-300",
                            "prose-li:font-mono",
                            "[&_a[data-card].peer]:no-underline",
                        )}
                    >
                        {children}
                    </article>
                </BlurFade>

                {/* Footer */}
                <BlurFade delay={BLUR_FADE_DELAY * 5}>
                    <div className="mt-16 pt-8 border-t border-border flex justify-between items-center text-xs font-mono text-muted-foreground">
                        {article.lastModified && (
                            <span>
                                Updated:{" "}
                                <span className="text-foreground">
                                    {new Date(article.lastModified).toISOString().split("T")[0]}
                                </span>
                            </span>
                        )}
                        <Link
                            href="/docs"
                            className="text-sm font-medium hover:underline underline-offset-4 text-foreground"
                        >
                            ← Back to Index
                        </Link>
                    </div>
                </BlurFade>

                {/* Other articles */}
                <BlurFade delay={BLUR_FADE_DELAY * 6}>
                    <div className="mt-16">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-5">
              // more entries
                        </p>
                        {otherArticles}
                    </div>
                </BlurFade>
            </div>
        </main>
    );
}


function StaticArticle({
    article,
    children,
    toc,
    otherArticles,
}: ArticlePageClientProps) {
    return (
        <main className="min-h-screen relative mt-20">
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
                {/* Breadcrumb */}
                <div className="mb-8 md:mb-12">
                    <Link
                        href="/docs"
                        className="group inline-flex items-center text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="mr-2 size-4 group-hover:-translate-x-1 transition-transform" />
                        / INDEX / DOCS / {article.category.toUpperCase()}
                    </Link>
                </div>

                {/* Header */}
                <header className="mb-16 border-b border-border/60 pb-12">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
                        {article.title}
                    </h1>

                    {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            {article.tags.map((tag) => (
                                <Badge key={tag} className="whitespace-nowrap">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-5xl font-mono">
                        {article.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 mt-8 pt-8 border-t border-dashed border-border/50 text-sm font-mono text-muted-foreground">
                        {article.author && (
                            <>
                                <div className="flex items-center gap-2">
                                    <Icon name="person-speaking" className="size-4 text-primary" />
                                    <span className="text-foreground font-medium">
                                        {article.author}
                                    </span>
                                </div>
                                <div className="h-4 w-px bg-border" />
                            </>
                        )}
                        {article.lastModified && (
                            <>
                                <div className="flex items-center gap-2">
                                    <Icon name="calendar" className="size-4" />
                                    <time
                                        dateTime={new Date(article.lastModified).toISOString()}
                                    >
                                        {new Date(article.lastModified).toLocaleDateString(
                                            "en-US",
                                            { year: "numeric", month: "long", day: "numeric" },
                                        )}
                                    </time>
                                </div>
                                <div className="h-4 w-px bg-border" />
                            </>
                        )}
                        <div className="flex items-center gap-2">
                            <Icon name="clock" className="size-4" />
                            <span>{article.readTime} min read</span>
                        </div>
                    </div>
                </header>

                {/* 2-col body */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12">
                    <article className="min-w-0">
                        <div className="lg:hidden mb-8">{toc}</div>
                        <div
                            className={cn(
                                "prose dark:prose-invert max-w-none",
                                "prose-headings:font-mono prose-headings:tracking-tight prose-headings:font-bold",
                                "prose-p:font-mono prose-p:leading-6 prose-p:text-zinc-600 dark:prose-p:text-zinc-300",
                                "prose-li:font-mono",
                                "[&_a[data-card].peer]:no-underline",
                            )}
                        >
                            {children}
                        </div>

                        <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
                            <div className="text-xs font-mono text-muted-foreground">
                                LAST UPDATED:{" "}
                                <span className="text-foreground">
                                    {article.lastModified
                                        ? new Date(article.lastModified)
                                            .toISOString()
                                            .split("T")[0]
                                        : "—"}
                                </span>
                            </div>
                            <Link
                                href="/docs"
                                className="text-sm font-medium hover:underline underline-offset-4"
                            >
                                ← Back to Index
                            </Link>
                        </div>
                    </article>

                    {/* Sticky sidebar */}
                    <aside className="hidden lg:block relative">
                        <div className="sticky top-24 space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    On This Page
                                </h3>
                                <div className="text-sm">{toc}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                                <p className="text-xs font-medium text-muted-foreground mb-2">
                                    Like this engineering deep dive?
                                </p>
                                <Link
                                    href="/contact"
                                    className="text-xs font-bold text-primary hover:underline"
                                >
                                    I&apos;m open for opportunities →
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Other articles */}
                <div className="mt-12">
                    <h5 className="font-semibold text-metallic text-lg mb-5 flex items-center gap-2">
                        <Icon name="book" className="size-5 text-primary" />
                        Other articles
                    </h5>
                    {otherArticles}
                </div>
            </div>
        </main>
    );
}


function DynamicArticle({
    article,
    children,
    toc,
    otherArticles,
}: ArticlePageClientProps) {
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
                className="w-full border-b border-border/40"
            >
                <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
                    {/* Breadcrumb */}
                    <Link
                        href="/docs"
                        className="group inline-flex items-center text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mb-8"
                    >
                        <ArrowLeft className="mr-2 size-3.5 group-hover:-translate-x-1 transition-transform" />
                        / docs / {article.category.toLowerCase()}
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end">
                        <div className="space-y-4">
                            {article.tags && article.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {article.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border border-border/50 text-muted-foreground"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground leading-[1.0]">
                                {article.title}
                            </h1>
                            {article.description && (
                                <p className="text-base md:text-lg text-muted-foreground max-w-2xl font-mono leading-relaxed">
                                    {article.description}
                                </p>
                            )}
                        </div>

                        {/* Meta pill cluster */}
                        <div className="flex flex-col gap-2 text-right lg:text-right shrink-0">
                            {article.author && (
                                <span className="text-sm font-medium text-foreground">
                                    {article.author}
                                </span>
                            )}
                            {article.lastModified && (
                                <time className="text-xs font-mono text-muted-foreground">
                                    {new Date(article.lastModified).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </time>
                            )}
                            <span className="text-xs font-mono text-muted-foreground">
                                {article.readTime} min read
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Body */}
            <div className="mx-auto max-w-7xl px-6 py-14">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12">
                    {/* Article */}
                    <motion.article
                        className="min-w-0"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Mobile TOC */}
                        <div className="lg:hidden mb-8 p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm text-sm">
                            {toc}
                        </div>

                        <div
                            className={cn(
                                "prose dark:prose-invert max-w-none",
                                "prose-headings:font-mono prose-headings:tracking-tight prose-headings:font-bold",
                                "prose-p:font-mono prose-p:leading-6 prose-p:text-zinc-600 dark:prose-p:text-zinc-300",
                                "prose-li:font-mono",
                                "[&_a[data-card].peer]:no-underline",
                            )}
                        >
                            {children}
                        </div>

                        {/* Footer */}
                        <div className="mt-16 pt-8 border-t border-border/40 flex justify-between items-center">
                            <div className="text-xs font-mono text-muted-foreground">
                                {article.lastModified && (
                                    <>
                                        LAST UPDATED:{" "}
                                        <span className="text-foreground">
                                            {new Date(article.lastModified)
                                                .toISOString()
                                                .split("T")[0]}
                                        </span>
                                    </>
                                )}
                            </div>
                            <Link
                                href="/docs"
                                className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                                Back to Index
                            </Link>
                        </div>
                    </motion.article>

                    {/* Sticky glass sidebar */}
                    <motion.aside
                        className="hidden lg:block"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="sticky top-24 space-y-6">
                            {/* TOC card */}
                            <div className="p-5 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm space-y-3">
                                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                                    On This Page
                                </p>
                                <div className="text-sm">{toc}</div>
                            </div>

                            {/* CTA card */}
                            <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-sm space-y-3">
                                <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                                    Like this engineering deep dive?
                                </p>
                                <Link
                                    href="/contact"
                                    className="group inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline underline-offset-4"
                                >
                                    I&apos;m open for opportunities
                                    <ArrowUpRight className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </motion.aside>
                </div>

                {/* Other articles */}
                <motion.div
                    className="mt-16"
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/40">
                        <span className="text-2xl font-bold font-mono text-muted-foreground/20 select-none leading-none">
                            →
                        </span>
                        <div>
                            <h5 className="font-semibold text-foreground">Other articles</h5>
                            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                                Keep reading
                            </p>
                        </div>
                    </div>
                    {otherArticles}
                </motion.div>
            </div>
        </main>
    );
}
