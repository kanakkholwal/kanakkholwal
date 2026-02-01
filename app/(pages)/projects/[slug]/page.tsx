import { CountingNumber } from "@/components/animated/text.counter";
import { ProjectFallback } from "@/components/application/projects.card.fallback";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/utils/link";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowUpRight, Calendar, Globe, Layers, Layout } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { appConfig } from "root/project.config";
import { projectsList } from "~/data/projects";
import { OtherProjects } from "./other-projects";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const projectId = (await params).slug;
    const project = projectsList.find((p) => p.id === projectId);
    if (!project) return { title: "Project Not Found" };

    return {
        title: `${project.title} | Projects`,
        description: project.description,
        openGraph: {
            title: `${project.title} | Projects`,
            description: project.description,
            images:
                (process.env.NODE_ENV === "production" ? appConfig.url : `http://localhost:${process.env.PORT || 3000}`)
                + `/api/og?gen_type=project&slug=${project.id}`,
        },
    };
}

export async function generateStaticParams() {
    return projectsList.map((project) => ({
        slug: project.id,
    }));
}

const stringToColor = (str: string) => {
    // Deterministic pastel color generator
    const colors = ["bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-orange-500"];
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
};


const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        shipped: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        "in progress": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        archived: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
        default: "bg-primary/10 text-primary border-primary/20"
    };
    const key = status?.toLowerCase() as keyof typeof styles;
    const activeStyle = styles[key] || styles.default;

    return (
        <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest", activeStyle)}>
            <span className="relative flex h-1.5 w-1.5">
                <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", key === 'shipped' ? "bg-emerald-500" : "bg-zinc-500")}></span>
                <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", key === 'shipped' ? "bg-emerald-500" : "bg-zinc-500")}></span>
            </span>
            {status}
        </div>
    )
}

// --- MAIN PAGE ---
export default async function ProjectPage({ params }: Props) {
    const projectId = (await params).slug;
    const project = projectsList.find((p) => p.id === projectId);

    if (!project) {
        notFound();
    }

    return (
        <main className="min-h-screen w-full relative">

            {/* 1. Header / Hero Section */}
            <header className="relative pt-24 pb-12 md:pb-20 border-b border-border/40">
                {/* Background Grid */}
                <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <ButtonLink href="/projects" variant="ghost" size="sm" className="mb-8 pl-0 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
                    </ButtonLink>

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-wrap items-center gap-4">
                            <StatusBadge status={project.status} />
                            <div className="h-4 w-px bg-border" />
                            <span className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                                <Calendar className="w-3 h-3" /> {project.dates}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground">
                            {project.title}
                        </h1>

                        <div className="flex flex-wrap gap-2">
                            {project.tags?.map(tag => (
                                <Badge key={tag} variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono text-xs font-normal">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. Cinematic Media Display */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 -mt-12 relative z-10">
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl md:rounded-3xl border border-white/20 shadow-2xl bg-zinc-900">
                    {project.video ? (
                        <video src={project.video} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                    ) : project.image ? (
                        <Image src={project.image} alt={project.title} width={1920} height={1080} className="w-full h-full object-cover" priority />
                    ) : (
                        <ProjectFallback title={project.title} />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-2xl md:rounded-3xl pointer-events-none" />
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">

                {project.metrics && project.metrics.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border rounded-xl overflow-hidden mb-24">
                        {project.metrics.map((metric, i) => (
                            <div key={i} className="bg-background p-6 md:p-8 flex flex-col gap-2 group hover:bg-muted/30 transition-colors">
                                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{metric.label}</span>
                                <CountingNumber
                                    to={metric.value}
                                    className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
                                    suffix="+"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* 4. Two-Column Layout (Content + Sticky Sidebar) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* LEFT: Narrative Content */}
                    <div className="lg:col-span-8 space-y-12">
                        <div className="prose prose-lg dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            <div className="flex items-center gap-2 text-foreground font-semibold text-lg mb-6 border-b border-border pb-4">
                                <Layout className="w-5 h-5" /> Project Overview
                            </div>
                            <Markdown components={{
                                // Customizing markdown components for better typography
                                h1: ({ node, ...props }) => <h2 className="text-2xl font-bold tracking-tight text-foreground mt-8 mb-4" {...props} />,
                                h2: ({ node, ...props }) => <h3 className="text-xl font-semibold tracking-tight text-foreground mt-8 mb-4" {...props} />,
                                li: ({ node, ...props }) => <li className="marker:text-primary" {...props} />,
                                a: ({ node, ...props }) => <a className="text-primary hover:underline font-medium" {...props} />
                            }}>
                                {project.content || project.description}
                            </Markdown>
                        </div>
                    </div>

                    {/* RIGHT: Sticky Sidebar */}
                    <div className="lg:col-span-4 relative">
                        <div className="sticky top-24 space-y-10">

                            {/* Action Links */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Globe className="w-3 h-3" /> Deployment
                                </h3>
                                <div className="flex flex-col gap-2">
                                    {project.links?.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.href}
                                            target="_blank"
                                            className="group flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all hover:border-primary/50 hover:shadow-sm"
                                        >
                                            <span className="flex items-center gap-3 font-medium text-sm">
                                                {link.icon || <Globe className="w-4 h-4 text-muted-foreground" />}
                                                {link.type}
                                            </span>
                                            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Tech Stack */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Layers className="w-3 h-3" /> Built With
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies.map((tech) => (
                                        <div key={tech} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-muted/20 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors cursor-default">
                                            {tech}
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* 5. More Projects (Footer) */}
            <div className="border-t border-border bg-zinc-50/50 dark:bg-zinc-900/50">
                <OtherProjects currentProjectId={project.id} />
            </div>
        </main>
    );
}