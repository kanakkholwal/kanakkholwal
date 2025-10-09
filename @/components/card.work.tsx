"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase } from "lucide-react";
import Markdown from "react-markdown";
import { WorkExperience } from "~/data/work";
import { HyperText } from "./animated/text.hyper";
import { TextReveal } from "./animated/text.reveal";

interface WorkExperienceCardProps {
  work: WorkExperience;
}
export function WorkExperienceCard({ work }: WorkExperienceCardProps) {
  return (
    <div className="flex flex-col md:flex-row justify-start gap-6 md:gap-10 pt-10 md:pt-32">
      {/* Left Title Section (sticky on desktop) */}
      <div className="flex flex-col items-start gap-y-3 text-sm font-light md:flex  md:sticky md:top-32 self-start z-40 w-full max-w-sm lg:max-w-md">
        <time
          className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
          dateTime={work.start + (work.end ? `-${work.end}` : "-present")}
        >
          {work.start} - {work.end ?? "Present"}
        </time>
        <div className="flex items-center gap-2">
          <Avatar className="border size-10 m-auto bg-muted-background dark:bg-foreground">
            <AvatarImage
              src={work.logoUrl}
              alt={work.company}
              className="object-contain"
            />
            <AvatarFallback>{work.company[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center gap-0">
            <TextReveal
              aria-labelledby="company"
              className="font-logo text-md font-bold text-foreground md:text-xl text-shadow-glow tracking-wide"
            >
              {work.company}
            </TextReveal>
            <a
              className="font-sans text-xs text-primary hover:underline flex-auto"
              href={work.href}
              rel="noreferrer"
              aria-label={`Visit ${work.company} website`}
              target="_blank"
            >
              {work.href.replace(/(^\w+:|^)\/\//, "").replace(/www\./, "")}
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {/* <div className="text-muted-foreground flex items-center gap-1.5">
            <MapPin
              className="lucide lucide-map-pin size-3.5 flex-shrink-0"
              aria-hidden="true"
            />
            <span className="text-sm">{work.location}</span>
          </div> */}
          <div className="text-muted-foreground flex items-center gap-1.5">
            <Briefcase
              className="lucide lucide-briefcase size-3.5 flex-shrink-0"
              aria-hidden="true"
            />
            <span className="text-sm font-medium">
              {work.locationType === "remote" ? "Remote" : "On-site"}
            </span>
          </div>
        </div>
      </div>

      {/* Right Content Section */}
      <div className="relative w-full">
        {/* Mobile Title */}
        <div className="mb-3 text-colorful animate-gradient-x">
          <HyperText
            startOnView
            className="text-2xl sm:text-3xl font-bold  font-instrument-serif"
          >
            {work.title}
          </HyperText>
        </div>

        {/* Description */}
        <div className="mt-2 text-sm sm:text-base prose max-w-none text-pretty font-sans dark:prose-invert text-muted-foreground">
          <Markdown>{work.description}</Markdown>
        </div>
      </div>
    </div>
  );
}
