import { Link as RouterLink } from "@tanstack/react-router";
import type { AnchorHTMLAttributes, ComponentProps, Ref } from "react";

type UrlObject = {
  pathname?: string;
  query?: Record<string, string | number | boolean | undefined>;
  hash?: string;
};

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string | UrlObject;
  ref?: Ref<HTMLAnchorElement>;
  prefetch?: boolean | null;
  replace?: boolean;
  scroll?: boolean;
};

const SCHEME = /^([a-z][a-z\d+.-]*:|\/\/)/i;
// Server routes (OG images, sitemap, search API) must be real requests, not client navigations.
const SERVER_PATH = /^\/(api|og)\/|\.[a-z\d]{2,5}$/i;

function toHref(href: string | UrlObject): string {
  if (typeof href === "string") return href;
  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(href.query ?? {})) {
    if (v !== undefined) query.set(k, String(v));
  }
  const qs = query.toString();
  return `${href.pathname ?? ""}${qs ? `?${qs}` : ""}${href.hash ? `#${href.hash.replace(/^#/, "")}` : ""}`;
}

/** Router-aware anchor taking a Next-style `href`; external, hash and server paths fall back to `<a>`. */
export default function Link({ href, prefetch, replace, scroll, ...rest }: LinkProps) {
  const url = toHref(href);
  const [beforeHash, hash] = url.split("#", 2);
  const [pathname, query] = beforeHash.split("?", 2);

  if (
    !pathname ||
    SCHEME.test(url) ||
    SERVER_PATH.test(pathname) ||
    rest.target === "_blank" ||
    rest.download !== undefined
  ) {
    return <a href={url} {...rest} />;
  }

  const routerProps = {
    ...rest,
    to: pathname,
    search: query ? Object.fromEntries(new URLSearchParams(query)) : undefined,
    hash,
    replace,
    resetScroll: scroll,
    preload: prefetch === false ? false : undefined,
  };
  return <RouterLink {...(routerProps as ComponentProps<typeof RouterLink>)} />;
}
