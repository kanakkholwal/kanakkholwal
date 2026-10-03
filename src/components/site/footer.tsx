import { useSyncExternalStore } from "react";
import { appConfig } from "root/project.config";
import { Icon } from "@/components/icons";
import Link from "@/components/link";
import { RollText } from "@/components/text/roll-text";
import { TextTransition } from "@/components/text/text-transition";
import { SOCIALS } from "./nav";

const TIME = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function subscribeMinute(onChange: () => void) {
  const id = setInterval(onChange, 15_000);
  return () => clearInterval(id);
}

/** Local time in India; empty on the server so hydration never disagrees. */
function useLocalTime() {
  return useSyncExternalStore(
    subscribeMinute,
    () => TIME.format(new Date()),
    () => "",
  );
}

const COLUMNS = [
  {
    title: "Site",
    links: [
      { label: "Home", href: "/" },
      { label: "Projects", href: "/projects" },
      { label: "Writing", href: "/docs" },
      { label: "Stats", href: "/stats" },
      { label: "Analytics", href: "/analytics" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Journey", href: "/journey" },
      { label: "Bucket list", href: "/bucket-list" },
      { label: "Blog", href: "/blog" },
      { label: "Links", href: "/links" },
      { label: "Attribution", href: "/attribution" },
      { label: "Privacy", href: "/legal/privacy" },
    ],
  },
  { title: "Elsewhere", links: SOCIALS.map((s) => ({ label: s.label, href: s.href })) },
];

export function SiteFooter() {
  const time = useLocalTime();

  return (
    <footer className="mx-auto w-full max-w-page px-5 pb-10 sm:px-6 lg:max-w-none lg:border-border lg:border-t lg:border-dashed lg:px-10">
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-border border-t border-dashed pt-10 sm:grid-cols-[1.4fr_1fr_1fr_1fr] lg:border-t-0">
        <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
          <p className="pixel text-xl">kanak.</p>
          <p className="max-w-56 text-muted-foreground text-sm text-pretty">
            Product engineer. Building interfaces that feel fast and considered.
          </p>
          <p className="flex items-center gap-1.5 font-mono text-muted-foreground text-xs tabular-nums">
            <Icon name="map-pin" className="size-3.5" />
            {appConfig.location}
            <span aria-hidden>·</span>
            <span className="min-w-[3.25rem]">{time ? <TextTransition as="span" text={`${time} IST`} /> : "IST"}</span>
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title} className="flex flex-col gap-2.5 text-sm">
            <p className="font-mono text-muted-foreground text-xs">{col.title}</p>
            {col.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group/roll w-fit text-muted-foreground transition-colors hoverable:text-foreground"
                {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <RollText text={l.label} groupHover size="sm" className="cursor-[inherit]" />
              </Link>
            ))}
          </nav>
        ))}
      </div>
      <div className="mt-12 flex items-center justify-between gap-4 font-mono text-muted-foreground text-xs">
        <span>
          © {new Date().getFullYear()} {appConfig.displayName}
        </span>
        <button
          type="button"
          className="group/roll inline-flex items-center gap-1 transition-colors hoverable:text-foreground"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            });
            document.getElementById("main")?.focus({ preventScroll: true });
          }}
        >
          <RollText text="Back to top" groupHover size="sm" className="cursor-[inherit] text-xs" />
          <Icon
            name="arrow-up"
            className="size-3.5 transition-transform duration-(--duration-fast) ease-(--ease-out) group-hover/roll:-translate-y-0.5"
          />
        </button>
      </div>
    </footer>
  );
}
