import { source } from "@/lib/source";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { ArrowLeft, Calendar, Clock, Hash, User } from "lucide-react";
import Link from 'next/link';
import { notFound } from "next/navigation";

// --- COMPONENTS ---
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const page = source.getPage([params.slug]);

  if (!page) notFound();

  const Mdx = page.data.body;

  // Calculate read time (rough estimate)
  // Note: Fumadocs usually provides readingTime in data, if not, this is a fallback
  const wordCount = page.data.body?.toString()?.split(/\s+/g).length || 500;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <main className="min-h-screen relative bg-background">

      {/* 1. Technical Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-12 md:py-20">

        {/* 2. Navigation & Breadcrumbs */}
        <div className="mb-8 md:mb-12">
          <Link
            href="/blog"
            className="group inline-flex items-center text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 size-4 group-hover:-translate-x-1 transition-transform" />
            / INDEX / BLOG
          </Link>
        </div>

        {/* 3. Header Section (The Blueprint) */}
        <header className="mb-16 border-b border-border/60 pb-12">

          {/* Tags / Category (Optional) */}
          {page.data.tags && (
            <div className="flex gap-2 mb-6">
              {page.data.tags.map((tag: string) => (
                <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md border border-border bg-secondary/50 text-[10px] font-mono uppercase tracking-widest text-secondary-foreground">
                  <Hash className="size-3 mr-1 opacity-50" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
            {page.data.title}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-3xl font-serif">
            {page.data.description}
          </p>

          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center gap-6 mt-8 pt-8 border-t border-dashed border-border/50 text-sm font-mono text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="size-4 text-primary" />
              <span className="text-foreground font-medium">{page.data.author}</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
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
              <Clock className="size-4" />
              <span>{readTime} min read</span>
            </div>
          </div>
        </header>

        {/* 4. Content Layout: Sidebar + Main */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12">

          {/* Left: The Article */}
          <article className="min-w-0">

            {/* Mobile TOC (Visible only on small screens) */}
            <div className="lg:hidden mb-8 p-4 bg-secondary/20 rounded-lg border border-border">
              <span className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Table of Contents</span>
              <InlineTOC items={page.data.toc} />
            </div>

            <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none 
                    prose-headings:font-sans prose-headings:tracking-tight prose-headings:font-bold
                    prose-p:font-serif prose-p:leading-8 prose-p:text-zinc-600 dark:prose-p:text-zinc-300
                    prose-li:font-serif
                    prose-pre:border prose-pre:border-border/50 prose-pre:bg-zinc-950
                    prose-code:px-1 prose-code:py-0.5 prose-code:bg-secondary/50 prose-code:rounded-sm prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                ">
              <Mdx components={defaultMdxComponents} />
            </div>

            {/* Article Footer */}
            <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
              <div className="text-xs font-mono text-muted-foreground">
                LAST UPDATED: <span className="text-foreground">{new Date(page.data.lastModified || new Date()).toISOString().split('T')[0]}</span>
              </div>
              <Link href="/blog" className="text-sm font-medium hover:underline underline-offset-4">
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
                <div className="text-sm border-l-2 border-border/40 pl-4">
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
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export function generateMetadata({ params }: { params: { slug?: string[] } }) {
  const page = source.getPage(params.slug);
  if (!page) return;
  return {
    title: `${page.data.title} | Engineering Blog`,
    description: page.data.description,
  };
}