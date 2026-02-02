import { AboutSection } from "@/components/application/section.about";
import GithubSection from "@/components/application/section.github";
import { HeroSection } from "@/components/application/section.hero";
import { ProjectsSection } from "@/components/application/section.projects";
import { WorkSection } from "@/components/application/section.work";
import { SkillSection } from "@/components/application/sections.skills";
import { ContactSection } from "@/components/contact";
import Wrapper from "@/components/wrapper";
import { Suspense } from "react";
import { appConfig } from "root/project.config";
import { getGithubStats } from "~/api/github";



export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getGithubStats(appConfig.usernames.github);

  return (
    <Wrapper className="overflow-hidden">
      <div className="fixed inset-0 -z-50 h-full w-full bg-background opacity-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)" />

      <HeroSection />

      <AboutSection />

      {/* Work Experience */}
      <WorkSection />
      {/* Skills */}
      <SkillSection />
      {/* Projects */}
      <ProjectsSection />
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


