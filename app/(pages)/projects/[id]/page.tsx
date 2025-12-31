import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/utils/link";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projectsList } from "~/data/projects";

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
        <div className="relative w-full h-full bg-zinc-50 dark:bg-zinc-900 overflow-hidden flex items-center justify-center border border-border/50 rounded-3xl">
            <div
                className="absolute top-[-50%] left-[-20%] w-[100%] h-[100%] rounded-full blur-[80px] opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen"
                style={{ backgroundColor: color1 }}
            />
            <div
                className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full blur-[80px] opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen"
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

// --- METADATA GENERATION ---
type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const projectId = (await params).id;
    const project = projectsList.find((p) => p.id === projectId);
    if (!project) return { title: "Project Not Found" };

    return {
        title: `${project.title} | Projects`,
        description: project.description,
    };
}

export async function generateStaticParams() {
    return projectsList.map((project) => ({
        id: project.id,
    }));
}

export default async function ProjectPage({ params }: Props) {
    const projectId = (await params).id;
    const project = projectsList.find((p) => p.id === projectId);

    if (!project) {
        notFound();
    }

    return (
        <main className="min-h-screen w-full relative overflow-hidden">
            <div className="fixed inset-0 -z-50 h-full w-full bg-background opacity-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)" />

            <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-20">

                <ButtonLink
                    href="/projects"
                    variant="ghost"
                    className="mb-8 md:mb-12 group"
                >
                    <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Projects
                </ButtonLink>

                {/* Hero Header */}
                <div className="space-y-6 mb-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground">
                            {/* Titanium Gradient Text */}
                            <span className="text-colorful-titanium">
                                {project.title}
                            </span>
                        </h1>

                        {/* Action Buttons (Desktop) */}
                        <div className="hidden md:flex gap-3">
                            {project.links?.map((link, i) => (
                                <Button key={i} variant="outline" size="sm" className="rounded-full gap-2" asChild>
                                    <Link href={link.href} target="_blank">
                                        {link.icon}
                                        {link.type}
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-mono">
                        <span className="px-3 py-1 rounded-full border border-border bg-primary/10">
                            {project.dates}
                        </span>
                        {project.active && (
                            <span className="flex items-center gap-2 text-emerald-500">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Active
                            </span>
                        )}
                    </div>
                </div>

                {/* Media Showcase */}
                <div className="w-full aspect-video rounded-3xl overflow-hidden border border-border shadow-2xl mb-16 bg-card">
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
                            className="w-full h-full object-cover"
                            priority
                        />
                    ) : (
                        <ProjectFallback title={project.title} />
                    )}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12 md:gap-24">

                    {/* Left: Main Content */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
                        <div className="prose prose-lg dark:prose-invert text-muted-foreground leading-relaxed">
                            {project.description}
                            {/* Note: You can add a 'content' field to your data later for long-form case studies */}
                        </div>

                        {/* Mobile Actions (Visible only on mobile) */}
                        <div className="flex flex-col gap-3 md:hidden pt-8">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Links</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.links?.map((link, i) => (
                                    <Button key={i} variant="outline" className="w-full justify-between" asChild>
                                        <Link href={link.href} target="_blank">
                                            <span className="flex items-center gap-2">
                                                {link.icon}
                                                {link.type}
                                            </span>
                                            <ExternalLink className="size-4 opacity-50" />
                                        </Link>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Sidebar Metadata */}
                    <div className="space-y-10">

                        {/* Tech Stack */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Technologies</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies.map((tech) => (
                                    <Badge key={tech} variant="secondary" className="px-3 py-1 font-mono text-xs">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Platform / Context */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Platform</h3>
                            <div className="text-foreground font-medium">
                                Web Application
                            </div>
                        </div>

                        {/* Quick Links (Desktop Sidebar) */}
                        <div className="hidden md:block space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Resources</h3>
                            <div className="flex flex-col gap-2">
                                {project.links?.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.href}
                                        target="_blank"
                                        className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors py-2 border-b border-border/50 group"
                                    >
                                        <span className="flex items-center gap-2">
                                            {link.icon}
                                            {link.type}
                                        </span>
                                        <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </main>
    );
}