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
import { Suspense } from "react";
import Markdown from "react-markdown";
import { appConfig } from "root/project.config";
import { getCachedContributions } from "~/api/github";
import { projectsList } from "~/data/projects";
import { workExperiences } from "~/data/work";
import { GithubSection, HeroSection, SkillSection } from "./client";

const BLUR_FADE_DELAY = 0.04;

export default async function HomePage() {
  const data = await getCachedContributions(appConfig.usernames.github);
  return (
    <Wrapper>
      {/* Hero */}
      <HeroSection />
      {/* About */}
      <section
        className="w-full backdrop-blur-2xl py-12 px-6 md:px-12 hidden"
        id="about"
      >
        <div className="max-w-4xl mx-auto flex flex-col gap-6 text-center md:text-left">
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <h2 className="text-2xl font-semibold">About Me</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <div className="prose dark:prose-invert text-muted-foreground max-w-none">
              <Markdown>{appConfig.summary}</Markdown>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Work Experience */}
      <section
        id="work"
        className="max-w-7xl mx-auto w-full px-6 md:px-12 py-16"
      >
        <h2 className="text-shadow-glow relative text-5xl font-medium tracking-tight text-balance sm:text-5xl md:text-6xl text-center z-30 mb-5 md:mb-0 size-full -translate-y-10">
          <p className="mb-3 font-mono text-xs font-normal tracking-widest text-foreground uppercase md:text-sm">
            Jobs & Roles
          </p>
          <span className="font-instrument-serif">
            <span className="">Work </span>{" "}
            <span className="text-colorful animate-gradient-x font-instrument-serif pe-2 tracking-tight italic">
              {" "}
              Experience
            </span>
          </span>
        </h2>
        <div className="grid gap-6">
          {workExperiences.map((work, id) => (
            <BlurFade
              key={work.company}
              delay={BLUR_FADE_DELAY * 6 + id * 0.05}
            >
              <WorkExperienceCard work={work} />
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Skills */}
      <SkillSection />

      {/* Github Activity */}
      <Suspense
        fallback={
          <>
            <div className="h-96 w-full animate-pulse rounded-md bg-muted" />
          </>
        }
      >
        <GithubSection data={data} />
      </Suspense>
      {/* Projects */}
      <section id="projects" className="w-full py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <BlurFade delay={BLUR_FADE_DELAY * 11}>
            <h2 className="text-shadow-glow relative text-5xl font-medium tracking-tight text-balance sm:text-5xl md:text-6xl text-center z-30 mb-5 md:mb-0 size-full -translate-y-10">
              <p className="mb-3 font-mono text-xs font-normal tracking-widest text-black/80 uppercase md:text-sm dark:text-white/70">
                From web apps, packages to low-code platforms
              </p>
              <span className="font-instrument-serif">
                <span className="">Curated </span>{" "}
                <span className="text-colorful animate-gradient-x font-instrument-serif pe-2 tracking-tight italic">
                  {" "}
                  Projects
                </span>
              </span>
            </h2>
          </BlurFade>
          <ExpandableProjectCards
            cards={projectsList as unknown as ExpandableCardProps["cards"]}
          />
          <div className="flex mx-auto justify-center gap-2">
            <ButtonTransitionLink
              href="/stats"
              variant="outline"
              rounded="full"
            >
              <Icon name="trend-up" />
              View Stats
            </ButtonTransitionLink>
            <ButtonTransitionLink
              href="/projects"
              variant="rainbow"
              rounded="full"
            >
              View All Projects
              <Icon name="arrow-right" />
            </ButtonTransitionLink>
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactSection />
    </Wrapper>
  );
}
