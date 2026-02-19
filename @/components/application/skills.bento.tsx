"use client";

import { IconComponent } from "@/components/icons";
import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Globe } from "lucide-react";
import Image from "next/image";
import { SkillCategory } from "./sections.skills";

export function BentoSkillsSection({
  categories,
}: {
  categories: SkillCategory[];
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10"
    >
      {categories.map((category) => (
        <BentoCard key={category.id} {...category}>
          <div className="flex flex-wrap gap-2 pt-4">
            {category.skills.map((skill) => (
              <SkillPill key={skill} icon={skill} />
            ))}
          </div>
        </BentoCard>
      ))}
    </motion.div>
  );
}

function BentoCard({
  title,
  icon: Icon,
  description,
  children,
  className,
}: {
  title: string;
  icon: IconComponent;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: "spring", stiffness: 260, damping: 20 },
        },
      }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl",
        "bg-white/50 dark:bg-zinc-900/50", // Light/Dark Backgrounds
        "border border-zinc-200 dark:border-white/10", // Light/Dark Borders
        "p-6 md:p-8 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition-colors duration-500",
        className,
      )}
      onMouseMove={handleMouseMove}
    >
      {/* 1. Spotlight (Adapts to theme) */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              var(--spotlight-color),
              transparent 80%
            )
          `,
        }}
        // Using CSS variables for theme-specific gradient colors
        // Add this to your globals.css: :root { --spotlight-color: rgba(0,0,0,0.05); } .dark { --spotlight-color: rgba(255,255,255,0.1); }
        // OR use inline conditional logic if you prefer JS control
      />

      {/* 2. Noise Texture */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://grainy-gradients.vercel.app/noise.svg')",
          backgroundSize: "cover",
          opacity: 0.05, // Lower opacity for better light mode visibility
          maskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div
            className={cn(
              "inline-flex items-center justify-center rounded-xl p-3 shadow-sm transition-transform group-hover:scale-105 duration-300",
              "bg-zinc-100 dark:bg-zinc-800/50", // Light/Dark Icon Bg
              "ring-1 ring-inset ring-black/5 dark:ring-white/10",
            )}
          >
            <Icon className="h-5 w-5 text-zinc-800 dark:text-zinc-100" />
          </div>
          <Globe className="h-12 w-12 text-black/5 dark:text-white/5 absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-all duration-500 rotate-12" />
        </div>

        <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-[90%]">
          {description}
        </p>
      </div>

      <div className="relative z-10 mt-6 border-t border-black/5 dark:border-white/5 pt-4">
        {children}
      </div>
    </motion.div>
  );
}

function SkillPill({ icon }: { icon: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className={cn(
        "group/pill flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-default",
        // Light Mode Styles
        "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300",
        // Dark Mode Styles
        "dark:bg-zinc-800/50 dark:border-white/5 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:hover:border-white/20",
      )}
    >
      <div className="relative h-4 w-4 overflow-hidden rounded-[4px] grayscale opacity-60 transition-all duration-300 group-hover/pill:grayscale-0 group-hover/pill:opacity-100">
        <Image
          src={`https://skillicons.dev/icons?i=${icon}`}
          alt={icon}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <span className="capitalize">{icon}</span>
    </motion.div>
  );
}
