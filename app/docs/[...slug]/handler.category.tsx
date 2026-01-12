import DocsSearch from "@/components/docs.search";
import { source } from "@/lib/source";
import { ArrowLeft, FileText, FolderOpen, Terminal } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// optional: Map category slugs to nice titles/descriptions
const CATEGORY_META: Record<string, { title: string; description: string }> = {
    architecture: {
        title: "System Architecture",
        description: "High-level design decisions, trade-offs, and structural diagrams.",
    },
    performance: {
        title: "Performance Engineering",
        description: "Benchmarks, latency analysis, and optimization strategies.",
    },
    reliability: {
        title: "Reliability & Uptime",
        description: "Incident reports, chaos engineering, and failure mode analysis.",
    },
    security: {
        title: "Security Models",
        description: "Auth flows, threat modeling, and compliance notes.",
    },
    systems: {
        title: "Systems & Infra",
        description: "CI/CD pipelines, container orchestration, and dev-tools.",
    },
};

export default async function CategoryPage(props: {
    category: string;
}) {
    const categorySlug = props.category;

    // 1. Filter pages belonging to this category
    // We check if the page URL starts with /docs/[category]
    const categoryPages = source.getPages().filter((page) => {
        const pathParts = page.url.split("/");
        // Assuming url is /docs/category/slug
        return pathParts[2] === categorySlug && pathParts.length > 3;
    });

    if (categoryPages.length === 0) {
        return notFound();
    }

    // Get nice meta or fallback to slug
    const meta = CATEGORY_META[categorySlug] || {
        title: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
        description: "Engineering notes and documentation.",
    };

    return (
        <main className="min-h-screen relative">

            <div className="fixed inset-0 z-0 pointer-events-none h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">

                <div className="mb-12">
                    <Link
                        href="/docs"
                        className="group inline-flex items-center text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="mr-2 size-4 group-hover:-translate-x-1 transition-transform" />
                        / DOCS / INDEX
                    </Link>
                </div>

                <header className="mb-16 pb-8">
                    <div className="flex items-center gap-3 mb-4 text-primary">
                        <FolderOpen className="size-6" />
                        <span className="font-mono text-sm tracking-widest uppercase">Directory</span>
                        <DocsSearch iconOnly />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        {meta.title}
                    </h1>
                    <p className="text-xl text-muted-foreground font-mono leading-relaxed max-w-2xl">
                        {meta.description}
                    </p>
                </header>

                <div className="space-y-2">

                    <div className="grid grid-cols-[1fr_120px] px-4 py-2 border-b border-border text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        <span>Document Name</span>
                        <span className="text-right">Est. Read</span>
                    </div>

                    {categoryPages.map((page) => (
                        <Link
                            key={page.url}
                            href={page.url}
                            className="group grid grid-cols-[1fr_120px] items-center px-4 py-4 rounded-lg hover:bg-primary/5 transition-colors border border-transparent hover:border-border/50"
                        >
                            <div className="flex flex-col gap-1 min-w-0 pr-4">
                                <div className="flex items-center gap-3">
                                    <FileText className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                                    <span className="font-medium text-foreground text-lg group-hover:underline decoration-1 underline-offset-4 truncate">
                                        {page.data.title}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground font-mono line-clamp-1 pl-7">
                                    {page.data.description}
                                </p>
                            </div>

                            <div className="text-right font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                                {Math.ceil((page.data.body.toString().length || 1000) / 1000)} min
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Empty State / Footer */}
                <div className="mt-12 pt-8 border-t border-dashed border-border/50 text-center">
                    <p className="text-sm font-mono text-muted-foreground">
                        <Terminal className="inline-block size-3 mr-2 align-middle" />
                        END OF DIRECTORY LISTING
                    </p>
                </div>

            </div>
        </main>
    );
}

