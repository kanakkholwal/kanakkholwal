"use client";

import { MagicCard } from "@/components/animated/bg.card";
import { GlowFillButton } from "@/components/animated/button.fill";
import { FloatingElements } from "@/components/animated/floating-elements";
import { RollingText } from "@/components/animated/text.rolling";
import ShapeHero from "@/components/kokonutui/shape-hero";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { ButtonLink, TransitionLink } from "@/components/utils/link";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { projectsList } from "~/data/projects";

export default function ProjectsShowcase() {
  return (
    <>
      <FloatingElements />
      <ShapeHero
        title1="Impactful &"
        title2="innovative projects"
        description="A curated selection of my most impactful and innovative projects, showcasing my skills and expertise in software development."
        shapeClassName="opacity-30 hidden md:block"
      />
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12">
        <RollingText
          text="Featured Projects"
          className="text-4xl font-bold tracking-tight text-shadow-colorful"
          inViewOnce={false}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-stretch gap-2 relative mx-auto max-w-7xl px-6 md:px-10 py-20">
        {projectsList.map((project, idx) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
          >
            <MagicCard className="rounded-2xl h-full" layerClassName="bg-card">
              <CardContent className="p-6 flex flex-col gap-4">
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight mb-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {project.dates}
                  </p>
                </div>

                <p className="text-base leading-relaxed text-muted-foreground">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} size="sm" variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3 mt-2 flex-wrap">
                  {project.links.map((link) => (
                    <ButtonLink
                      key={link.type}
                      href={link.href}
                      target="_blank"
                      size="xs"
                      variant="outline"
                      className="flex gap-1 items-center"
                    >
                      {link.icon}
                      {link.type}
                    </ButtonLink>
                  ))}
                </div>
              </CardContent>
            </MagicCard>
          </motion.div>
        ))}
      </div>

      <div className="flex mx-auto justify-center gap-2 my-5 mb-20">
        <GlowFillButton icon={ArrowRight}>
          <TransitionLink href="/stats">
            <TrendingUp className="size-6 inline-block mr-2" />
            View Project Stats
          </TransitionLink>
        </GlowFillButton>
      </div>
    </>
  );
}
