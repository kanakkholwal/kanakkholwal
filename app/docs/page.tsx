import { source } from "@/lib/source";
import { ArrowUpRight, Terminal } from "lucide-react";
import Link from "next/link";
import DefaultSearchDialog from "./client";

export default function BlogIndexPage() {
    // 1. Fetch and Sort Pages
    const posts = source.getPages().sort((a, b) => {
        return new Date(b.data.lastModified ?? 0).getTime() - new Date(a.data.lastModified ?? 0).getTime();
    });

    // 2. Extract Categories (Tags)
    const allTags = Array.from(new Set(posts.flatMap(post => post.data.tags || [])));
    const latestPostDate = posts[0]?.data.lastModified ? new Date(posts[0].data.lastModified).toLocaleDateString() : "N/A";

    return (
        <main className="min-h-screen w-full relative">

            {/* Background Grid */}
            <div className="fixed inset-0 z-0 pointer-events-none h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">

                {/* --- HEADER: SYSTEM STATUS STYLE --- */}
                <div className="mb-12 space-y-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-primary text-sm font-mono tracking-widest uppercase">
                            <Terminal className="size-4" />
                            <span>/ var / logs / engineering</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
                            Research & <span className="text-muted-foreground">Insights</span>
                        </h1>
                    </div>

                    {/* Stats Bar */}
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

                {/* --- CONTROLS: SEARCH & FILTER --- */}
                <div className="flex flex-col md:flex-row gap-6 mb-12 items-start md:items-center justify-between">
                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/blog"
                            className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-bold font-mono border border-primary transition-all hover:opacity-90"
                        >
                            ALL_LOGS
                        </Link>
                        {allTags.map(tag => (
                            <Link
                                key={tag}
                                href={`/blog/tags/${tag}`} // You'd need to build this route or use client-side filtering
                                className="px-3 py-1.5 rounded-md bg-secondary/50 text-secondary-foreground text-xs font-medium font-mono border border-border hover:border-primary/50 hover:text-primary transition-colors uppercase"
                            >
                                {tag}
                            </Link>
                        ))}
                    </div>

                    {/* Mock Search Input */}
                    <div className="relative group w-full md:w-64">
                        <DefaultSearchDialog />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link
                            key={post.url}
                            href={post.url}
                            className="group flex flex-col justify-between h-full bg-card shadow space-y-6 p-4 rounded-lg"
                        >
                            <div className="flex flex-col space-y-4">
                                {/* 1. Meta Data - Clean & Mono */}
                                <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground/60">
                                    <time className="text-foreground font-medium">
                                        {new Date(post.data.lastModified || "").toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </time>
                                    <span>/</span>
                                    <span>ENGINEERING</span>
                                </div>

                                {/* 2. Title - The Hero */}
                                <h3 className="text-2xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                                    {post.data.title}
                                </h3>

                                {/* 3. Description - High Readability */}
                                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 font-mono">
                                    {post.data.description}
                                </p>
                            </div>

                            {/* 4. Footer - Minimalist Badges & Action */}
                            <div className="pt-2 flex items-center justify-between border-t border-border/40 mt-auto">

                                {/* Badges: Simple Text, no heavy background */}
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

                                {/* Arrow: Subtle movement */}
                                <div className="flex items-center gap-2 text-sm font-medium text-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    Read
                                    <ArrowUpRight className="size-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                {/* --- EMPTY STATE (If no posts) --- */}
                {posts.length === 0 && (
                    <div className="w-full py-20 flex flex-col items-center justify-center border border-dashed border-border rounded-xl bg-card/20">
                        <Terminal className="size-12 text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg font-bold font-mono">NO_LOGS_FOUND</h3>
                        <p className="text-muted-foreground">Initialize sequence to write first entry.</p>
                    </div>
                )}

            </div>
        </main>
    );
}