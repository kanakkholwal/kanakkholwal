import { appConfig } from "root/project.config";
import { RowLink, RowList } from "@/components/extras/rows";
import { Page, PageHeader, Section } from "@/components/site/page";
import { TextLink } from "@/components/site/link";

const BUILT_WITH = [
  { name: "Baby UI", role: "Components and motion", href: "https://github.com/kanakkholwal/baby-ui" },
  { name: "TanStack Start", role: "Framework", href: "https://tanstack.com/start" },
  { name: "Base UI", role: "Primitives", href: "https://base-ui.com" },
  { name: "Tailwind CSS", role: "Styling", href: "https://tailwindcss.com" },
  { name: "Fumadocs", role: "Writing", href: "https://fumadocs.dev" },
  { name: "Geist Pixel", role: "Display type", href: "https://vercel.com/font" },
  { name: "Solar", role: "Icons", href: "https://icon-sets.iconify.design/solar/" },
  { name: "Simple Icons", role: "Brand marks", href: "https://simpleicons.org" },
];

export default function AttributionPageClient() {
  const { journey, list } = appConfig.attribution;

  return (
    <Page className="flex flex-col gap-16 lg:gap-12">
      <PageHeader
        title="attribution."
        description="Standing on the shoulders of people who shared their work."
        className="mb-0"
      />

      <div className="rise flex max-w-2xl flex-col gap-6 [--i:1]">
        <div className="flex flex-col gap-4 text-base text-muted-foreground leading-7 text-pretty">
          {journey.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
        <ul className="flex flex-col">
          {list.map((credit) => (
            <li
              key={credit.person}
              className="flex flex-col gap-0.5 border-border border-b border-dashed py-3 first:border-t sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
            >
              {credit.url ? (
                <TextLink href={credit.url}>{credit.person}</TextLink>
              ) : (
                <span className="font-medium text-foreground">{credit.person}</span>
              )}
              <span className="text-muted-foreground text-sm">{credit.attribute.trim()}</span>
            </li>
          ))}
        </ul>
      </div>

      <Section
        id="built-with"
        title="built with."
        number={1}
        description="The open source this site runs on."
        meta={BUILT_WITH.length}
        index={2}
      >
        <RowList className="max-w-2xl">
          {BUILT_WITH.map((tool) => (
            <RowLink key={tool.name} href={tool.href} meta={tool.role}>
              <span className="font-medium text-foreground">{tool.name}</span>
            </RowLink>
          ))}
        </RowList>
      </Section>
    </Page>
  );
}
