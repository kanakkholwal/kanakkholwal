import AboutSection from "@/components/application/section.about";
import HeroSection from "@/components/application/section.hero";
import Wrapper from "@/components/wrapper";
import dynamic from "next/dynamic";

// Code-split below-fold sections (ssr: true for SEO by default)
const WorkSection = dynamic(() => import("@/components/application/section.work"));
const SkillSection = dynamic(() => import("@/components/application/sections.skills"));
const ProjectsSection = dynamic(() => import("@/components/application/section.projects"));
const GithubSectionSSR = dynamic(() => import("@/components/application/section.github.ssr"));
const ContactSection = dynamic(
  () => import("@/components/contact").then((m) => ({ default: m.ContactSection })),
  { ssr: true },
);


export default function HomePage() {
  return (
    <Wrapper isHome={true}>
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <SkillSection />
      <ProjectsSection />
      <GithubSectionSSR />
      <ContactSection />
    </Wrapper>
  );
}
