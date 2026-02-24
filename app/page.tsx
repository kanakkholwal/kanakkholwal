import AboutSection from "@/components/application/section.about";
import GithubSectionSSR from "@/components/application/section.github.ssr";
import HeroSection from "@/components/application/section.hero";
import ProjectsSection from "@/components/application/section.projects";
import WorkSection from "@/components/application/section.work";
import SkillSection from "@/components/application/sections.skills";
import { ContactSection } from "@/components/contact";
import Wrapper from "@/components/wrapper";


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
