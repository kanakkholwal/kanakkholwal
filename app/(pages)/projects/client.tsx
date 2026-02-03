"use client";

import { SimpleProjectCards } from "@/components/application/projects.card";
import { ButtonTransitionLink } from "@/components/utils/link";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { projectsList } from "~/data/projects";

function ProjectPageHeader() {
  return (
    <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-6 pt-12 md:pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-border/50 text-xs font-mono text-muted-foreground uppercase tracking-widest backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/80 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Ship / Iterate / Scale
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground leading-[1.1]"
      >
        Engineering with
        <br />
        <span className="text-colorful-titanium">
          Purpose & Precision.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
      >
        A curated archive of applications, open-source libraries, and experiments.
        Focusing on scalable architecture and intuitive user experiences.
      </motion.p>
    </div>
  );
}

export default function ProjectsShowcase() {
  // Data Transformation: Adapt 'projectsList' to fit the ExpandableCardProps interface
  // This ensures strict type safety and consistent rendering
  const normalizedProjects = projectsList.map((project) => ({
    ...project,
    // Ensure tags exist (map technologies to tags if tags are missing)
    tags: project.technologies || [],
    // Ensure links exist
    links: project.links || [],
    // Provide defaults for optional fields
    dates: project.dates || "Ongoing",
    description: project.description || "",
    title: project.title || "Untitled Project"
  }));

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="fixed inset-0 -z-50 h-full w-full bg-background opacity-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)" />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 pb-24">

        {/* Header */}
        <ProjectPageHeader />

        {/* 3. The Gallery Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <SimpleProjectCards cards={normalizedProjects} />
        </motion.div>

        {/* 4. Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center gap-6 mt-32 border-t border-border/50 pt-16"
        >
          <h3 className="text-2xl font-semibold tracking-tight">Interested in the metrics?</h3>
          <div className="flex gap-4">
            <ButtonTransitionLink
              href="/stats"
              variant="outline"
              rounded="full"
              className="h-12 px-8"
            >
              <TrendingUp className="text-indigo-500" />
              View Github Stats
            </ButtonTransitionLink>

            <ButtonTransitionLink
              href="/"
              variant="default"
              rounded="full"
              shadow="default_soft"
              className="h-12 px-8"
            >
              Back to Home
              <ArrowRight />
            </ButtonTransitionLink>
          </div>
        </motion.div>

      </div>
    </div>
  );
}