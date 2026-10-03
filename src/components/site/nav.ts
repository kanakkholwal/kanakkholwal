import { appConfig } from "root/project.config";
import type { IconType } from "@/components/icons";

export type NavLink = { label: string; href: string; description?: string; icon?: IconType };
export type NavGroup = { label: string; items: NavLink[] };
export type NavEntry = NavLink | NavGroup;

export const isGroup = (entry: NavEntry): entry is NavGroup => "items" in entry;

export const NAV: NavEntry[] = [
  { label: "home", href: "/" },
  {
    label: "work",
    items: [
      { label: "Projects", href: "/projects", description: "Things I've built and shipped", icon: "rocket" },
      { label: "Stats", href: "/stats", description: "Open source: npm downloads and stars", icon: "graph-up" },
      { label: "Analytics", href: "/analytics", description: "Live traffic for this site", icon: "chart" },
    ],
  },
  { label: "writing", href: "/docs" },
  {
    label: "extras",
    items: [
      { label: "Journey", href: "/journey", description: "How I got here, year by year", icon: "route" },
      { label: "Bucket list", href: "/bucket-list", description: "Things to do before I'm done", icon: "checklist" },
      { label: "Blog", href: "/blog", description: "Longer posts on Medium", icon: "notebook" },
      { label: "Links", href: "/links", description: "Everywhere else I'm online", icon: "link" },
      {
        label: "Attribution",
        href: "/attribution",
        description: "People and sites that inspired this one",
        icon: "heart",
      },
    ],
  },
  { label: "contact", href: "/contact" },
];

export const SOCIALS: { label: string; handle: string; href: string; icon: IconType }[] = [
  { label: "GitHub", handle: `@${appConfig.usernames.github}`, href: appConfig.social.github, icon: "brand-github" },
  {
    label: "LinkedIn",
    handle: `@${appConfig.usernames.linkedin}`,
    href: appConfig.social.linkedin,
    icon: "brand-linkedin",
  },
  { label: "X", handle: `@${appConfig.usernames.twitter}`, href: appConfig.social.twitter, icon: "brand-x" },
  { label: "Medium", handle: `@${appConfig.usernames.medium}`, href: appConfig.social.medium, icon: "brand-medium" },
  { label: "Cal.com", handle: "kanakkholwal", href: appConfig.social["cal.com"], icon: "brand-cal" },
];

export const EMAIL = appConfig.emails[0];
export const CAL_URL = appConfig.social["cal.com"];
export const X_URL = appConfig.social.twitter;

/** True when `href` is the current route or an ancestor of it (home only matches itself). */
export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
