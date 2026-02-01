"use client";
import {
    ButtonLink,
    TransitionLink
} from "@/components/utils/link";
import { motion, useMotionTemplate, useMotionValue, useScroll, Variants } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { appConfig, resume_link } from "root/project.config";
import { GlowFillButton } from "../animated/button.fill";
import { Icon } from "../icons";
import { Badge } from "../ui/badge";


import * as React from "react";




import { useSpring, useTransform } from "framer-motion";
import { Fingerprint, Wifi } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export const HeroVisual = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const xPct = (clientX - left) / width - 0.5;
        const yPct = (clientY - top) / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    }

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

    return (
        <div className="flex items-center justify-center perspective-1000 py-10">
            <motion.div
                onMouseMove={onMouseMove}
                onMouseLeave={() => { x.set(0); y.set(0); }}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative w-[340px] h-[500px] rounded-[24px] bg-gradient-to-br from-card/90 to-accent/90 border border-border/10 shadow-2xl backdrop-blur-xl group cursor-default overflow-hidden"
            >
                {/* Noise Texture */}
                <div className="absolute inset-0 opacity-15 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                {/* Holographic Glare (Your existing code) */}
                <div
                    className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden"
                    style={{ mixBlendMode: 'overlay' }}
                >
                    <motion.div
                        style={{
                            background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%)',
                            x: useTransform(mouseX, [-0.5, 0.5], [-100, 100]),
                            y: useTransform(mouseY, [-0.5, 0.5], [-100, 100]),
                        }}
                        className="w-full h-full transform scale-150"
                    />
                </div>

                <div className="relative z-10 h-full flex flex-col p-6 justify-between text-card-foreground" style={{ transform: "translateZ(30px)" }}>

                    {/* 1. HEADER: Chip & Status */}
                    <div className="flex justify-between items-start">
                        {/* The "EMV Chip" - Adds nice Gold Contrast */}
                        <div className="relative w-12 h-9 rounded bg-gradient-to-tr from-yellow-200 via-yellow-400 to-yellow-600 shadow-sm border border-yellow-600/50 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 border-[0.5px] border-black/20 rounded opacity-50" />
                            <div className="w-full h-[1px] bg-black/20 absolute top-1/2 -translate-y-1/2" />
                            <div className="h-full w-[1px] bg-black/20 absolute left-1/3" />
                            <div className="h-full w-[1px] bg-black/20 absolute right-1/3" />
                        </div>

                        <div className="flex flex-col items-end gap-1">
                            <Wifi className="text-foreground/50" size={20} />
                            <span className="text-[9px] font-mono tracking-widest text-muted-foreground">NFC ACTIVE</span>
                        </div>
                    </div>

                    {/* 2. IDENTITY: Photo & Name */}
                    <div className="flex flex-col items-center text-center mt-4">
                        <div className="relative w-28 h-28 mb-4 group-hover:scale-105 transition-transform duration-500">
                            <div className="absolute inset-0 rounded-full border border-border/20 border-dashed animate-[spin_10s_linear_infinite]" />
                            <div className="absolute inset-1 rounded-full bg-gradient-to-b from-card/10 to-transparent backdrop-blur-sm overflow-hidden border border-border/20">
                                <Image
                                    src={appConfig.logo}
                                    alt="Profile"
                                    width={112}
                                    height={112}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Active Status Dot */}
                            <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-[3px] border-slate-900 rounded-full" />
                        </div>

                        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">{appConfig.name}</h2>
                        <div className="px-3 py-1 rounded-full bg-card/5 border border-border/10 text-xs font-medium text-muted-foreground">
                            {appConfig.role}
                        </div>

                        {/* Location Micro-detail */}
                        <div className="flex items-center gap-1.5 mt-4 text-xs text-muted-foreground">
                            <MapPin size={12} />
                            <span>{appConfig.location}</span>
                        </div>
                    </div>

                    {/* 3. FOOTER: Barcode & ID */}
                    <div className="mt-auto space-y-4">
                        {/* "Signature" or Motto Area */}
                        <div className="flex justify-between items-center px-2">
                            <div className="flex flex-col">
                                <span className="text-[9px] text-foreground/30 uppercase tracking-wider">Valid Thru</span>
                                <span className="text-xs font-mono text-muted-foreground/70">12/28</span>
                            </div>
                            <div className="font-handwriting text-foreground/50 text-lg rotate-[-5deg] opacity-80">
                                {appConfig.name.split(' ')[0]}
                            </div>
                        </div>

                        <div className="h-px w-full bg-gradient-to-r from-transparent via-border/10 to-transparent" />

                        <div className="flex justify-between items-center">
                            <div className="flex gap-0.5 items-end h-8 opacity-80">
                                {[3, 2, 4, 1, 3, 5, 2, 3, 4, 2, 5, 1, 3, 2, 4, 3].map((h, i) => (
                                    <div key={i} className="w-1 bg-primary/90 rounded-sm" style={{ height: `${h * 20}%` }} />
                                ))}
                            </div>

                            <div className="text-right">
                                <div className="flex items-center justify-end gap-2 text-emerald-400">
                                    <Fingerprint size={16} />
                                    <span className="text-[10px] font-bold tracking-widest">VERIFIED</span>
                                </div>
                                <span className="text-[9px] font-mono text-muted-foreground tracking-[0.2em] block mt-0.5">
                                    ID-8492-X
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};


const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
        }
    },
};

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Parallax for content
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const contentY = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Mouse move handler for Spotlight effect
    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <section
            ref={containerRef}
            id="hero"
            onMouseMove={handleMouseMove}
            className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-background selection:bg-primary/20"
        >

            <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <motion.div
                className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:40px_40px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    maskImage: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
                    WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
                }}
            />

            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />


            <motion.div
                style={{ y: contentY, opacity }}
                className="container relative z-10 px-6 md:px-12 mx-auto"
            >
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

                    <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left pt-12 md:pt-0">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
                                },
                            }}
                            className="space-y-8"
                        >

                            <motion.div variants={fadeInUp} className="flex justify-center lg:justify-start">
                                <Badge
                                    variant="outline"
                                    className="group relative pl-2 pr-4 py-1.5 rounded-full border-border/40 bg-background/50 backdrop-blur-md shadow-[0_0_20px_-10px_rgba(0,0,0,0.1)] hover:border-primary/30 transition-colors"
                                >
                                    <span className="relative flex h-2 w-2 mr-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                    </span>
                                    <span className="text-xs font-semibold tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">
                                        AVAILABLE FOR WORK
                                    </span>

                                </Badge>
                                <span className="text-sm font-mono text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                                    {`// Hi, I am ${appConfig.name}`}
                                </span>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="space-y-4">
                                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-foreground">
                                    Building digital
                                    <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground/60 pb-2">
                                        products for
                                    </span>
                                    <br />
                                    <span className="relative inline-block">
                                        <span className="relative z-10 text-foreground">modern web.</span>
                                        {/* Subtle underline highlight */}
                                        <span className="absolute -bottom-1 left-0 w-full h-3 bg-primary/10 -rotate-1 rounded-full -z-10" />
                                    </span>
                                </h1>
                            </motion.div>

                            <motion.p
                                variants={fadeInUp}
                                className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium text-balance"
                            >
                                {appConfig.description}
                            </motion.p>

                            <motion.div
                                variants={fadeInUp}
                                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
                            >
                                <ButtonLink
                                    href={resume_link}
                                    target="_blank"
                                    size="lg"
                                    rounded="full"
                                    variant="dark"
                                    className="h-12 px-8"
                                >
                                    <Icon name="download" />
                                    Download Resume
                                </ButtonLink>

                                <GlowFillButton
                                    icon={ArrowRight}
                                    className="h-12 px-8 rounded-full font-medium text-foreground bg-muted border border-border/50 backdrop-blur-sm"
                                >
                                    <TransitionLink href="/projects">View Projects</TransitionLink>
                                </GlowFillButton>
                            </motion.div>

                        </motion.div>
                    </div>

                    <div className="lg:col-span-5 relative hidden md:flex items-center justify-center perspective-1000">
                        <FloatingCard>
                            {/* This wrapper gives it the 3D tilt and glass effect */}
                            <div className="relative z-10 w-full aspect-square max-w-[500px] flex items-center justify-center">
                                {/* Inner Glow */}
                                <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full" />

                                {/* The Component */}
                                <HeroVisual />
                            </div>
                        </FloatingCard>
                    </div>

                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50"
            >
                <span className="text-[10px] uppercase tracking-widest">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-muted-foreground/50 to-transparent" />
            </motion.div>

        </section>
    );
}



// A simple 3D Tilt Wrapper for the right-side visual
const FloatingCard = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative"
        >
            <motion.div
                animate={{
                    y: [0, -10, 0],
                    rotateX: [0, 5, 0],
                    rotateY: [0, -5, 0]
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative z-20"
            >
                {children}
            </motion.div>

            {/* Mirror/Shadow Effect */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/20 blur-xl rounded-[100%]" />
        </motion.div>
    )
}