"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

import { useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";

import * as React from "react";
import { SkillCategory } from "./sections.skills";

function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        // Base styles using semantic tokens
        "group relative border border-border bg-card overflow-hidden rounded-xl",
        className,
      )}
      onMouseMove={handleMouseMove}
    >
      {/* The Glow Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              hsl(var(--primary) / 0.15), 
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

export function SpotLightSkillSection({
  categories,
}: {
  categories: SkillCategory[];
}) {
  const flattenedSkills = [
    ...new Set(categories.map((cat) => cat.skills).flat()),
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 relative z-10">
      {flattenedSkills.map((skill, index) => (
        <SpotlightCard key={skill} className="aspect-square">
          <div className="flex flex-col items-center justify-center h-full p-4 transition-all duration-300">
            {/* Icon Container */}
            <div className="relative size-14 md:size-16 flex items-center justify-center rounded-2xl bg-background shadow-sm border border-border mb-3 group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-500">
              <Image
                src={`https://skillicons.dev/icons?i=${skill}`}
                alt={`${skill} icon`}
                width={64}
                height={64}
                className="size-10 md:size-12 object-contain grayscale opacity-70 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100"
                unoptimized
              />
            </div>

            {/* Skill Name */}
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider group-hover:text-primary transition-colors">
              {skill}
            </p>
          </div>
        </SpotlightCard>
      ))}
    </div>
  );
}
