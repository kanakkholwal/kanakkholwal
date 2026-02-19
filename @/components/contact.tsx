"use client";

import { SpotlightReveal } from "@/components/animated/section.reveal";
import { Button } from "@/components/ui/button";
import { TransitionLink } from "@/components/utils/link";
import { motion, useInView } from "framer-motion";
import { Check, Copy, Sparkles, Terminal } from "lucide-react";
import { useRef, useState } from "react";
import { appConfig } from "root/project.config";

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const email = appConfig.emails[0];
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SpotlightReveal
      id="contact"
      className="relative w-full py-32 px-4 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div ref={ref} className="relative z-10 mx-auto max-w-4xl">
        {/* Main Glass Panel */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="group relative overflow-hidden rounded-[40px] border border-border bg-card/50 backdrop-blur-2xl"
        >
          {/* Top "Window" Bar */}
          <div className="flex items-center justify-between px-3 md:px-8 py-6 border-b border-border/10 bg-card/50">
            <div className="flex gap-2">
              <div className="size-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="size-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
              <div className="size-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
            </div>
            <div className="text-[10px] font-mono text-foreground/20 tracking-widest uppercase">
              contact_interface.tsx
            </div>
          </div>

          <div className="p-8 md:p-16 flex flex-col md:flex-row items-center md:items-start gap-12">
            <div className="flex-1 space-y-8 text-center md:text-left">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-medium text-emerald-500 tracking-wide">
                  System Online & Available
                </span>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                  Let's build the <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-foreground/40">
                    next big thing.
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-sm mx-auto md:mx-0 leading-relaxed">
                  Have a project in mind? Let’s turn those requirements into a
                  shipping product.
                </p>
              </div>

              {/* Primary CTA */}
              <div className="pt-2">
                <Button
                  asChild
                  size="xl"
                  shadow="default"
                  rounded="full"
                  variant="dark"
                  className="shadow-2xl shadow-foreground/10"
                >
                  <TransitionLink href="/contact">
                    <Sparkles className="size-5!" />
                    Start a Project
                  </TransitionLink>
                </Button>
              </div>
            </div>

            <div className="w-full md:w-[380px] shrink-0">
              <div className="relative group/terminal rounded-2xl bg-black border border-zinc-800 p-6 shadow-xl overflow-hidden">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/50 to-purple-600/50 opacity-0 group-hover/terminal:opacity-100 blur transition-opacity duration-500" />

                <div className="relative z-10 bg-zinc-950/90 rounded-xl p-5 space-y-6">
                  {/* Fake Code Lines */}
                  <div className="space-y-2 font-mono text-sm">
                    <div className="text-zinc-500">
                      // Initialize connection
                    </div>
                    <div className="flex flex-wrap gap-2 text-zinc-300">
                      <span className="text-purple-400">const</span>
                      <span className="text-blue-400">contact</span>
                      <span>=</span>
                      <span className="text-yellow-600">{"{"}</span>
                    </div>
                    <div className="pl-4 flex gap-2">
                      <span className="text-blue-300">method:</span>
                      <span className="text-green-400">"email"</span>,
                    </div>
                    <div className="pl-4 flex gap-2">
                      <span className="text-blue-300">to:</span>
                      <span className="text-green-400">"{email}"</span>
                    </div>
                    <div className="text-yellow-600">{"}"}</div>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="w-full group/btn relative flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex items-center justify-center size-8 rounded bg-zinc-800 text-zinc-400 group-hover/btn:text-white transition-colors">
                        <Terminal size={16} />
                      </div>
                      <div className="flex flex-col items-start truncate">
                        <span className="text-xs text-zinc-500 font-mono uppercase">
                          Copy Address
                        </span>
                        <span className="text-sm font-medium text-zinc-300 truncate max-w-[180px]">
                          {email}
                        </span>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-center size-8">
                      <motion.div
                        initial={false}
                        animate={{
                          scale: copied ? 0 : 1,
                          opacity: copied ? 0 : 1,
                        }}
                      >
                        <Copy
                          size={16}
                          className="text-zinc-500 group-hover/btn:text-white"
                        />
                      </motion.div>
                      <motion.div
                        initial={false}
                        animate={{
                          scale: copied ? 1 : 0,
                          opacity: copied ? 1 : 0,
                        }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Check size={18} className="text-emerald-500" />
                      </motion.div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SpotlightReveal>
  );
}
