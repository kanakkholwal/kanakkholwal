import type { CSSProperties } from "react";
import { Icon, type IconType } from "@/components/icons";
import { ButtonLink } from "@/components/site/link";
import { CAL_URL, EMAIL } from "@/components/site/nav";
import { IconChip } from "@/components/stats/icon-chip";
import { Marker } from "@/components/text/marker";
import { RollText } from "@/components/text/roll-text";
import Link from "@/components/link";

type Area = { icon: IconType; title: string; line: string; href: string; proof: string };

// Decision (product): areas are what I have shipped or owned, phrased for a founder deciding who to message.
const AREAS: Area[] = [
  {
    icon: "shield-check",
    title: "Fintech compliance",
    line: "Name screening, adverse media, AML and STR filing for payment platforms.",
    href: "/journey",
    proof: "Zoven AI",
  },
  {
    icon: "sparkles",
    title: "AI tools and agents",
    line: "Local models, agent harnesses, voice and RAG, built so private data stays private.",
    href: "/projects/airlock",
    proof: "Airlock",
  },
  {
    icon: "code",
    title: "Developer tools",
    line: "Component libraries, docs engines and packages other developers install.",
    href: "/projects/baby-ui",
    proof: "Baby UI, Docvia",
  },
  {
    icon: "layout-grid",
    title: "Frontend and motion",
    line: "Interfaces where speed and the small details carry the product.",
    href: "/projects/baby-ui",
    proof: "this site",
  },
  {
    icon: "atom",
    title: "WebAssembly and local-first",
    line: "Heavy work in the browser: LaTeX compiled in a tab, files that never upload.",
    href: "/projects/glyphtex",
    proof: "GlyphTeX, Orbit Files",
  },
  {
    icon: "laptop",
    title: "Desktop apps",
    line: "Tauri and Rust apps for recording, editing and running models locally.",
    href: "/projects/recast",
    proof: "Recast, Airlock",
  },
];

/** What I can be hired for: a highlighted line for a skimming founder, six areas with proof, two ways to reach me. */
export function WorkWithMe() {
  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-[40rem] text-base text-muted-foreground leading-8 text-pretty">
        Building in{" "}
        <Marker variant="double-underline" tone="primary" durationMs={800}>
          <span className="text-foreground">fintech compliance</span>
        </Marker>
        ,{" "}
        <Marker variant="underline" tone="primary" delayMs={500}>
          <span className="text-foreground">AI tooling</span>
        </Marker>
        ,{" "}
        <Marker variant="underline" tone="primary" delayMs={750}>
          <span className="text-foreground">developer tools</span>
        </Marker>{" "}
        or{" "}
        <Marker variant="underline" tone="primary" delayMs={1000}>
          <span className="text-foreground">desktop and WebAssembly</span>
        </Marker>
        ? That is the work I have shipped, and the kind I like most.
      </p>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {AREAS.map((a, i) => (
          <li key={a.title} className="rise" style={{ "--i": i } as CSSProperties}>
            <Link
              href={a.href}
              className="group/area block h-full rounded-2xl bg-card p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex h-full flex-col gap-3 rounded-xl bg-background p-4 shadow-(--surface-shadow) transition-transform duration-(--duration-slow) ease-(--ease-out) hoverable:group-hover/area:-translate-y-px dark:bg-popover">
                <div className="flex items-center justify-between gap-2">
                  <IconChip name={a.icon} />
                  <Icon
                    name="arrow-up-right"
                    className="size-4 text-muted-foreground opacity-0 transition-opacity duration-(--duration-slow) group-hover/area:opacity-100"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-sm">{a.title}</p>
                  <p className="text-muted-foreground text-sm leading-6 text-pretty">{a.line}</p>
                </div>
                <p className="mt-auto font-mono text-muted-foreground text-xs">{a.proof}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-base text-muted-foreground">
        Not on the list? Send it anyway. I learn fast and <span className="font-medium text-foreground">own</span> the
        outcome.
      </p>

      <div className="flex flex-wrap gap-2">
        <ButtonLink href={CAL_URL} variant="default" size="md" className="group/roll">
          <Icon name="calendar" />
          <RollText text="Book an intro call" groupHover size="sm" />
        </ButtonLink>
        <ButtonLink href={`mailto:${EMAIL}`} variant="outline" size="md" className="group/roll">
          <Icon name="mail" />
          <RollText text="Send an email" groupHover size="sm" />
        </ButtonLink>
      </div>
    </div>
  );
}
