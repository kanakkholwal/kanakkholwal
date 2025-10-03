import { RollingText } from "@/components/animated/text.rolling";
import { ShimmeringText } from "@/components/animated/text.shimmer";
import { WorkExperienceCard } from "@/components/card.work";
import { Timeline } from "@/components/extended/timeline";
import { Icon } from "@/components/icons";
import BlurFade from "@/components/magicui/blur-fade";
import { ExpandableCardProps, ExpandableProjectCards } from "@/components/project-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ButtonLink, ButtonScroll, ButtonTransitionLink } from "@/components/utils/link";
import Wrapper from "@/components/wrapper";
import Link from "next/link";
import Markdown from "react-markdown";
import { resume_link } from "root/project.config";
import { journey_data } from "~/data/journey";
import { DATA } from "~/data/resume";
import { workExperiences } from "~/data/work";

const BLUR_FADE_DELAY = 0.04;

export default function Page() {
  return (
    <Wrapper>
      {/* Hero */}
      <HeroSection />
      {/* About */}
      <section className="w-full backdrop-blur-2xl py-12 px-6 md:px-12 hidden" id="about">
        <div className="max-w-4xl mx-auto flex flex-col gap-6 text-center md:text-left">
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <h2 className="text-2xl font-semibold">About Me</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <div className="prose dark:prose-invert text-muted-foreground max-w-none">
              <Markdown>
                {DATA.summary}
              </Markdown>
            </div>
          </BlurFade>

        </div>
      </section>
      <div className="relative w-full overflow-clip" id="journey">
        <Timeline data={journey_data} />
      </div>
      {/* Work Experience */}
      <section id="work" className="max-w-6xl mx-auto w-full px-6 md:px-12 py-16">
        <ShimmeringText wave text="Work Experience"
          className="text-2xl font-bold mb-8"
        />
        <div className="grid gap-6">
          {workExperiences.map((work, id) => (
            <BlurFade key={work.company} delay={BLUR_FADE_DELAY * 6 + id * 0.05}>
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

      {/* Education */}
      <section id="education" className="max-w-6xl mx-auto w-full px-6 md:px-12 py-16 bg-muted/30">

        <ShimmeringText wave text="Education"
          className="text-2xl font-bold mb-8"
        />
        <div className="grid gap-6">
          {DATA.education.map((education, id) => (
            <BlurFade key={education.school} delay={BLUR_FADE_DELAY * 8 + id * 0.05}>
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

      {/* Skills */}
      <section id="skills" className="max-w-6xl mx-auto w-full px-6 md:px-12 py-16">
        <BlurFade delay={BLUR_FADE_DELAY * 9}>
          <h2 className="text-2xl font-bold mb-8">Skills</h2>
        </BlurFade>
        <div className="flex flex-wrap gap-3">
          {DATA.skills.map((skill, id) => (
            <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
              <Button variant="outline" size="sm">
                {skill}
              </Button>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="w-full py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <BlurFade delay={BLUR_FADE_DELAY * 11}>
            <div className="text-center space-y-4">
              <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                My Projects
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                Check out my latest work
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto md:text-lg">
                From web apps to low-code platforms, here are some of my favorite projects.
              </p>
            </div>
          </BlurFade>
          <ExpandableProjectCards cards={DATA.projects as unknown as ExpandableCardProps["cards"]} />
          <div className="flex mx-auto justify-center">
            <ButtonTransitionLink href="/projects" variant="dark">
              View All Projects
              <Icon name="arrow-right" />
            </ButtonTransitionLink>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-6xl mx-auto w-full px-6 md:px-12 py-16">
        <BlurFade delay={BLUR_FADE_DELAY * 16}>
          <div className="text-center space-y-4">
            <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
              Contact
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Get in Touch</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
              Want to chat? DM me{" "}
              <Link
                href={DATA.contact.social.Twitter.url}
                className="text-primary hover:underline"
              >
                on Twitter
              </Link>{" "}
              and I’ll respond whenever I can.
            </p>
          </div>
        </BlurFade>
      </section>
    </Wrapper>
  );
}

function HeroSection() {

  return <section
    id="hero"
    className="relative flex flex-col md:grid md:grid-cols-2 items-center justify-between gap-8 px-6 md:px-12 py-40 min-h-dvh max-w-6xl mx-auto w-full"
  >
    <div className="flex flex-col gap-4 text-center md:text-left flex-1 md:col-span-1">

      <ShimmeringText text={`Hi, I'm ${DATA.name.split(" ")[0]}`}
        className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl" />
      <RollingText
        className="text-muted-foreground max-w-lg md:text-xl"
        delay={BLUR_FADE_DELAY}
        text={DATA.description}
        inView={true}
        inViewOnce={false}
      />
      <div className="mt-5">

        <ButtonLink variant="dark" href={resume_link} target="_blank" effect="gooeyRight">
          Download Resume
          <Icon name="arrow-up-right" />
        </ButtonLink>
      </div>
    </div>
    <BlurFade delay={BLUR_FADE_DELAY} className="md:col-span-1 flex justify-center">
      <Avatar className="size-32 md:size-60 border-4 border-primary/20 shadow-lg">
        <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
        <AvatarFallback>{DATA.initials}</AvatarFallback>
      </Avatar>
    </BlurFade>
    <div className="md:col-span-2 flex justify-center mt-12 md:mt-0 flex-col gap-4 mx-auto items-center">
      <RollingText
        className="text-muted-foreground max-w-lg md:text-xs"
        delay={BLUR_FADE_DELAY}
        text="Scroll down to explore my work and experience!"
      />
      <ButtonScroll variant="ghost" size="icon" rounded="full"
        className="animate-bounce rotate-180" targetId="journey" offset={100}>
        <Icon name="arrow-up" />
      </ButtonScroll>
    </div>

  </section>

}

