import { appConfig } from "root/project.config";
import { Logo } from "./logo";
import { ModeToggle } from "./mode-toggle";
import { Socials } from "./socials";
import { TransitionLink } from "./utils/link";

const footerLinks = {
  general: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Journey",
      href: "/journey",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Blog",
      href: "/blog",
    },
  ],
  specifics: [
    {
      label: "OS Stats",
      href: "/stats",
    },
    {
      label: "Toolkit",
      href: "/toolkit",
    },
    {
      label: "Tech Stack",
      href: "/tech-stack",
    },
    {
      label: "Bucket List",
      href: "/bucket-list",
    },
  ],
  more: [
    {
      label: "Book a call",
      href: "/contact",
    },
    {
      label: "Links",
      href: "/links",
    },
    {
      label: "Attributions",
      href: "/attribution",
    },
  ],
};

export function FooterSection() {
  return (
    <footer className="mx-auto my-6 max-w-7xl">
      <div className="relative flex flex-col items-center gap-6 mb-10 md:flex-row">
        <div className="flex flex-1 flex-col items-start gap-4 md:flex-row md:justify-between">
          <div className="hidden flex-col gap-y-6 md:flex md:w-1/2">
            <TransitionLink className="inline-block" href="/">
              <Logo />
            </TransitionLink>
            <p className="w-60 text-base leading-5 text-muted-foreground">
              {appConfig.description}
            </p>
          </div>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:gap-16 lg:gap-32 max-sm:bg-primary/[0.05] rounded-3xl p-5">
            {Object.entries(footerLinks).map(([key, links]) => {
              return (
                <div className="flex flex-col gap-2 sm:gap-4" key={key}>
                  <h4 className="text-base text-neutral-700 dark:text-white/90 font-mono capitalize">
                    {key}
                  </h4>
                  <ul className="flex flex-wrap items-start gap-x-4 gap-y-2 text-base sm:flex-col sm:gap-y-3 dark:text-neutral-50">
                    {links.map((link) => (
                      <li key={link.href}>
                        <TransitionLink
                          className="group relative inline-flex items-center before:pointer-events-none before:absolute before:top-[1.5em] before:left-0 before:h-[0.05em] before:w-full before:bg-current before:content-[''] before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] hover:before:origin-left hover:before:scale-x-100"
                          href={link.href}
                        >
                          {link.label}
                          <svg
                            className="ml-[0.3em] size-[0.65em] -translate-x-1 opacity-0 transition-all duration-300 [motion-reduce:transition-none] group-hover:translate-x-0 group-hover:opacity-100"
                            fill="none"
                            viewBox="0 0 10 10"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              d="M1.667 5h6.666m0 0L5 1.667M8.333 5 5 8.333"
                              stroke="currentColor"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </TransitionLink>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center justify-between gap-4 text-sm text-neutral-600 md:flex-row dark:text-neutral-400 pb-5">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
          <p className="whitespace-nowrap">
            © {new Date().getFullYear()}{" "}
            <TransitionLink
              className="whitespace-nowrap transition-colors hover:text-black dark:hover:text-white"
              href="/"
            >
              {appConfig.name}
            </TransitionLink>
            . All rights reserved
          </p>
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <TransitionLink
              className="whitespace-nowrap transition-colors hover:text-black dark:hover:text-white"
              href="/legal/privacy"
            >
              Privacy Policy
            </TransitionLink>
            <TransitionLink
              className="whitespace-nowrap transition-colors hover:text-black dark:hover:text-white"
              href="/legal/terms"
            >
              Terms &amp; Conditions
            </TransitionLink>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-end">
          <ModeToggle />
          <Socials />
        </div>
      </div>
    </footer>
  );
}
