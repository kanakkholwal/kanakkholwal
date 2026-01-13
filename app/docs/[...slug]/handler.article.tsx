import { source } from "@/lib/source";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { notFound } from "next/navigation";

// --- COMPONENTS ---
import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card, Cards } from "fumadocs-ui/components/card";
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';

export default async function ArticlePage(props: { slug: string[] }) {
    const page = source.getPage(props.slug);

    if (!page) notFound();

    const Mdx = page.data.body;

    // Calculate read time (rough estimate)
    // Note: Fumadocs usually provides readingTime in data, if not, this is a fallback
    const wordCount = page.data.body?.toString()?.split(/\s+/g).length || 500;
    const readTime = Math.ceil(wordCount / 200);

    const otherArticleSlugs = source.generateParams().filter((p) => p.slug !== props.slug);
    const otherArticles = await Promise.all(
        otherArticleSlugs.map((slug) => source.getPage(slug.slug))
    );

    return (
        <main className="min-h-screen relative">


            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">

                {/* 2. Navigation & Breadcrumbs */}
                <div className="mb-8 md:mb-12">
                    <Link
                        href="/docs"
                        className="group inline-flex items-center text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="mr-2 size-4 group-hover:-translate-x-1 transition-transform" />
                        / INDEX / DOCS / {page.data.category.toUpperCase()}
                    </Link>
                </div>

                <header className="mb-16 border-b border-border/60 pb-12">

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
                        {page.data.title}
                    </h1>

                    {page.data?.tags && (
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            {page.data.tags.map((tag: string) => (
                                <Badge key={tag} className="whitespace-nowrap">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                    <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-5xl font-mono">
                        {page.data.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-6 mt-8 pt-8 border-t border-dashed border-border/50 text-sm font-mono text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Icon name="person-speaking" className="size-4 text-primary" />
                            <span className="text-foreground font-medium">{page.data.author}</span>
                        </div>
                        <div className="h-4 w-px bg-border" />
                        <div className="flex items-center gap-2">
                            <Icon name="calendar" className="size-4" />
                            <time dateTime={new Date(page.data.lastModified || new Date()).toISOString()}>
                                {new Date(page.data.lastModified || new Date()).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </time>
                        </div>
                        <div className="h-4 w-px bg-border" />
                        <div className="flex items-center gap-2">
                            <Icon name="clock" className="size-4" />
                            <span>{readTime} min read</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12">

                    <article className="min-w-0">

                        <div className="lg:hidden mb-8">
                            <InlineTOC items={page.data.toc} />
                        </div>

                        <div
                            className={cn(
                                "prose dark:prose-invert max-w-none",
                                "prose-headings:font-mono prose-headings:tracking-tight prose-headings:font-bold",
                                "prose-p:font-mono prose-p:leading-6 prose-p:text-zinc-600 dark:prose-p:text-zinc-300",
                                "prose-li:font-mono",

                                // override typography anchor underline
                                "[&_a[data-card].peer]:no-underline",

                                // "prose-pre:border prose-pre:border-border/50 prose-pre:bg-zinc-950",
                                // "prose-code:px-1 prose-code:py-0.5 prose-code:rounded-sm prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none"
                            )}
                        >
                            <Mdx components={defaultMdxComponents} />
                        </div>

                        {/* Article Footer */}
                        <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
                            <div className="text-xs font-mono text-muted-foreground">
                                LAST UPDATED: <span className="text-foreground">{new Date(page.data.lastModified || new Date()).toISOString().split('T')[0]}</span>
                            </div>
                            <Link href="/docs" className="text-sm font-medium hover:underline underline-offset-4">
                                ← Back to Index
                            </Link>
                        </div>
                    </article>

                    {/* Right: Sticky Sidebar (Desktop TOC) */}
                    <aside className="hidden lg:block relative">
                        <div className="sticky top-24 space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    On This Page
                                </h3>
                                {/* We reuse InlineTOC but style it as a sidebar list */}
                                <div className="text-sm">
                                    <InlineTOC items={page.data.toc} />
                                </div>
                            </div>

                            {/* Optional: Newsletter or Hiring Callout */}
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                                <p className="text-xs font-medium text-muted-foreground mb-2">Like this engineering deep dive?</p>
                                <Link href="/contact" className="text-xs font-bold text-primary hover:underline">
                                    I'm open for contracts →
                                </Link>
                            </div>
                        </div>
                    </aside>

                </div>
                <div className="mt-12">
                    <h5 className="font-semibold text-metallic text-lg mb-5 flex items-center gap-2">
                        <Icon name="book" className="size-5 text-primary" />
                        Other articles
                    </h5>
                    <Cards>
                        {otherArticles.map((page) => (
                            <Card key={`${page?.slugs.join('/')}`}
                                title={page?.data.title}
                                href={`/docs/${page?.slugs.join('/')}`}>
                                {page?.data.description}
                            </Card>
                        ))}
                    </Cards>
                </div>
            </div>
        </main>
    );
}

