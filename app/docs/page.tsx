import { source } from "@/lib/source";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function DocsIndex() {
    const allPages = source.getPages();

    // Quick filter for "Featured" (You would tag these in frontmatter ideally)
    const featured = allPages
        // .filter(p =>
        //     ["architecture", "performance", "reliability"].some(tag => p.url.includes(tag))
        // )
        .slice(0, 3);

    return (
        <main className="container max-w-[72ch] py-20 mx-auto font-mono">
            <div className="mb-16 border-b border-zinc-200 dark:border-zinc-800 pb-8">
                <h1 className="text-4xl font-sans font-bold tracking-tighter mb-4">
                    Engineering Notes & System Designs
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    A collection of technical decisions, architectural patterns, and incident analyses.
                    Written to prove operational competence, not for SEO.
                </p>
            </div>

            {/* FEATURED SECTION */}
            <section className="mb-16">
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 mb-6">
                    Featured Documents
                </h2>
                <div className="grid gap-4">
                    {featured.map((page) => (
                        <Link
                            key={page.url}
                            href={page.url}
                            className="group block p-6 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors bg-zinc-50/50 dark:bg-zinc-900/50"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-sans font-bold text-lg group-hover:underline decoration-1 underline-offset-4">
                                        {page.data.title}
                                    </h3>
                                    <p className="text-sm text-zinc-500 mt-2 font-serif">
                                        {page.data.description}
                                    </p>
                                </div>
                                <ArrowUpRight className="size-4 text-zinc-400 group-hover:text-black dark:group-hover:text-white" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* SECTIONS LIST */}
            <section>
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 mb-6">
                    Knowledge Base
                </h2>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                    {[
                        { label: "Architecture", path: "/docs/architecture" },
                        { label: "Systems & Infra", path: "/docs/systems" },
                        { label: "Performance", path: "/docs/performance" },
                        { label: "Reliability", path: "/docs/reliability" },
                        { label: "Security", path: "/docs/security" },
                        { label: "Data Engineering", path: "/docs/data" },
                    ].map((section) => (
                        <Link
                            key={section.path}
                            href={section.path}
                            className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800/50 hover:pl-2 transition-all group"
                        >
                            <span className="font-sans text-sm font-medium">{section.label}</span>
                            <span className="text-xs text-zinc-400 font-mono group-hover:text-zinc-800 dark:group-hover:text-zinc-200">
                                /DIR
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}