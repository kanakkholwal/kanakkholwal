import { WorkExperienceCard } from "@/components/card.work";
import { ContactSection } from "@/components/contact";
import { Icon } from "@/components/icons";
import BlurFade from "@/components/magicui/blur-fade";
import {
  ExpandableCardProps,
  ExpandableProjectCards,
} from "@/components/project-card";
import { ButtonTransitionLink } from "@/components/utils/link";
import Wrapper from "@/components/wrapper";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import Markdown from "react-markdown";
import { appConfig } from "root/project.config";
import { getCachedContributions } from "~/api/github";
import { projectsList } from "~/data/projects";
import { workExperiences } from "~/data/work";
import { GithubSection, HeroSection, SkillSection } from "./client";

const BLUR_FADE_DELAY = 0.04;

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getCachedContributions(appConfig.usernames.github);

  return (
    <Wrapper className="overflow-hidden">
      <div className="fixed inset-0 -z-50 h-full w-full bg-background opacity-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)" />

      <HeroSection />

      <section id="about" className="w-full py-24 px-6 md:px-12 relative">
        <div className="max-w-4xl mx-auto">
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
      </section>

      {/* Work Experience */}
      <section id="work" className="max-w-7xl mx-auto w-full px-6 md:px-12 py-24">
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <SectionHeader
            label="Career"
            serifText="Professional"
            mainText="Journey"
            description="A timeline of my professional roles and the impact I've delivered."
          />
        </BlurFade>

        <div className="grid gap-8 relative">
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden md:block" />

          {workExperiences.map((work, id) => (
            <BlurFade
              key={work.company}
              delay={BLUR_FADE_DELAY * 6 + id * 0.05}
              className="z-10"
            >
              <WorkExperienceCard work={work} />
            </BlurFade>
          ))}
        </div>
      </section>

      <SkillSection />

      {/* Projects */}
      <section id="projects" className="w-full py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-16">
          <BlurFade delay={BLUR_FADE_DELAY * 11}>
            <SectionHeader
              label="Portfolio"
              serifText="Selected"
              mainText="Works"
              description="From full-stack applications to open-source libraries. A curation of my best engineering efforts."
            />
          </BlurFade>

          <ExpandableProjectCards
            cards={projectsList as unknown as ExpandableCardProps["cards"]}
          />

          <div className="flex flex-col sm:flex-row mx-auto justify-center gap-4 pt-8">
            <ButtonTransitionLink
              href="/stats"
              variant="outline"
              rounded="full"
              className="h-12 px-8"
            >
              <Icon name="trend-up" />
              View Project Stats
            </ButtonTransitionLink>

            <ButtonTransitionLink
              href="/projects"
              variant="default" // Changed from rainbow to default for cleaner look
              shadow="default"
              rounded="full"
              className="h-12 px-8 transition-all"
            >
              View All Projects
              <Icon name="arrow-right" />
            </ButtonTransitionLink>
          </div>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
            <div className="h-96 w-full animate-pulse rounded-3xl bg-muted/50 border border-border" />
          </div>
        }
      >
        <GithubSection data={data} />
      </Suspense>

      {/* Contact */}
      <div className="py-24">
        <ContactSection />
      </div>
    </Wrapper>
  );
}


const SectionHeader = ({
  label,
  serifText,
  mainText,
  description,
  align = "center",
}: {
  label: string;
  serifText: string;
  mainText: string;
  description?: string;
  align?: "center" | "left";
}) => (
  <div className={cn("flex flex-col mb-16 space-y-4", align === "center" ? "items-center text-center" : "items-start text-left")}>
    <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
      {` //`} {label}
    </span>
    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground">
      <span className="font-instrument-serif italic font-normal text-muted-foreground/80 mr-3">
        {serifText}
      </span>
      <span className="text-colorful-titanium">
        {mainText}
      </span>
    </h2>
    {description && (
      <p className="max-w-xl text-muted-foreground text-lg leading-relaxed">
        {description}
      </p>
    )}
  </div>
);