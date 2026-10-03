import { appConfig } from "root/project.config";

const PERSON_ID = `${appConfig.url}/#person`;
const SITE_ID = `${appConfig.url}/#website`;

type Thing = Record<string, unknown>;

const person: Thing = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: appConfig.displayName,
  alternateName: appConfig.usernames.github,
  url: appConfig.url,
  image: appConfig.avatar,
  jobTitle: appConfig.role,
  description: appConfig.description,
  email: `mailto:${appConfig.emails[0]}`,
  address: { "@type": "PostalAddress", addressCountry: "IN" },
  worksFor: { "@type": "Organization", name: "Zoven AI", url: "https://www.zoven.ai" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "National Institute of Technology, Hamirpur",
    url: "https://nith.ac.in",
  },
  knowsAbout: [
    "Product engineering",
    "Design engineering",
    "AI engineering",
    "React",
    "Svelte",
    "TypeScript",
    "Rust",
    "Design systems",
    "Machine learning",
  ],
  sameAs: [
    appConfig.social.github,
    appConfig.social.linkedin,
    `https://x.com/${appConfig.usernames.twitter}`,
    appConfig.social.medium,
    "https://www.npmjs.com/~kanakkholwal",
  ],
};

/** Site-wide graph: who the site is about and the site itself. Rendered once from the root route. */
export const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [
    person,
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      url: appConfig.url,
      name: appConfig.displayName,
      description: appConfig.description,
      inLanguage: "en",
      publisher: { "@id": PERSON_ID },
    },
  ],
};

/** The home page as a ProfilePage about the site's Person. */
export const profilePage = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: appConfig.url,
  name: `${appConfig.displayName} | ${appConfig.role}`,
  isPartOf: { "@id": SITE_ID },
  mainEntity: { "@id": PERSON_ID },
};

/** Breadcrumb trail from the home page; each crumb is `[name, path]`. */
export function breadcrumbs(...crumbs: [name: string, path: string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [["Home", "/"] as const, ...crumbs].map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: appConfig.url + path,
    })),
  };
}

export function articleLd(a: { title: string; description?: string; path: string; image: string; modified?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.description,
    url: appConfig.url + a.path,
    mainEntityOfPage: appConfig.url + a.path,
    image: appConfig.url + a.image,
    ...(a.modified ? { dateModified: a.modified } : {}),
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    isPartOf: { "@id": SITE_ID },
    inLanguage: "en",
  };
}

export function projectLd(p: {
  title: string;
  description: string;
  path: string;
  image: string;
  href: string;
  code?: string;
  keywords: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": p.code ? "SoftwareSourceCode" : "CreativeWork",
    name: p.title,
    description: p.description,
    url: appConfig.url + p.path,
    image: appConfig.url + p.image,
    sameAs: p.href,
    ...(p.code ? { codeRepository: p.code } : {}),
    keywords: p.keywords.join(", "),
    author: { "@id": PERSON_ID },
    creator: { "@id": PERSON_ID },
  };
}
