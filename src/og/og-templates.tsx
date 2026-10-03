import type { ReactNode } from "react";
import { appConfig } from "root/project.config";
import { ICONS } from "@/components/icons/generated";

const INK = "#18181b";
const MUTED = "#71717a";
const FAINT = "#a1a1aa";
const ACCENT = "#2a78d6";

type IconName = keyof typeof ICONS;

/** Icon as a data URI: the renderer paints `<img>` reliably, inline SVG markup less so. */
function iconSrc(name: IconName, color = "#3f3f46") {
  const icon = ICONS[name];
  const body = icon.body.replaceAll("currentColor", color);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}" fill="${icon.fill === "none" ? "none" : color}">${body}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** The one card layout: a raised tile, a name with a muted suffix, one line of description. */
function SoftCard({
  tile,
  name,
  suffix,
  description,
  footer,
  nameSize = 84,
  mark = true,
  dark = false,
}: {
  nameSize?: number;
  mark?: boolean;
  tile: ReactNode;
  name: string;
  suffix?: string;
  description?: string;
  footer?: string;
  dark?: boolean;
}) {
  const ink = dark ? "#f4f4f5" : INK;
  const muted = dark ? "#a1a1aa" : MUTED;
  return (
    <div
      tw="flex flex-col relative w-full h-full px-[120px] pt-[110px]"
      style={{ backgroundColor: dark ? "#141415" : "#fafafa", fontFamily: "Geist" }}
    >
      <div
        tw="flex relative items-center justify-center w-[168px] h-[168px] rounded-[44px]"
        style={{
          backgroundColor: dark ? "#1f1f22" : "#ffffff",
          boxShadow: dark
            ? "0 0 0 1px rgba(255,255,255,0.08), 0 24px 48px rgba(0,0,0,0.4)"
            : "0 0 0 1px rgba(24,24,27,0.06), 0 2px 6px rgba(0,0,0,0.04), 0 24px 48px rgba(0,0,0,0.07)",
        }}
      >
        {tile}
        {mark ? (
          <div
            tw="absolute top-[18px] right-[18px] w-[14px] h-[14px] rounded-full"
            style={{ backgroundColor: ACCENT }}
          />
        ) : null}
      </div>

      <div
        tw="flex flex-wrap items-baseline mt-[64px] max-w-[960px]"
        style={{ fontSize: nameSize, letterSpacing: "-0.035em", lineHeight: 1.08 }}
      >
        <span style={{ color: ink, fontWeight: 600 }}>{name}</span>
        {suffix ? <span style={{ color: muted, fontWeight: 400 }}>{suffix}</span> : null}
      </div>
      {description ? (
        <div tw="flex mt-[28px] max-w-[940px]" style={{ fontSize: 36, lineHeight: 1.35, color: muted }}>
          {description}
        </div>
      ) : null}

      {footer ? (
        <div
          tw="flex absolute left-[120px] bottom-[64px]"
          style={{ fontFamily: "Geist Mono", fontSize: 22, color: dark ? "#71717a" : FAINT }}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}

function IconTile({ name }: { name: IconName }) {
  return <img src={iconSrc(name)} width={84} height={84} alt="" />;
}

const [SITE, ...TLD] = appConfig.siteUrl.split(".");

/** Site-wide card: photo tile and the domain as the wordmark. */
export function ProfileOgTemplate({ avatar }: { avatar?: string }) {
  return (
    <SoftCard
      tile={
        avatar ? (
          <img src={avatar} width={136} height={136} alt="" tw="rounded-[34px]" style={{ objectFit: "cover" }} />
        ) : (
          <IconTile name="user" />
        )
      }
      mark={!avatar}
      name={SITE}
      suffix={`.${TLD.join(".")}`}
      description={`${appConfig.displayName}, product engineer. Interfaces, tooling and the details in between.`}
    />
  );
}

const PROJECT_ICON: Record<string, IconName> = {
  recast: "play",
  orbit: "document",
  docvia: "book",
  "college-ecosystem": "users",
  "nexo-editor": "pen",
  "custom-domain-sdk": "globe",
  "crawler-llms": "code",
};

/** Splits "Recast" + "recast.li" into a wordmark and a muted domain suffix when they match. */
function domainSuffix(title: string, href?: string) {
  if (!href) return undefined;
  try {
    const [first, ...rest] = new URL(href).hostname.replace(/^www\./, "").split(".");
    const slug = title.toLowerCase().replace(/[^a-z0-9]/g, "");
    const tail = `.${rest.join(".")}`;
    // Only a short TLD reads as part of the name ("Recast.li"); a parent domain is noise.
    return first.replace(/[^a-z0-9]/g, "") === slug && rest.length === 1 && tail.length <= 5 ? tail : undefined;
  } catch {
    return undefined;
  }
}

export function ProjectOgTemplate({
  id,
  title,
  description,
  href,
  dark,
}: {
  id: string;
  title: string;
  description: string;
  href?: string;
  dark?: boolean;
}) {
  return (
    <SoftCard
      tile={<IconTile name={PROJECT_ICON[id] ?? "rocket"} />}
      name={title}
      suffix={domainSuffix(title, href)}
      description={description}
      footer={`${appConfig.siteUrl}/projects/${id}`}
      dark={dark}
    />
  );
}

export function ArticleOgTemplate({
  title,
  meta,
  url,
  dark,
}: {
  title: string;
  meta?: string;
  url?: string;
  dark?: boolean;
}) {
  return (
    <SoftCard
      tile={<IconTile name="pen" />}
      name={title}
      nameSize={title.length > 32 ? 60 : 84}
      description={meta}
      footer={url ?? `${appConfig.siteUrl}/docs`}
      dark={dark}
    />
  );
}
