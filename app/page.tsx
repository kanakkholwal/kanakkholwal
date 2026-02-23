import AboutSection from "@/components/application/section.about";
import GithubSection from "@/components/application/section.github";
import HeroSection from "@/components/application/section.hero";
import { ProjectsSection } from "@/components/application/section.projects";
import { WorkSection } from "@/components/application/section.work";
import { SkillSection } from "@/components/application/sections.skills";
import { ContactSection } from "@/components/contact";
import Wrapper from "@/components/wrapper";
import { Suspense } from "react";
import { appConfig } from "root/project.config";
import { getGithubStats } from "~/api/github";


export default async function HomePage() {
  const data = await getGithubStats(appConfig.usernames.github);

  return (
    <Wrapper isHome={true}>
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <SkillSection />
      {/* Projects */}
      <ProjectsSection />
      <Suspense
        fallback={
          <div className="max-w-app mx-auto px-6 md:px-12 py-24">
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
