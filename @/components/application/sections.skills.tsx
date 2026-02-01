"use client";

import { Cloud, Database, Layout, Server, Terminal } from "lucide-react";
import { appConfig } from "root/project.config";


import useStorage from "@/hooks/use-storage";
import { StyleModels, StylingModel } from "../header";
import { BentoSkillsSection } from "./skills.bento";
import { SpotLightSkillSection } from "./skills.spotlight";


const CATEGORIES = [
    {
        id: "frontend",
        title: "Frontend Engineering",
        icon: Layout,
        description: "Building responsive, pixel-perfect web experiences.",
        // Spans 2 columns on large screens for emphasis
        className: "md:col-span-2 lg:col-span-2",
        skills: appConfig.skills.frontend
    },
    {
        id: "backend",
        title: "Backend & API",
        icon: Server,
        description: "Scalable server-side architectures.",
        className: "md:col-span-1 lg:col-span-1",
        skills: appConfig.skills.backend
    },
    {
        id: "database",
        title: "Database & State",
        icon: Database,
        description: "Data modeling and persistence.",
        className: "md:col-span-1 lg:col-span-1",
        skills: appConfig.skills.database
    },
    {
        id: "devops",
        title: "DevOps & Cloud",
        icon: Cloud,
        description: "Deployment, CI/CD, and infrastructure.",
        className: "md:col-span-2 lg:col-span-2",
        skills: appConfig.skills.devops
    },
    {
        id: "tools",
        title: "Tools & Environment",
        icon: Terminal,
        description: "Workflow optimization and design.",
        className: "md:col-span-2 lg:col-span-2", // Full width on bottom
        skills: appConfig.skills.tools
    }
];
export type SkillCategory = typeof CATEGORIES[number];

export function SkillSection() {
    const [selectedStyle] = useStorage<StylingModel>("styling.model", StyleModels[0].id);

    return (
        <section
            id="skills"
            className="relative max-w-7xl mx-auto w-full px-6 md:px-12 py-32 overflow-hidden"
        >
            <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="flex flex-col items-center text-center mb-16 space-y-4 relative z-10">
                <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
                    {`// The Toolkit`}
                </span>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground">
                    <span className="font-instrument-serif italic font-normal text-muted-foreground/80 mr-3">
                        My Technical
                    </span>
                    <span className="">
                        Arsenal
                    </span>
                </h2>
                <p className="max-w-xl text-muted-foreground text-lg">
                    A comprehensive suite of tools and technologies I use to architect scalable digital solutions.
                </p>
            </div>
            {selectedStyle === "dynamic" ?  <BentoSkillsSection categories={CATEGORIES} />:<SpotLightSkillSection categories={CATEGORIES} />}

        </section>
    );
}
