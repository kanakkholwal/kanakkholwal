import { appConfig } from "root/project.config";
import { ArrowLink } from "@/components/site/link";
import { Page, PageHeader, Section } from "@/components/site/page";
import { TechList, TechTile } from "@/components/site/tech-chip";

const GROUPS = Object.entries(appConfig.skills) as [string, readonly string[]][];

export default function TechStackPage() {
  return (
    <Page className="flex flex-col gap-16 lg:gap-12">
      <PageHeader
        title="tech stack."
        description="The tools I reach for most. A longer write-up on why is coming."
        className="mb-0"
      >
        <ArrowLink href="/projects" className="w-fit text-sm">
          See them in projects
        </ArrowLink>
      </PageHeader>

      {GROUPS.map(([group, tools], i) => (
        <Section key={group} id={group} title={`${group}.`} meta={tools.length} index={i + 1}>
          <TechList>
            {tools.map((tool) => (
              <li key={tool}>
                <TechTile name={tool} />
              </li>
            ))}
          </TechList>
        </Section>
      ))}
    </Page>
  );
}
