"use client";

import { SpotlightReveal } from "@/components/animated/section.reveal";
import { SectionHeader } from "@/components/application/sections.header"; // Assuming you have this
import BlurFade from "@/components/magicui/blur-fade";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";
import { useRef } from "react";
import Markdown from "react-markdown";
import { appConfig } from "root/project.config";

const BLUR_FADE_DELAY = 0.04;
export function AboutSection() {
    const [selectedStyle] = useStorage<StylingModel>("styling.model", StyleModels[0].id);




    return (
        <SpotlightReveal
            id="about"
            className="relative w-full py-24 md:py-32 px-6 md:px-12 overflow-hidden"
        >
        
            {selectedStyle === "dynamic" ? 
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 relative z-10">

                <div className="md:col-span-4 lg:col-span-3 relative">
                    <div className="sticky top-32 space-y-8">
                        <BlurFade delay={0.2}>
                            <div className="relative">
                                <SectionHeader
                                    label="Philosophy"
                                    serifText="My Approach"
                                    mainText="to Engineering"
                                    align="left"
                                />

                                <motion.div
                                    animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-6 -left-6 text-primary/10 -z-10"
                                >
                                    <Quote size={80} />
                                </motion.div>
                            </div>
                        </BlurFade>

                        <BlurFade delay={0.3}>
                            <div className="flex flex-wrap gap-2 pt-4">
                                {["User Centric", "Pixel Perfect", "Scalable"].map((tag, i) => (
                                    <div key={i} className="px-3 py-1 rounded-full border border-primary/10 bg-primary/5 text-xs font-medium text-primary/80 backdrop-blur-sm">
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        </BlurFade>
                    </div>
                </div>

                <div className="md:col-span-8 lg:col-span-8 md:pt-4">
                    <RevealTextContent>
                        {appConfig.summary}
                    </RevealTextContent>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        viewport={{ once: true }}
                        className="mt-12 flex items-center gap-4 border-t border-border/50 pt-8"
                    >
                        <div className="h-px w-12 bg-primary/30" />
                        <span className="font-instrument-serif italic text-2xl text-muted-foreground">
                            Always building.
                        </span>
                    </motion.div>
                </div>

            </div> : <div className="max-w-4xl mx-auto">
                <BlurFade delay={BLUR_FADE_DELAY * 2}>
                    <SectionHeader
                        label="Philosophy"
                        serifText="My Approach"
                        mainText="to Engineering"
                        align="left"
                    />
                </BlurFade>
                <BlurFade delay={BLUR_FADE_DELAY * 3}>
                    <div className="prose prose-lg dark:prose-invert text-muted-foreground max-w-none leading-loose">
                        <Markdown>{appConfig.summary}</Markdown>
                    </div>
                </BlurFade>
            </div>
            }

        </SpotlightReveal>
    );
}


const RevealTextContent = ({ children }: { children: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <div ref={ref} className="prose prose-lg md:prose-xl dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
            {/* Since we can't easily split Markdown string into words without parsing HTML,
          we use a high-quality CSS mask reveal animation on the container 
       */}
            <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <Markdown
                    components={{
                        // Custom styling for specific markdown elements
                        p: ({ children }) => <p className="mb-6 text-pretty">{children}</p>,
                        strong: ({ children }) => <span className="text-foreground font-semibold bg-primary/5 px-1 rounded">{children}</span>,
                        ul: ({ children }) => <ul className="space-y-2 mb-6 ml-4 list-none border-l-2 border-primary/20 pl-6">{children}</ul>,
                        li: ({ children }) => <li className="relative pl-2 before:absolute before:left-[-24px] before:top-3 before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary/50">{children}</li>
                    }}
                >
                    {children}
                </Markdown>
            </motion.div>
        </div>
    );
};