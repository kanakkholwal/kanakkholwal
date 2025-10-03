"use client"

import { MagicCard } from "@/components/animated/bg.card"
import { FloatingElements } from "@/components/animated/floating-elements"
import { RollingText } from "@/components/animated/text.rolling"
import ShapeHero from "@/components/kokonutui/shape-hero"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import Link from "next/link"
import { DATA } from "~/data/resume"




const projects = DATA.projects

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
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-12">
        <RollingText
          text="Featured Projects"
          className="text-4xl font-bold tracking-tight"
        />
      </div>
    

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 relative mx-auto max-w-7xl px-6 md:px-10 py-20">
        {projects.map((project, idx) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className={cn(
            )}
          >

            {/* Content */}
            <MagicCard className="rounded-2xl" layerClassName="bg-card">
              <CardContent className="p-6 flex flex-col gap-4">
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight mb-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{project.dates}</p>
                </div>

                <p className="text-base leading-relaxed text-muted-foreground">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs rounded-full bg-accent text-accent-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3 mt-2">
                  {project.links.map((link) => (
                    <Link key={link.type} href={link.href} target="_blank">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex gap-1 items-center"
                      >
                        {link.icon}
                        {link.type}
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </MagicCard>
          </motion.div>
        ))}
      </div>
    </>
  )
}
