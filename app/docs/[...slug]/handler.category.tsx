import { Icon } from "@/components/icons";
import { source } from "@/lib/source";
import { Card } from "fumadocs-ui/components/card";
import Link from "next/link";

export default function CategoryPage(props: { slug: string }) {
    const allPages = source.getPages();

    // Quick filter for "Featured" (You would tag these in frontmatter ideally)
    const featured = allPages
        // .filter(p =>
        //     ["architecture", "performance", "reliability"].some(tag => p.url.includes(tag))
        // )
        .slice(0, 3);

    return (
        <main className="container max-w-[72ch] py-20 mx-auto">
            <div className="mb-16 border-b border-zinc-200 dark:border-zinc-800 pb-8">
                <h1 className="text-4xl font-sans font-bold tracking-tighter mb-4 font-logo">
                    Engineering Notes & System Designs
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-mono">
                    A collection of technical decisions, architectural patterns, and incident analyses.
                    Written to prove operational competence, not for SEO.
                </p>
            </div>

            {/* FEATURED SECTION */}
            <section className="mb-16">
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 mb-6">
                    <Icon name="pin" className="size-5 mr-2" />
                    Featured Documents
                </h2>
                <div className="grid gap-4">
                    {featured.map((page) => (
                        <Card
                            key={page.url}
                            href={page.url}
                            title={page.data.title}
                            description={page.data.description}
                            icon={<Icon name="book" />}
                        />
                    ))}
                </div>
            </section>

            {/* SECTIONS LIST */}
            <section>
                <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-zinc-500 mb-6">
                    <Icon name="folder-open" className="size-5 mr-2" />
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