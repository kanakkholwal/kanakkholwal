import type { appConfig } from "root/project.config";
import { TextLink } from "@/components/site/link";
import { Meta, Page, PageHeader } from "@/components/site/page";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";

type BucketItem = (typeof appConfig.bucketList)[number];

const URL_PART = /^https?:\/\//;

/** Descriptions read "October 2024, https://…"; split the date from an optional link. */
function parse(description: string | null) {
  const parts = (description ?? "").split(/,\s*/).filter(Boolean);
  return { date: parts.find((p) => !URL_PART.test(p)), href: parts.find((p) => URL_PART.test(p)) };
}

function Mark({ done }: { done: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-5 shrink-0">
      {done ? (
        <>
          <circle cx="10" cy="10" r="9" className="fill-foreground" />
          <path
            d="m6 10.4 2.7 2.6L14.2 7"
            className="stroke-background"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <circle cx="10" cy="10" r="8.25" className="stroke-border-strong" strokeWidth="1.5" />
      )}
    </svg>
  );
}

function Row({ item }: { item: BucketItem }) {
  const { date, href } = parse(item.description);
  return (
    <li className="flex items-center gap-3 rounded-xl px-3 py-2.5">
      <Mark done={item.completed} />
      <span className="sr-only">{item.completed ? "Done:" : "Not yet:"}</span>
      <span className={cn("min-w-0 flex-1 text-pretty", item.completed ? "text-foreground" : "text-muted-foreground")}>
        {href ? <TextLink href={href}>{item.name}</TextLink> : item.name}
      </span>
      {date ? <Meta className="shrink-0">{date}</Meta> : null}
    </li>
  );
}

export default function BucketListClient({ items }: { items: readonly BucketItem[] }) {
  const done = items.filter((i) => i.completed);
  const ordered = [...done, ...items.filter((i) => !i.completed)];

  return (
    <Page>
      <PageHeader
        title="bucket list."
        description="Things I want to do at least once. A few are ticked off; most are still waiting for the right year."
      />

      <div className="rise flex max-w-2xl flex-col gap-6 [--i:1]">
        <div className="flex items-center gap-4">
          <Progress
            value={done.length}
            max={items.length}
            size="sm"
            label="Bucket list progress"
            className="flex-1 [&>div]:bg-foreground/10 [&_.progress-fill]:bg-foreground"
          />
          <Meta className="shrink-0">
            {done.length} of {items.length} done
          </Meta>
        </div>

        <ul className="-mx-3 flex flex-col">
          {ordered.map((item) => (
            <Row key={item.name} item={item} />
          ))}
        </ul>
      </div>
    </Page>
  );
}
