"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import React from "react";
import Markdown from "react-markdown";
import { MagicCard } from "./animated/bg.card";

interface WorkExperienceCardProps {
    logoUrl: string;
    altText: string;
    title: string;
    role?: string;
    href?: string;
    period: string;
    description?: string;
}
export function WorkExperienceCard(props: WorkExperienceCardProps) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (props.description) {
            e.preventDefault();
            setIsExpanded(!isExpanded);
        }
    };

    return <Card className="border-none p-0 shadow-none">
        <MagicCard wrapperClassName="flex p-4" layerClassName="bg-card">
            <div className="flex-none">
                <Avatar className="border size-12 m-auto bg-muted-background dark:bg-foreground">
                    <AvatarImage
                        src={props.logoUrl}
                        alt={props.altText}
                        className="object-contain"
                    />
                    <AvatarFallback>{props.altText[0]}</AvatarFallback>
                </Avatar>
            </div>
            <div className="grow ml-4 items-center flex-col group">
                <CardHeader >
                    <div className="flex items-center justify-between gap-x-2 text-base cursor-pointer" onClick={handleClick}
                        aria-expanded={isExpanded}
                        aria-controls="work-description"
                    >
                        <h3 className="inline-flex items-center justify-center font-semibold leading-none text-xs sm:text-sm">
                            {props?.role ? <span className="font-sans mr-1">{props.role} - </span> : null}
                            {props.title}

                            <ChevronRightIcon
                                className={cn(
                                    "size-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100",
                                    isExpanded ? "rotate-90" : "rotate-0"
                                )}
                            />
                        </h3>
                        <div className="text-xs sm:text-sm tabular-nums text-muted-foreground text-right">
                            {props.period}
                        </div>
                    </div>
                    {props?.href && <a className="font-sans text-xs text-primary" href={props?.href} target="_blank">
                        {props.href.replace(/(^\w+:|^)\/\//, '').replace(/www\./, '')}
                    </a>}
                </CardHeader>
                {props.description && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                            opacity: isExpanded ? 1 : 0,

                            height: isExpanded ? "auto" : 0,
                        }}
                        transition={{
                            duration: 0.7,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="mt-2 text-xs sm:text-sm prose max-w-full prose-sm text-pretty font-sans dark:prose-invert text-muted-foreground"
                    >
                        <Markdown>
                            {props.description}
                        </Markdown>
                    </motion.div>
                )}
            </div>

        </MagicCard>
    </Card>
}