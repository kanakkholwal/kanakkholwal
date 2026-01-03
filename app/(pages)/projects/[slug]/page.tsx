import { CountingNumber } from "@/components/animated/text.counter";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/utils/link";
import { Activity, ArrowLeft, ArrowUpRight, Calendar } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { appConfig } from "root/project.config";
import { projectsList } from "~/data/projects";
import { OtherProjects } from "./other-projects";

// --- UTILITY: GENERATIVE FALLBACK ---
const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return "#" + "00000".substring(0, 6 - c.length) + c;
};

function ProjectFallback({ title }: { title: string }) {
    const color1 = stringToColor(title);
    const color2 = stringToColor(title.split("").reverse().join(""));

    return (
        <div className="relative w-full h-full bg-zinc-50 dark:bg-zinc-900 overflow-hidden flex items-center justify-center border border-border/50 rounded-3xl group">
            <div
                className="absolute top-[-50%] left-[-20%] w-[100%] h-[100%] rounded-full blur-[80px] opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen transition-all duration-1000 group-hover:scale-110"
                style={{ backgroundColor: color1 }}
            />
            <div
                className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full blur-[80px] opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen transition-all duration-1000 group-hover:scale-110"
                style={{ backgroundColor: color2 }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="relative z-10 flex items-center justify-center">
                <div className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground/10 select-none font-mono">
                    {title.substring(0, 2).toUpperCase()}
                </div>
            </div>
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay" />
        </div>
    );
}

// --- HELPER: STATUS COLORS ---
const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
        case "shipped": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
        case "in progress": return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
        case "archived": return "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20";
        default: return "bg-primary/10 text-primary border-primary/20";
    }
};

// --- METADATA ---
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
                + `/projects/og?slug${project.id}`,
        },
    };
}

export async function generateStaticParams() {
    return projectsList.map((project) => ({
        slug: project.id,
    }));
}

// --- MAIN PAGE COMPONENT ---
export default async function ProjectPage({ params }: Props) {
    const projectId = (await params).slug;
    const project = projectsList.find((p) => p.id === projectId);

    if (!project) {
        notFound();
    }

    return (
        <main className="min-h-screen w-full relative overflow-hidden">
            {/* Background Texture */}
            <div className="fixed inset-0 -z-50 h-full w-full bg-background opacity-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)" />

            <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-20">

                <ButtonLink
                    href="/projects"
                    variant="ghost"
                    size="sm"
                    className="mb-8 md:mb-12 group pl-0"
                >
                    <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    Back to Projects
                </ButtonLink>

                {/* --- HEADER SECTION --- */}
                <div className="space-y-8 mb-16">
                    <div className="flex flex-col items-start gap-4">
                        {/* Meta Top Row */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${getStatusStyles(project.status)}`}>
                                {project.status}
                            </div>
                            <span className="flex items-center gap-2 text-xs font-mono text-muted-foreground px-3 py-1 rounded-full border border-border bg-background/50">
                                <Calendar className="size-3" />
                                {project.dates}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-metallic">
                            {project.title}
                        </h1>

                        {/* Quick Tags */}
                        {project.tags && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {project.tags.map(tag => (
                                    <span key={tag} className="text-muted-foreground text-sm font-medium italic">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full aspect-video rounded-3xl overflow-hidden border border-border/50 shadow-2xl mb-12 bg-card relative group">
                    {project.active && (
                        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-medium text-white">Live System</span>
                        </div>
                    )}

                    {project.video ? (
                        <video
                            src={project.video}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : project.image ? (
                        <Image
                            src={project.image}
                            alt={project.title}
                            width={1920}
                            height={1080}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                            priority
                        />
                    ) : (
                        <ProjectFallback title={project.title} />
                    )}
                </div>

                {project.metrics && project.metrics.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border-y border-border mb-16 bg-card/30 backdrop-blur-sm">
                        {project.metrics.map((metric, i) => (
                            <div key={i} className="flex flex-col p-6 hover:bg-muted/50 transition-colors">
                                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                                    {metric.label}
                                </span>
                                <CountingNumber
                                    from={0}
                                    to={metric.value}
                                    duration={2.5}
                                    className="text-2xl md:text-3xl font-bold tracking-tight text-primary"
                                    suffix="+"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* --- CONTENT LAYOUT --- */}
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12 md:gap-24">

                    {/* Left Column: Narrative */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 border-b pb-5">
                                <Activity className="size-5 text-primary" />
                                Project Overview
                            </h2>
                            <div className="prose dark:prose-invert text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                <Markdown>
                                    {project.content}
                                </Markdown>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar Spec Sheet */}
                    <div className="space-y-10">

                        {/* Links Section */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Deployment & Repos
                            </h3>
                            <div className="flex flex-col gap-2">
                                {project.links?.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.href}
                                        target="_blank"
                                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card hover:bg-accent hover:border-border transition-all group"
                                    >
                                        <span className="flex items-center gap-3 text-sm font-medium">
                                            {link.icon}
                                            {link.type}
                                        </span>
                                        <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Tech Stack */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Tech Stack
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies.map((tech) => (
                                    <Badge
                                        key={tech}
                                        variant="outline"
                                        className="px-3 py-1.5 font-mono text-xs bg-background hover:bg-muted transition-colors"
                                    >
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
            <OtherProjects currentProjectId={project.id} />
        </main>
    );
}