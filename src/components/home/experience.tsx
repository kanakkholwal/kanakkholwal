import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { Meta } from "@/components/site/page";
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
    <AccordionPrimitive.Root keepMounted className="-mx-3 flex flex-col">
      {work.map((job) => (
        <ExperienceRow key={job.path} job={job} />
      ))}
    </AccordionPrimitive.Root>
  );
}

function ExperienceRow({ job }: { job: WorkExperienceType }) {
  const range = `${job.startDate} → ${job.isOngoing || !job.endDate ? "Now" : job.endDate}`;
  return (
    <AccordionPrimitive.Item className="group/item rounded-xl transition-colors data-[open]:bg-foreground/[0.03]">
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left outline-none",
            "transition-[background-color,scale] duration-(--duration-base) ease-(--ease-out)",
            "hoverable:bg-foreground/[0.03] focus-visible:ring-2 focus-visible:ring-ring active:scale-(--press-scale-surface)",
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
          <svg
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground transition-[rotate] duration-(--duration-exit) ease-(--ease-out) group-data-[open]/item:rotate-180 group-data-[open]/item:duration-(--duration-overlay) motion-reduce:transition-none"
          >
            <path
              d="m4 6 4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Panel
        className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-(--duration-dropdown) ease-(--ease-out-quad) data-[open]:grid-rows-[1fr] data-[open]:duration-(--duration-collapse) motion-reduce:transition-none"
        render={(props, state) => <div {...props} inert={!state.open} />}
      >
        <div className="overflow-hidden">
          <div className="px-3 pb-4 pl-15">
            <Meta className="mb-2 block sm:hidden">{range}</Meta>
            <p className="mb-2 text-muted-foreground text-xs">
              {job.location} · {job.locationType}
            </p>
            <div className="prose prose-sm max-w-none prose-li:my-1 prose-ul:my-2 prose-p:my-2">
              <WorkBody path={job.path} />
            </div>
          </div>
        </div>
      </AccordionPrimitive.Panel>
    </AccordionPrimitive.Item>
  );
}
