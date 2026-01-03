"use client";

import { TransitionLink } from "@/components/utils/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Layers } from "lucide-react";
import { projectsList } from "~/data/projects";

type OtherProjectsProps = {
    currentProjectId: string;
};

export function OtherProjects({ currentProjectId }: OtherProjectsProps) {
    // 1. Filter out current project
    const otherProjects = projectsList.filter((p) => p.id !== currentProjectId);

    // 2. Duplicate the list to create a seamless infinite loop
    // If we don't have enough items, we duplicate them more times to fill the screen
    const scrollItems = [
        ...otherProjects,
        ...otherProjects,
        ...otherProjects,
        ...otherProjects
    ];

    return (
        <section className="w-full  py-24 overflow-hidden">
            <div className="w-full max-w-[1400px] mx-auto px-6">

                {/* Header */}
                <div className="flex items-center gap-3 mb-10 px-4 md:px-0 opacity-80">
                    <Layers className="size-5 text-primary" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground font-mono">
                        System Archive // Select Project
                    </h2>
                </div>

                <div
                    className="relative w-full overflow-hidden"
                    style={{
                        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
                    }}
                >
                    {/* THE MOVING TRACK 
             We animate x from 0 to -50% because the list is doubled.
             Once it hits -50%, it snaps back to 0 instantly (seamless loop).
          */}
                    <motion.div
                        className="flex gap-6 w-max"
                        animate={{ x: "-50%" }}
                        transition={{
                            duration: 40, // Adjust speed (higher = slower)
                            ease: "linear",
                            repeat: Infinity,
                        }}
                        whileHover={{ animationPlayState: "paused" }} // CSS Pause is smoother here usually, but Framer works
                        style={{ width: "max-content" }}
                    >
                        {scrollItems.map((project, i) => (
                            <TransitionLink key={project.id} href={`/projects/${project.id}`} className="group block  h-full  w-[350px] md:w-[450px] shrink-0">
                                <motion.article
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -5 }}
                                    className="relative h-full flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5"
                                >
                                    {/* Hover Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                    {/* Top: Header */}
                                    <div className="relative z-10 flex justify-between items-start mb-6">
                                        <div className="space-y-2">
                                            <div className="flex gap-2 mb-3">
                                                {project.technologies.slice(0, 2).map(tech => (
                                                    <span key={tech} className="text-[10px] uppercase tracking-wider font-mono px-2 py-1 rounded border border-border bg-background/50 text-muted-foreground">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                            <h3 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                                                {project.title}
                                            </h3>
                                        </div>

                                        <div className="p-2 rounded-full border border-border bg-background text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors">
                                            <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                        </div>
                                    </div>

                                    {/* Middle: Description */}
                                    <p className="relative z-10 text-muted-foreground line-clamp-2 mb-8 leading-relaxed">
                                        {project.description}
                                    </p>

                                    {/* Bottom: Footer Meta */}
                                    <div className="relative z-10 flex items-center justify-between mt-auto pt-6 border-t border-border/50 group-hover:border-primary/20 transition-colors">
                                        <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest">
                                            {project.status}
                                        </span>
                                        <span className="text-xs font-bold text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                                            VIEW CASE STUDY
                                        </span>
                                    </div>

                                </motion.article>
                            </TransitionLink>
                        ))}
                    </motion.div>
                </div>

            </div>
        </section>
    );
}