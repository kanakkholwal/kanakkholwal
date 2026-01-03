"use client";

import { Button } from "@/components/ui/button"; // Assuming you have shadcn button
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { useState } from "react";
import { appConfig } from "root/project.config";
import { TransitionLink } from "./utils/link";

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const email = appConfig.emails[0]

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="relative w-full py-24 px-4 overflow-hidden">
      
      {/* 1. Background: Technical Grid (Subtle) */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* 2. Main "Ticket" Container */}
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/10 backdrop-blur-md p-8 md:p-16 transition-all duration-500 hover:border-border/80 hover:bg-card/50">
          
          {/* Ambient Glow Effect */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-[100px] transition-all group-hover:bg-primary/10" />

          <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-8 md:items-end">
            
            {/* Left: Typography & Status */}
            <div className="flex flex-col gap-6 max-w-2xl">
              
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                AVAILABLE FOR NEW ROLES
              </div>

              {/* Headline */}
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground leading-[0.95]">
                Ready to build <br />
                <span className="text-muted-foreground italic font-serif">something iconic?</span>
              </h2>

              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                I help startups ship engineering-grade web applications. 
                From complex backend architecture to pixel-perfect UI.
              </p>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col gap-4 w-full md:w-auto min-w-[240px]">
              
              {/* Primary CTA */}
              <Button 
                asChild 
                size="lg" 
                className="w-full text-base font-semibold h-12 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
              >
                <TransitionLink href="/contact">
                  Start a Project
                  <ArrowUpRight className="ml-2 size-4" />
                </TransitionLink>
              </Button>

              {/* Secondary: Copy Email Ticket */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground ml-1">
                  Or copy email
                </span>
                <button
                  onClick={handleCopy}
                  className="relative group/btn flex items-center justify-between w-full p-3 rounded-xl border border-border bg-background hover:bg-accent hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                      <Mail className="size-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      kanak...
                    </span>
                  </div>
                  
                  <div className="mr-2 text-muted-foreground group-hover/btn:text-primary transition-colors">
                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  </div>
                </button>
              </div>

            </div>
          </div>

          {/* Bottom "Barcode" Decoration (Purely Aesthetic) */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
      </div>
    </section>
  );
}