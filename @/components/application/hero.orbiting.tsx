"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import React, { useRef } from "react";
import { appConfig } from "root/project.config";

export function OrbitingIdentity() {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

  // The glare is now a subtle white wash, not a rainbow
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;
    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative flex h-[500px] w-full items-center justify-center perspective-1000">
      {/* Background: Just a very faint dark radial gradient to ground the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] bg-zinc-500/5 blur-[120px] -z-10 rounded-full pointer-events-none" />

      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative h-[400px] w-[300px] rounded-[20px] bg-card border border-white/[0.08] shadow-2xl transition-shadow duration-500"
      >
        {/* Specular Glare (White/Transparent) */}
        <motion.div
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.08), transparent 50%)`,
            ),
          }}
          className="absolute inset-0 z-50 rounded-[20px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        {/* Noise Texture Overlay for that "Linear" matte feel */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 rounded-[20px] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

        <div
          className="relative h-full flex flex-col p-8 z-10"
          style={{ transform: "translateZ(20px)" }}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            {/* Minimalist Status Badge */}
            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.05]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-zinc-200"></span>
              </span>
              <span className="text-[10px] font-medium tracking-tight text-zinc-400 uppercase">
                Available
              </span>
            </div>

            {/* Resume Link Icon */}
            <ArrowUpRight className="text-zinc-600 w-4 h-4 group-hover:text-zinc-200 transition-colors" />
          </div>

          {/* Main Identity */}
          <div className="flex flex-col items-start flex-1 space-y-6">
            {/* Avatar: Squircle (Rounded Square) is more "Vercel" than Circle */}
            <div
              className="relative w-24 h-24 rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shadow-lg grayscale group-hover:grayscale-0 transition-all duration-500"
              style={{ transform: "translateZ(30px)" }}
            >
              <Image
                src={appConfig.avatar}
                alt={appConfig.displayName}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-2 text-left">
              <h3 className="text-xl font-medium text-white tracking-tight">
                {appConfig.displayName}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-normal">
                Design Engineer crafting pixel-perfect interfaces.
              </p>
            </div>
          </div>

          {/* Footer: Tech Stack (Monochrome to Color) */}
          <div
            className="mt-auto pt-6 border-t border-white/[0.08] w-full"
            style={{ transform: "translateZ(10px)" }}
          >
            <div className="flex items-center justify-between gap-3">
              {[...appConfig.skills.frontend,...appConfig.skills.devops,...appConfig.skills.backend,...appConfig.skills.tools].slice(0, 4).map((skill, i) => (
                <TechIcon key={i} icon={skill} />
              ))}
              <div className="flex-1 text-right">
                <span className="text-[10px] text-zinc-600 font-mono">
                  +More
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Minimalist Icon Component
const TechIcon = ({ icon }: { icon: string }) => {
  return (
    <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900/50 border border-white/5 group/icon overflow-hidden">
      <Image
        src={`https://skillicons.dev/icons?i=${icon}`}
        width={18}
        height={18}
        alt={icon}
        // Key effect: Grayscale by default, color on hover
        className="w-4 h-4 opacity-40 grayscale group-hover/icon:opacity-100 group-hover/icon:grayscale-0 transition-all duration-300"
        unoptimized
      />
    </div>
  );
};
