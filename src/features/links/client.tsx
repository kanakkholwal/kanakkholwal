import type { CSSProperties, ReactNode } from "react";
import { appConfig, resume_link } from "root/project.config";
import { RowArrow, rowClass } from "@/components/extras/rows";
import { Icon, type IconType } from "@/components/icons";
import Link from "@/components/link";
import { isExternal } from "@/components/site/link";
import { CAL_URL, EMAIL, SOCIALS } from "@/components/site/nav";
import { Meta, Page, PixelHeading } from "@/components/site/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar/avatar";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/cn";

type Tile = { label: string; sub: string; href: string; icon: IconType };

const PRIMARY: Tile[] = [
  { label: "Resume", sub: "PDF on Google Drive", href: resume_link, icon: "document" },
  { label: "Book a call", sub: "A 20 minute intro on Cal.com", href: CAL_URL, icon: "calendar" },
  { label: "Projects", sub: "Things I've built and shipped", href: "/projects", icon: "rocket" },
];

const ELSEWHERE: Tile[] = SOCIALS.filter((s) => s.href !== CAL_URL).map((s) => ({
  label: s.label,
  sub: s.handle,
  href: s.href,
  icon: s.icon,
}));

function TileIcon({ name }: { name: IconType }) {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-background text-muted-foreground ring-1 ring-border transition-colors group-hover/row:text-foreground dark:bg-muted">
      <Icon name={name} className="size-4.5" />
    </span>
  );
}

function TileText({ label, sub }: { label: string; sub: string }) {
  return (
    <span className="flex min-w-0 flex-1 flex-col">
      <span className="truncate font-medium text-foreground">{label}</span>
      <span className="truncate text-muted-foreground text-sm">{sub}</span>
    </span>
  );
}

function TileLink({ tile }: { tile: Tile }) {
  const external = isExternal(tile.href);
  return (
    <li>
      <Link
        href={tile.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={cn(rowClass, "gap-4 py-3")}
      >
        <TileIcon name={tile.icon} />
        <TileText label={tile.label} sub={tile.sub} />
        <RowArrow external={external} />
      </Link>
    </li>
  );
}

/** Email opens the mail app; the copy button sits beside the link, not inside it. */
function EmailTile() {
  return (
    <li className="relative">
      <a href={`mailto:${EMAIL}`} className={cn(rowClass, "gap-4 py-3 pr-24")}>
        <TileIcon name="mail" />
        <TileText label="Email" sub={EMAIL} />
      </a>
      <CopyButton text={EMAIL} className="absolute top-1/2 right-3 -translate-y-1/2" />
    </li>
  );
}

function TileList({ label, children, index }: { label: string; children: ReactNode; index: number }) {
  return (
    <section aria-label={label} className="rise flex flex-col gap-2" style={{ "--i": index } as CSSProperties}>
      <Meta>{label}</Meta>
      <ul className="group/list -mx-3 flex flex-col">{children}</ul>
    </section>
  );
}

export default function LinksPageClient() {
  return (
    <Page>
      <div className="mx-auto max-w-md">
        <header className="rise mb-12 flex flex-col items-center gap-4 text-center">
          <Avatar className="size-20 shadow-(--surface-shadow) ring-1 ring-border">
            <AvatarImage src={appConfig.avatar} alt={appConfig.displayName} fetchPriority="high" />
            <AvatarFallback>{appConfig.initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <PixelHeading as="h1" className="text-4xl">
              {appConfig.displayName}
            </PixelHeading>
            <p className="text-base text-muted-foreground">
              {appConfig.role} <span aria-hidden>·</span> {appConfig.location}
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-10">
          <TileList label="Start here" index={1}>
            <EmailTile />
            {PRIMARY.map((tile) => (
              <TileLink key={tile.href} tile={tile} />
            ))}
          </TileList>
          <TileList label="Elsewhere" index={2}>
            {ELSEWHERE.map((tile) => (
              <TileLink key={tile.href} tile={tile} />
            ))}
          </TileList>
        </div>
      </div>
    </Page>
  );
}
