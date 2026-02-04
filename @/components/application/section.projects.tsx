"use client";

import { motion } from "framer-motion";
import {
    ArrowRight,
    BarChart2,
    FolderOpen,
    Layers
} from "lucide-react";

import {
    ExpandableProjectCards,
    SimpleProjectCards
} from "@/components/application/projects.card";
import BlurFade from "@/components/magicui/blur-fade";
import { ButtonTransitionLink } from "@/components/utils/link";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { projectsList } from "~/data/projects";
import { SectionHeader } from "./sections.header";

const BLUR_FADE_DELAY = 0.04;

export function ProjectsSection() {
    const [selectedStyle] = useStorage<StylingModel>("styling.model", StyleModels[0].id);

    return (
        <section id="projects" className="w-full py-32 px-6 md:px-12 max-w-(--max-app-width) mx-auto space-y-16">

            <BlurFade delay={BLUR_FADE_DELAY * 11}>
                <SectionHeader
                    label="Portfolio"
                    serifText="Real world"
                    mainText="Projects"
                    description="From full-stack applications to open-source libraries. A curation of my best engineering efforts."
                />
            </BlurFade>

            {selectedStyle === "dynamic" ? (
                <ExpandableProjectCards cards={projectsList} />
            ) : (
                <SimpleProjectCards cards={projectsList} />
            )}

            <BlurFade delay={BLUR_FADE_DELAY * 14}>
                <div className="w-full max-w-4xl mx-auto mt-12 pt-12 border-t border-border/40">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">

                        <ButtonTransitionLink
                            href="/projects"
                            className="group relative flex flex-col h-[180px] w-full p-6 rounded-3xl bg-muted/20 border border-border/50 hover:bg-muted/40 hover:border-border transition-all duration-300 overflow-hidden text-left"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 flex justify-between items-center w-full mb-auto">
                                <div className="flex items-center justify-center size-10 rounded-xl bg-background border border-border/50 shadow-sm text-foreground">
                                    <FolderOpen size={18} />
                                </div>
                                <motion.div
                                    initial={{ x: 0, opacity: 0.6 }}
                                    whileHover={{ x: 5, opacity: 1 }}
                                    className="text-muted-foreground pr-1"
                                >
                                    <ArrowRight size={18} />
                                </motion.div>
                            </div>


                            <div className="relative z-10 space-y-1 mt-auto">
                                <h3 className="text-lg font-semibold text-foreground tracking-tight">Project Archive</h3>
                                <p className="text-sm text-muted-foreground/80 font-medium line-clamp-1">
                                    The complete collection of case studies.
                                </p>
                            </div>


                            <Layers
                                className="absolute -bottom-6 -right-6 text-foreground/5 size-32 rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500 ease-out pointer-events-none"
                                strokeWidth={1}
                            />
                        </ButtonTransitionLink>

                        <ButtonTransitionLink
                            href="/stats"
                            className="group relative flex flex-col h-[180px] w-full p-6 rounded-3xl bg-muted/20 border border-border/50 hover:bg-muted/40 hover:border-border transition-all duration-300 overflow-hidden text-left"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 flex justify-between items-center w-full mb-auto">
                                <div className="flex items-center justify-center size-10 rounded-xl bg-background border border-border/50 shadow-sm text-emerald-600 dark:text-emerald-400">
                                    <BarChart2 size={18} />
                                </div>
                                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Live</span>
                                </div>
                            </div>

                            <div className="relative z-10 space-y-1 mt-auto">
                                <h3 className="text-lg font-semibold text-foreground tracking-tight">Engineering Metrics</h3>
                                <p className="text-sm text-muted-foreground/80 font-medium line-clamp-1">
                                    View coding habits & activity trends.
                                </p>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none">
                                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                                    <motion.path
                                        d="M0,40 Q25,35 35,20 T70,25 T100,5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="text-foreground"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 2, ease: "easeInOut" }}
                                    />
                                    <path
                                        d="M0,40 Q25,35 35,20 T70,25 T100,5 L100,40 L0,40 Z"
                                        className="fill-foreground/10"
                                    />
                                </svg>
                            </div>
                        </ButtonTransitionLink>
                    </div>
                </div>
            </BlurFade>
        </section>
    );
}