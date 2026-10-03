import AboutSection from "@/components/application/section.about";
import HeroSection from "@/components/application/section.hero";
import Wrapper from "@/components/wrapper";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { getGithubSectionData, getHeroOrbit } from "~/server/home";

// Below-the-fold sections are code-split but still server-rendered.
const WorkSection = lazy(() => import("@/components/application/section.work"));
const SkillSection = lazy(() => import("@/components/application/sections.skills"));
const ProjectsSection = lazy(() => import("@/components/application/section.projects"));
const GithubSection = lazy(() => import("@/components/application/section.github"));
const ContactSection = lazy(() =>
  import("@/components/contact").then((m) => ({ default: m.ContactSection })),
);

export const Route = createFileRoute("/")({
  loader: async () => {
    const [orbitData, github] = await Promise.all([getHeroOrbit(), getGithubSectionData()]);
    return { orbitData, github };
  },
  staleTime: 5 * 60_000,
  component: HomePage,
});

function HomePage() {
  const { orbitData, github } = Route.useLoaderData();
  return (
    <Wrapper isHome>
      <HeroSection orbitData={orbitData} />
      <AboutSection />
      <Suspense fallback={null}>
        <WorkSection />
        <SkillSection />
        <ProjectsSection />
        {github && <GithubSection data={github} />}
        <ContactSection />
      </Suspense>
    </Wrapper>
  );
}
