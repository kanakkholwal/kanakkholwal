import { createFileRoute } from "@tanstack/react-router";
import { Activity } from "@/components/home/activity";
import { Experience } from "@/components/home/experience";
import { Hero } from "@/components/home/hero";
import { Lately } from "@/components/home/lately";
import { OpenSource } from "@/components/home/open-source";
import { ProjectList } from "@/components/projects/project-list";
import { ArrowLink } from "@/components/site/link";
import { Page, Section } from "@/components/site/page";
import { PostList } from "@/components/writing/post-list";
import { useProjects } from "@/lib/content";
import { getDocsIndex } from "~/server/content";
import { getHomeData } from "~/server/home";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [home, docs] = await Promise.all([getHomeData(), getDocsIndex()]);
    return { home, docs: docs.slice(0, 4) };
  },
  staleTime: 5 * 60_000,
  component: HomePage,
});

function HomePage() {
  const { home, docs } = Route.useLoaderData();
  const projects = useProjects();

  return (
    <Page className="flex flex-col gap-16 lg:gap-12">
      <div className="flex flex-col gap-10">
        <Hero />
        <Activity days={home.calendar} />
      </div>

      <Section
        id="projects"
        title="projects."
        number={1}
        description="Things I've built and shipped."
        meta={projects.length}
        index={3}
        action={
          <ArrowLink href="/projects" className="text-sm">
            All projects
          </ArrowLink>
        }
      >
        <ProjectList projects={projects.slice(0, 5)} />
      </Section>

      <Section
        id="experience"
        title="experience."
        number={2}
        description="Where I've worked and what I owned."
        index={4}
      >
        <Experience />
      </Section>

      {docs.length ? (
        <Section
          id="writing"
          title="writing."
          number={3}
          description="Notes on systems I've had to figure out."
          index={5}
          action={
            <ArrowLink href="/docs" className="text-sm">
              All writing
            </ArrowLink>
          }
        >
          <PostList
            posts={docs.map((d) => ({ url: d.url, title: d.title, description: d.description, date: d.lastModified }))}
          />
        </Section>
      ) : null}

      {home.github ? (
        <Section
          id="open-source"
          title="open source."
          number={4}
          description="Public work, counted."
          index={6}
          action={
            <ArrowLink href="/stats" className="text-sm">
              Stats
            </ArrowLink>
          }
        >
          <div className="flex flex-col gap-6">
            <OpenSource github={home.github} projects={home.stats.projects} />
            {home.activity.length ? <Lately items={home.activity} /> : null}
          </div>
        </Section>
      ) : null}
    </Page>
  );
}
