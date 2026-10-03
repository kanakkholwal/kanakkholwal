import type { CSSProperties } from "react";
import { Meta, Page, PageHeader } from "@/components/site/page";
import { journey_data } from "~/data/journey";

const entries = [...journey_data].reverse();

export default function JourneyPageClient() {
  return (
    <Page>
      <PageHeader
        title="journey."
        description="How I got here, year by year. From the first internship to building my own products."
      />

      <ol className="flex max-w-3xl flex-col">
        {entries.map((entry, i) => (
          <li
            key={entry.date}
            className="group/entry rise grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-[6.5rem_minmax(0,1fr)]"
            style={{ "--i": i + 1 } as CSSProperties}
          >
            <Meta className="pt-1 sm:text-right">{entry.date}</Meta>
            <div className="relative flex min-w-0 flex-col gap-4 pb-14 sm:border-border sm:border-l sm:pl-8 group-last/entry:pb-0">
              <span
                aria-hidden
                className="absolute top-2 -left-[3.5px] hidden size-1.5 rounded-full bg-foreground/50 sm:block"
              />
              <h2 className="font-medium text-foreground text-lg">{entry.role}</h2>
              <div className="flex flex-col gap-4 text-base text-muted-foreground leading-7 text-pretty">
                {entry.content}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Page>
  );
}
