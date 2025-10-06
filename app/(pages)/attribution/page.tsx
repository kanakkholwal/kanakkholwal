import { appConfig } from "root/project.config";
import { generateMetadata } from "~/utils/seo";

export default function AttributionPage() {
  return (
    <main className="relative z-10 pt-32 container mx-auto">
      <h2 className="text-shadow-glow relative z-2 text-5xl font-medium tracking-tight text-balance sm:text-5xl md:text-6xl text-center max-w-xs md:max-w-lg mx-auto mb-12 md:mb-12">
        <p className="mb-3 font-mono text-xs font-normal tracking-widest text-black/80 uppercase md:text-sm dark:text-white/70">
          Attribution
        </p>
        <span className="font-instrument-serif">
          <span className="">Journey to create this </span>{" "}
          <span className="text-colorful animate-gradient-x font-instrument-serif pe-2 tracking-tight italic">
            website
          </span>
        </span>
      </h2>
      <div className="relative z-10 mx-auto max-w-4xl text-neutral-600 dark:text-neutral-400">
        <div className="flex flex-col gap-y-8">
          <h1 className="text-xl">Hello! Welcome to my website.</h1>
          <div className="flex flex-col gap-y-6 text-lg leading-relaxed">
            {appConfig.attribution.journey.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </div>
          <ul className="flex flex-col gap-y-3 pl-6">
            {appConfig.attribution.list.map((attribution) => {
              return (
                <li className="relative" key={attribution.person}>
                  <div className="absolute top-2 -left-6 h-2 w-2 rounded-full bg-neutral-500" />
                  <span className="dark:text-neutral-200 text-black">
                    {attribution.person}
                  </span>
                  <span>
                    {"'"}s {attribution.attribute}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex flex-col gap-y-2">
            <p>Best,</p>
            <div className="relative dark:text-neutral-200 text-black">
              {appConfig.name}
            </div>
          </div>
          <div className="mt-6">
            <p className="text-sm dark:text-neutral-400 text-neutral-600">
              I offer freelance development for custom websites that are fast,
              responsive, and SEO-optimized 🚀. To bring your vision to life
              with clean code, you can reach me at{" "}
              <a
                className="dark:text-neutral-200 text-black underline hover:text-primary"
                href={`mailto:${appConfig.emails[0]}`}
              >
                {appConfig.emails[0]}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export const metadata = generateMetadata({
  title: "Attribution",
  description:
    "Attribution page for Kanak's portfolio site, acknowledging contributions and inspirations behind the website's creation.",
  url: "/attribution",
  keywords: [
    "attribution",
    "credits",
    "inspiration",
    "acknowledgements",
    "portfolio",
    "website",
  ],
});
