import { GlowFillButton } from "@/components/animated/button.fill";
import { RollingText } from "@/components/animated/text.rolling";
import { ShimmeringText } from "@/components/animated/text.shimmer";
import { WorkExperienceCard } from "@/components/card.work";
import { Icon } from "@/components/icons";
import ShapeHero from "@/components/kokonutui/shape-hero";
import BlurFade from "@/components/magicui/blur-fade";
import {
  ExpandableCardProps,
  ExpandableProjectCards,
} from "@/components/project-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ButtonLink,
  ButtonScroll,
  ButtonTransitionLink,
  TransitionLink,
} from "@/components/utils/link";
import Wrapper from "@/components/wrapper";
import { ArrowRight } from "lucide-react";
// import { Suspense } from "react";
import Markdown from "react-markdown";
import { appConfig, resume_link } from "root/project.config";
// import { getCachedContributions } from "~/api/github";
import { educationExperiences } from "~/data/education";
import { projectsList } from "~/data/projects";
import { workExperiences } from "~/data/work";
// import { GithubSection } from "./client";

const BLUR_FADE_DELAY = 0.04;

export default async function HomePage() {
  // const data = await getCachedContributions(appConfig.usernames.github)
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
        className="max-w-6xl mx-auto w-full px-6 md:px-12 py-16"
      >
        <ShimmeringText
          text="Work Experience"
          className="text-2xl font-bold mb-8"
        />
        <div className="grid gap-6">
          {workExperiences.map((work, id) => (
            <BlurFade
              key={work.company}
              delay={BLUR_FADE_DELAY * 6 + id * 0.05}
            >
              <WorkExperienceCard
                logoUrl={work.logoUrl}
                altText={work.company}
                title={work.company}
                role={work.title}
                href={work.href}
                period={`${work.start} - ${work.end ?? "Present"}`}
                description={work.description}
              />
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section
        id="skills"
        className="max-w-6xl mx-auto w-full px-6 md:px-12 py-16"
      >
        <ShimmeringText text="Skills" className="text-2xl font-bold mb-8" />
        <div className="flex flex-wrap gap-3">
          {appConfig.skills.map((skill, id) => (
            <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
              <Button variant="outline" size="sm" className="sr-only">
                {skill}
              </Button>
            </BlurFade>
          ))}
        </div>
        <div
          className="h-40"
          style={{
            backgroundImage:
              "url('https://skillicons.dev/icons?i=js,ts,go,python,docker,postgres,mongodb,redis,firebase,npm,pnpm,git,github,gcp,svg,vercel,nextjs,vite,tailwind,notion,react,express,nodejs,postman,figma,bootstrap,html,css,sass')",
            backgroundRepeat: "no-repeat",
          }}
        />
      </section>

      {/* Github Activity */}
      {/* <Suspense
        fallback={
          <>
            <div className="h-96 w-full animate-pulse rounded-md bg-muted" />
          </>
        }
      >
        <GithubSection data={data} />
      </Suspense> */}
      {/* Projects */}
      <section id="projects" className="w-full py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <BlurFade delay={BLUR_FADE_DELAY * 11}>
            <div className="text-center space-y-4">
              <ShimmeringText
                text="Check out my latest work"
                className="text-3xl font-bold tracking-tight sm:text-5xl block"
              />

              <p className="text-muted-foreground max-w-2xl mx-auto md:text-lg">
                From web apps, packages to low-code platforms, here are some of
                my favorite projects.
              </p>
            </div>
          </BlurFade>
          <ExpandableProjectCards
            cards={projectsList as unknown as ExpandableCardProps["cards"]}
          />
          <div className="flex mx-auto justify-center gap-2">
            <ButtonTransitionLink href="/stats" variant="outline">
              <Icon name="trend-up" />
              View Stats
            </ButtonTransitionLink>
            <ButtonTransitionLink href="/projects" variant="rainbow">
              View All Projects
              <Icon name="arrow-right" />
            </ButtonTransitionLink>
          </div>
        </div>
      </section>
      {/* Education */}
      <section
        id="education"
        className="max-w-6xl mx-auto w-full px-6 md:px-12 py-16"
      >
        <ShimmeringText text="Education" className="text-2xl font-bold mb-8" />
        <div className="grid gap-6">
          {educationExperiences.map((education, id) => (
            <BlurFade
              key={education.school}
              delay={BLUR_FADE_DELAY * 8 + id * 0.05}
            >
              <WorkExperienceCard
                href={education.href}
                logoUrl={education.logoUrl}
                altText={education.school}
                title={education.school}
                role={education.degree}
                period={`${education.start} - ${education.end}`}
              />
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="relative z-0 mt-40 flex w-full justify-center overflow-x-hidden px-4 py-20"
      >
        <ShapeHero
          title1=""
          title2=""
          description=""
          shapeClassName="opacity-30 hidden md:block"
          className="w-full"
        >
          <div className="relative z-10 mx-auto flex w-full container flex-col items-center justify-center gap-y-2 py-10 text-center ">
            <span className="mt-4 text-2xl font-light tracking-wide text-black sm:text-4xl lg:text-5xl dark:text-white">
              <h3
                className="text-nowrap"
                style={{ opacity: 1, transform: "none" }}
              >
                FROM CONCEPT TO <span className="font-extrabold">CREATION</span>
              </h3>
              <h3
                className="mt-3 text-nowrap"
                style={{ opacity: 1, transform: "none" }}
              >
                LET{"'"}s MAKE IT{" "}
                <span className="font-extrabold">HAPPEN!</span>
              </h3>
            </span>
            <div className="group" style={{ transform: "none" }}>
              <GlowFillButton icon={ArrowRight}>
                <TransitionLink href="/contact">Get in Touch</TransitionLink>
              </GlowFillButton>
            </div>
            <p className="text-base font-semibold lg:text-2xl">
              I{"'"}m available for full-time roles &amp; freelance projects.
            </p>
            <p className="my-2 text-sm font-extralight tracking-wide text-balance opacity-75 lg:text-xl">
              I thrive on crafting dynamic web applications, and
              <br />
              delivering seamless user experiences.
            </p>
          </div>
        </ShapeHero>
      </section>
    </Wrapper>
  );
}

function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex flex-col sm:grid md:grid-cols-2 items-center justify-between gap-8 px-6 md:px-12 min-h-dvh max-w-6xl mx-auto w-full"
    >
      <div className="flex flex-col gap-4 justify-center text-center md:text-left flex-1 md:col-span-1">
        <ShimmeringText
          text={`Hi, I'm ${appConfig.name.split(" ")[0]}`}
          className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
        />
        <RollingText
          className="text-muted-foreground max-w-lg md:text-xl"
          delay={BLUR_FADE_DELAY}
          text={appConfig.description}
          inView={true}
          inViewOnce={false}
        />
        <div className="mt-5 flex justify-center md:justify-start items-center gap-4 w-full  flex-wrap">
          <ButtonLink
            variant="dark"
            href={resume_link}
            target="_blank"
            effect="gooeyRight"
            size="lg"
            rounded="full"
          >
            Download Resume
            <Icon name="arrow-up-right" />
          </ButtonLink>
          <GlowFillButton icon={ArrowRight} className="h-11 my-0">
            <TransitionLink
              // variant="ghost"
              href="/journey"
            // effect="shineHover"
            >
              My Journey
              {/* <Icon name="arrow-right" /> */}
            </TransitionLink>
          </GlowFillButton>
        </div>
      </div>
      <BlurFade
        delay={BLUR_FADE_DELAY}
        className="hidden sm:col-span-1 md:flex justify-center"
      >
        <Avatar className="size-32 md:size-60 border-4 border-primary/20 shadow-lg">
          <AvatarImage alt={appConfig.name} src={appConfig.logo} />
          <AvatarFallback>{appConfig.initials}</AvatarFallback>
        </Avatar>
      </BlurFade>
      <div className="md:col-span-2 flex justify-center flex-col gap-4 mx-auto items-center">
        <RollingText
          className="text-muted-foreground max-w-lg md:text-xs"
          delay={BLUR_FADE_DELAY}
          text="Scroll down to explore my work and experience!"
        />
        <ButtonScroll
          variant="ghost"
          size="icon"
          rounded="full"
          className="animate-bounce rotate-180"
          targetId="work"
          offset={100}
        >
          <Icon name="arrow-up" />
        </ButtonScroll>
      </div>
    </section>
  );
}
