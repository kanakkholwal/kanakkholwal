import { Meta } from "@/components/site/page";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar/avatar";
import { cn } from "@/lib/cn";
import { useWorkExperiences, WorkBody, type WorkExperienceType } from "@/lib/content";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** Work history as quiet rows; a row opens in place to the full write-up. */
export function Experience() {
  const work = useWorkExperiences();

  return (
    <Accordion className="-mx-3 flex flex-col divide-y-0 overflow-visible rounded-none border-0">
      {work.map((job) => (
        <ExperienceRow key={job.path} job={job} />
      ))}
    </Accordion>
  );
}

function ExperienceRow({ job }: { job: WorkExperienceType }) {
  const range = `${job.startDate} → ${job.isOngoing || !job.endDate ? "Now" : job.endDate}`;
  return (
    <AccordionItem className="rounded-xl transition-colors data-[open]:bg-foreground/[0.03]">
      <AccordionTrigger
        className={cn(
          "justify-start gap-3 rounded-xl px-3 py-3 font-normal text-base",
          "transition-[background-color,scale] duration-(--duration-base) ease-(--ease-out)",
          "hoverable:bg-foreground/[0.03] active:scale-(--press-scale-surface)",
        )}
      >
        <Avatar shape="square" className="size-9 rounded-lg bg-background ring-1 ring-border dark:bg-muted">
          <AvatarImage src={job.logoUrl} alt="" className="object-contain p-1.5" />
          <AvatarFallback className="text-xs">{initials(job.company)}</AvatarFallback>
        </Avatar>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-medium text-foreground">{job.company}</span>
          <span className="truncate text-muted-foreground text-sm">
            {job.position}
            {job.employmentType ? ` · ${job.employmentType}` : ""}
          </span>
        </span>
        <Meta className="hidden shrink-0 sm:block">{range}</Meta>
      </AccordionTrigger>
      <AccordionContent className="px-3 pb-4 pl-15 text-base leading-normal">
        <Meta className="mb-2 block sm:hidden">{range}</Meta>
        <p className="mb-2 text-muted-foreground text-xs">
          {job.location} · {job.locationType}
        </p>
        <div className="prose prose-sm max-w-none prose-li:my-1 prose-ul:my-2 prose-p:my-2">
          <WorkBody path={job.path} />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
