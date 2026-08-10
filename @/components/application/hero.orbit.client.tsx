"use client";

import { CountingNumber } from "@/components/animated/text.counter";
import { Icon, IconType } from "@/components/icons";
import { Variants, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import * as React from "react";
import { appConfig } from "root/project.config";
import type { HeroOrbitActivityItem } from "~/api/github";
import { HeroOrbitRow } from "./hero.orbit.shared";

const ORBIT_INNER = ["github", "linkedin", "twitter"] as const;

export type HeroOrbitProps = {
  stats: {
    projects: number;
    ossRepos: number;
    yearsExp: number;
  };
  activity: HeroOrbitActivityItem[];
  /** Used as fallback when the GraphQL payload is empty. */
  fallback?: boolean;
};

export function HeroOrbit({ stats, activity, fallback = false }: HeroOrbitProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(
    useSpring(y, { stiffness: 380, damping: 80 }),
    [-0.4, 0.4],
    [10, -10],
  );
  const rotateY = useTransform(
    useSpring(x, { stiffness: 380, damping: 80 }),
    [-0.4, 0.4],
    [-10, 10],
  );

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set((clientX - left) / width - 0.5);
    y.set((clientY - top) / height - 0.5);
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: 16 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 260, damping: 22 } as never,
    },
  };

  const statsRow = [
    { to: stats.projects, suffix: "+", label: "Projects" },
    { to: stats.ossRepos, suffix: "+", label: "OSS repos" },
    { to: stats.yearsExp, suffix: "+", label: "Yrs exp" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      className="w-full max-w-85 select-none"
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 900 }}
    >
      {/* Fluid, capped. A fixed w-[340px] overflowed its grid column whenever
          the column shrank below that. */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl">

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-destructive/80" />
            <span className="size-2.5 rounded-full bg-warning/80" />
            <span className="size-2.5 rounded-full bg-success/80" />
          </div>
          <span className="text-2xs font-mono text-muted-foreground tracking-widest">
            @{appConfig.usernames?.github ?? "kanakkholwal"}
          </span>
          <div className="flex items-center gap-1 text-success">
            <span className="relative flex size-1.5">
              <span className="animate-ping absolute inline-flex size-full rounded-full bg-success opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex size-1.5 rounded-full bg-success" />
            </span>
            <span className="text-2xs font-mono">Shipping</span>
          </div>
        </div>

        {/* Avatar + identity */}
        <div className="flex items-center gap-4 px-5 py-4 border-b border-border/30">
          <div className="relative shrink-0">
            <div className="relative size-14 rounded-full ring-2 ring-border ring-offset-2 ring-offset-card overflow-hidden">
              <Image
                src={appConfig.avatar}
                alt={appConfig.displayName}
                width={56}
                height={56}
                className="w-full h-full object-cover"
                fetchPriority="high"
              />
            </div>
            <span className="absolute bottom-0 right-0 size-3 rounded-full bg-success ring-2 ring-card" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold truncate">{appConfig.displayName}</p>
              <Icon name="verified:color" className="size-3.5 text-sky-500 shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground truncate">{appConfig.role}</p>
            <p className="text-2xs text-muted-foreground/60 mt-0.5 font-mono truncate">
              {appConfig.location}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-border/40 border-b border-border/30">
          {statsRow.map((s) => (
            <div key={s.label} className="flex flex-col items-center py-3 gap-0.5">
              <span className="text-base font-black tracking-tight tabular-nums">
                <CountingNumber to={s.to} suffix={s.suffix} duration={1.8} startOnView once />
              </span>
              <span className="text-2xs text-muted-foreground uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Activity feed */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-2xs font-mono text-muted-foreground/50 uppercase tracking-widest">
              Recent activity
            </p>
            {fallback && (
              <span className="text-2xs font-mono text-muted-foreground/40 uppercase tracking-widest">
                cached
              </span>
            )}
          </div>
          <motion.ul
            variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } } }}
            initial="hidden"
            animate="show"
            className="space-y-1.5"
          >
            {activity.map((item, idx) => (
              <motion.li
                key={`${item.kind}-${idx}`}
                variants={itemVariants}
                className="px-2 py-1.5 rounded-md bg-muted/40 hover:bg-muted/60 transition-colors"
              >
                <HeroOrbitRow item={item} variant="card" />
              </motion.li>
            ))}
            {activity.length === 0 && (
              <li className="text-2xs text-muted-foreground/60 italic py-1">
                No recent activity to show.
              </li>
            )}
          </motion.ul>
        </div>

        {/* Social footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border/30">
          {ORBIT_INNER.map((key) => (
            <a
              key={key}
              href={appConfig.social[key]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name={key as IconType} className="size-3.5" />
              <span className="capitalize font-medium text-2xs">{key}</span>
            </a>
          ))}
          <a
            href={appConfig.social["cal.com"]}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="cal.com" className="size-3.5" />
            <span className="font-medium text-2xs">Book a call</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default HeroOrbit;
