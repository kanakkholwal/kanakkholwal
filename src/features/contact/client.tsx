import { useState } from "react";
import { RowLink, RowList } from "@/components/extras/rows";
import { Icon } from "@/components/icons";
import { ArrowLink, ButtonLink } from "@/components/site/link";
import { CAL_URL, EMAIL, SOCIALS } from "@/components/site/nav";
import { Meta, Page, PixelHeading, Section } from "@/components/site/page";
import { RollText } from "@/components/text/roll-text";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Skeleton } from "@/components/ui/skeleton";
import { clientLazy } from "@/components/utils/client-lazy";
import { cn } from "@/lib/cn";

// The Cal.com embed is heavy; it loads after hydration only.
const BookACall = clientLazy(
  () => import("./book-a-call"),
  <Skeleton shape="block" className="size-full rounded-none" />,
);

/** The calendar mounts on first open and stays mounted, so closing it can animate. */
function BookingPanel() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const toggle = () => {
    setMounted(true);
    setOpen((o) => !o);
  };

  return (
    <div className="max-w-2xl rounded-xl border border-border">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <Icon name="calendar" className="size-4 shrink-0 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">Prefer to talk? Book an intro call without leaving the page.</p>
        </div>
        <Button variant="outline" size="sm" onClick={toggle} aria-expanded={open} aria-controls="booking-calendar">
          {open ? "Hide calendar" : "Show calendar"}
          <Icon
            name="chevron-down"
            className={cn(
              "transition-[rotate] duration-(--duration-base) ease-(--ease-out) motion-reduce:transition-none",
              open && "rotate-180",
            )}
          />
        </Button>
      </div>
      <div
        id="booking-calendar"
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-(--duration-collapse) ease-(--ease-out) motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="h-[38rem] border-border border-t">{mounted ? <BookACall /> : null}</div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPageClient() {
  return (
    <Page className="flex flex-col gap-16 lg:gap-12">
      <section aria-labelledby="contact-title" className="flex max-w-2xl flex-col gap-8">
        <header className="rise flex flex-col gap-3">
          <div className="flex items-baseline gap-2.5">
            <Meta>01</Meta>
            <PixelHeading as="h1" id="contact-title" className="text-4xl">
              contact.
            </PixelHeading>
          </div>
          <p className="text-base text-muted-foreground text-pretty">
            Email is the quickest way to reach me. For a longer conversation, book a call below.
          </p>
        </header>

        <div className="rise flex flex-wrap items-center gap-3 rounded-xl border border-border p-4 [--i:1]">
          <Icon name="mail" className="size-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate font-medium text-foreground">{EMAIL}</span>
          <CopyButton text={EMAIL} label="Copy" copiedLabel="Copied" />
          <ButtonLink href={`mailto:${EMAIL}`} variant="default" size="sm" className="group/roll">
            <RollText text="Write an email" groupHover size="sm" />
          </ButtonLink>
        </div>
      </section>

      <Section id="socials" title="socials." number={2} description="Where else to find me." index={2}>
        <RowList className="grid max-w-2xl gap-x-4 sm:grid-cols-2">
          {SOCIALS.map((s) => (
            <RowLink
              key={s.href}
              href={s.href}
              icon={s.href === CAL_URL ? "calendar" : s.icon}
              aria-label={`${s.label}, ${s.handle}`}
            >
              <span className="text-foreground">{s.handle}</span>
            </RowLink>
          ))}
          <RowLink href={`mailto:${EMAIL}`} icon="mail" aria-label={`Email, ${EMAIL}`}>
            <span className="text-foreground">{EMAIL}</span>
          </RowLink>
        </RowList>
      </Section>

      <Section
        id="book"
        title="book a call."
        number={3}
        description="Pick a time that suits you."
        index={3}
        action={
          <ArrowLink href={CAL_URL} className="text-sm">
            Open in Cal.com
          </ArrowLink>
        }
      >
        <BookingPanel />
      </Section>
    </Page>
  );
}
