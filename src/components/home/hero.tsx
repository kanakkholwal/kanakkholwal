import { appConfig } from "root/project.config";
import { TextLink } from "@/components/site/link";
import { PixelHeading } from "@/components/site/page";
import { RevealText } from "@/components/text/reveal-text";
import { TextLoop } from "@/components/text/text-loop";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar/avatar";

const ROLES = ["Product Engineer", "Design Engineer", "Full-stack Developer"];

export function Hero() {
  return (
    <section aria-labelledby="hero-name" className="flex flex-col gap-8">
      <div className="rise flex items-center gap-4">
        <Avatar className="size-16 shadow-(--surface-shadow) ring-1 ring-border lg:hidden">
          <AvatarImage src={appConfig.avatar} alt={appConfig.displayName} fetchPriority="high" />
          <AvatarFallback>{appConfig.initials}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-1">
          <PixelHeading as="h1" id="hero-name" className="text-4xl">
            <RevealText as="span" text={appConfig.displayName} split="char" staggerMs={28} blur={6} />
          </PixelHeading>
          <p className="text-base text-muted-foreground">
            {appConfig.location} <span aria-hidden>·</span> <TextLoop items={ROLES} variant="roll" intervalMs={3200} />
          </p>
        </div>
      </div>

      <div className="rise flex max-w-[38rem] flex-col gap-4 text-base text-muted-foreground leading-7 text-pretty [--i:1]">
        <p>
          I care about the parts of software people feel before they notice: how a menu opens, how fast a page shows up,
          how a number ticks over. I build products end to end, from the first sketch to the deploy.
        </p>
        <p>
          I made <TextLink href="https://github.com/kanakkholwal/baby-ui">Baby UI</TextLink>, an animated component
          library for React and Svelte, and this site runs on it. Lately I'm shipping{" "}
          <TextLink href="/projects/recast">Recast</TextLink> and <TextLink href="/projects/orbit">Orbit</TextLink>.
        </p>
      </div>
    </section>
  );
}
