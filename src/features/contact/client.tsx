import { type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from "react";
import { RowLink, RowList } from "@/components/extras/rows";
import { Icon } from "@/components/icons";
import { ArrowLink } from "@/components/site/link";
import { CAL_URL, EMAIL, SOCIALS } from "@/components/site/nav";
import { Meta, Page, PixelHeading, Section } from "@/components/site/page";
import { TextTransition } from "@/components/text/text-transition";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Shortcut } from "@/components/ui/shortcut";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { clientLazy } from "@/components/utils/client-lazy";
import { cn } from "@/lib/cn";

// The Cal.com embed is heavy; it loads after hydration only.
const BookACall = clientLazy(
  () => import("./book-a-call"),
  <Skeleton shape="block" className="size-full rounded-none" />,
);

const field = (form: FormData, name: string) => String(form.get(name) ?? "").trim();

type SendState = "idle" | "sending" | "sent";

const LABEL: Record<SendState, string> = { idle: "Send message", sending: "Sending…", sent: "Sent" };

/** Drafts the message in the visitor's mail app; there is no backend to post to. */
function useSend() {
  const [state, setState] = useState<SendState>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = field(form, "name");
    const subject = encodeURIComponent(`Hello from ${name}`);
    const body = encodeURIComponent(`${field(form, "message")}

${name}
${field(form, "email")}`);
    timers.current.forEach(clearTimeout);
    setState("sending");
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    timers.current = [
      setTimeout(() => {
        setState("sent");
        toast.success("Opening your mail app", { description: `The draft to ${EMAIL} is ready to send.` });
      }, 700),
      setTimeout(() => setState("idle"), 3200),
    ];
  };

  return { state, send };
}

function submitOnModEnter(event: KeyboardEvent<HTMLFormElement>) {
  if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    event.currentTarget.requestSubmit();
  }
}

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
  const { state, send } = useSend();

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
            You can contact me using the form or via the links below.
          </p>
        </header>

        <form
          onSubmit={send}
          onKeyDown={submitOnModEnter}
          className="rise flex flex-col gap-5 [--i:1]"
          aria-labelledby="contact-title"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="contact-name">Name</FieldLabel>
              <Input id="contact-name" name="name" size="lg" required autoComplete="name" placeholder="Your name" />
            </Field>
            <Field>
              <FieldLabel htmlFor="contact-email">Email</FieldLabel>
              <Input
                id="contact-email"
                name="email"
                type="email"
                size="lg"
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="contact-message">Message</FieldLabel>
            <Textarea
              id="contact-message"
              name="message"
              rows={6}
              autoGrow
              maxRows={16}
              required
              placeholder="What are you working on?"
            />
          </Field>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Button type="submit" variant="dark" size="lg" aria-live="polite" className="min-w-36">
              <TextTransition text={LABEL[state]} variant="fade-through" />
            </Button>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground text-sm">
              or <Shortcut shortcut="mod+enter" /> to send
            </span>
          </div>
        </form>
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
