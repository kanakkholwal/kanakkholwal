"use client"

import ShapeHero from "@/components/kokonutui/shape-hero"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import Link from "next/link"
import { DATA } from "~/data/resume"

type Project = {
  title: string
  href: string
  dates: string
  active: boolean
  description: string
  technologies: string[]
  links: { type: string; href: string; icon: React.ReactNode }[]
  image?: string
  video?: string
}
const projects = DATA.projects

export default function ProjectsShowcase() {
  return (
    <>
      <ShapeHero 
      
        title1=""
        title2="Impactful and innovative projects"
        description="A curated selection of my most impactful and innovative projects, showcasing my skills and expertise in software development."
      />
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold tracking-tight mb-12"
      >
        Featured Projects
      </motion.h2>

      <div className="flex flex-col gap-16 relative mx-auto max-w-6xl px-6 md:px-10 py-20">
        {projects.map((project, idx) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className={cn(
              "grid gap-8 md:grid-cols-2 items-center",
              idx % 2 === 1 ? "md:grid-flow-dense" : ""
            )}
          >
            {/* Media */}
            <div className="relative w-full overflow-hidden rounded-2xl shadow-lg group">
              {project.image ? (
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-64 bg-muted flex items-center justify-center text-muted-foreground text-sm rounded-2xl">
                  No Image Available
                </div>
              )}
              {project.active && (
                <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow">
                  Active
                </span>
              )}
            </div>

            {/* Content */}
            <Card>
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
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  )
}
