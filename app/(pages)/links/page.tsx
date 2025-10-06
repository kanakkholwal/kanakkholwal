import { MagicCard } from "@/components/animated/bg.card";
import Image from "next/image";
import { appConfig } from "root/project.config";
import { DATA } from "~/data/resume";
import { generateMetadata } from "~/utils/seo";

export default function LinksPage() {
  return (
    <section className="mx-auto w-full max-w-7xl overflow-x-hidden">
      <div className="relative mx-auto min-h-screen max-w-lg overflow-x-hidden px-4">
        <div className="relative mx-auto flex flex-col items-center justify-center gap-4 overflow-hidden pt-24 pb-6">
          <Image
            src={appConfig.logo}
            width={120}
            height={120}
            alt={appConfig.name}
            className="rounded-full"
          />
          <h1 className="text-xl font-semibold">{appConfig.name}</h1>
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs md:text-sm">
            <span className="rounded-full px-2 py-1 bg-primary/10 text-blue-600 dark:text-primary">
              Developer
            </span>
            <span className="rounded-full px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-500">
              Freelancer
            </span>
            <span className="rounded-full px-2 py-1 bg-violet-500/10 text-violet-600 dark:text-violet-500">
              Problem Solver
            </span>
          </div>
        </div>
        <div className="mx-auto mb-4 flex w-fit gap-x-2 md:text-sm">
          <a
            href={appConfig.url}
            referrerPolicy="no-referrer"
            target="_blank"
            className="group relative flex w-fit items-center justify-between rounded-full bg-black text-white opacity-90 hover:bg-black/80 dark:bg-neutral-200 dark:text-black dark:hover:bg-neutral-300"
          >
            <span className="pl-4 text-base font-light">Website</span>
            <div className="relative mr-1 size-9 overflow-hidden rounded-full bg-transparent">
              <div className="absolute top-[0.85em] left-[-0.1em] grid size-full place-content-center transition-all duration-200 group-hover:translate-x-4 group-hover:-translate-y-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-up-right size-5"
                  aria-hidden="true"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-up-right mb-1 size-5 -translate-x-4"
                  aria-hidden="true"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </div>
            </div>
          </a>
          <a
            href={`mailto:${appConfig.emails[0]}`}
            referrerPolicy="no-referrer"
            target="_blank"
            className="group relative flex w-fit items-center justify-between rounded-full bg-black/20 text-black opacity-90 hover:bg-black/30 dark:bg-white/20 dark:text-white dark:hover:bg-white/30"
          >
            <span className="pl-4 text-base font-light">
              {appConfig.emails[0]}
            </span>
            <div className="relative mr-1 size-9 overflow-hidden rounded-full bg-transparent">
              <div className="absolute top-[0.85em] left-[-0.1em] grid size-full place-content-center transition-all duration-200 group-hover:translate-x-4 group-hover:-translate-y-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-up-right size-5"
                  aria-hidden="true"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-up-right mb-1 size-5 -translate-x-4"
                  aria-hidden="true"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </div>
            </div>
          </a>
        </div>
        <div className="flex flex-col gap-4 py-3">
          {Object.entries(DATA.contact.social).map(([name, social]) => {
            if (!social.navbar) return null;
            return (
              <a
                key={name}
                href={social.url}
                referrerPolicy="no-referrer"
                rel="noopener noreferrer"
                target="_blank"
              >
                <MagicCard
                  className="relative flex h-14 w-full items-center justify-between gap-5 rounded-xl border px-8 py-4"
                  layerClassName="bg-card"
                  wrapperClassName="relative flex w-full items-center justify-center gap-5"
                >
                  <social.icon className="text-black dark:text-neutral-300 size-5 inline-block ml-0" />
                  <span className="mx-auto">{social.name}</span>
                </MagicCard>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const metadata = generateMetadata({
  title: "Links - " + appConfig.name,
  description: `Connect with ${appConfig.name} on various platforms. Find links to social media, portfolio, and more.`,
  url: "/links",
  keywords: [
    "links",
    "social media",
    "portfolio",
    "contact",
    "connect",
    appConfig.name,
    "developer",
    "freelancer",
    "problem solver",
  ],
});
