import { appConfig } from "root/project.config"


const attributions = [
    {
        person: "Josh W. Comeau",
        attribute: " blog and micro-interactions"
    },
    {
        person: "Aayush Bharti",
        attribute: " bucket list page"
    },
]
export default function AttributionPage() {
    return <main className="relative z-10 pt-32 container mx-auto">
        <h2
            className="relative z-2 text-5xl font-medium tracking-tight text-balance sm:text-5xl md:text-6xl text-center max-w-xs md:max-w-lg mx-auto mb-12 md:mb-12"
            style={{
                textShadow:
                    "rgba(255, 255, 255, 0.05) 0px 4px 8px, rgba(255, 255, 255, 0.25) 0px 8px 30px"
            }}
        >
            <p className="mb-3 font-mono text-xs font-normal tracking-widest text-black/80 uppercase md:text-sm dark:text-white/70">
                Attribution
            </p>
            <span className="font-instrument-serif">
                <span className="">Journey to create this </span>{" "}
                <span className="text-colorfull animate-gradient-x font-instrument-serif pe-2 tracking-tight italic">
                    website
                </span>
            </span>
        </h2>
        <div className="relative z-10 mx-auto max-w-4xl text-neutral-600 dark:text-neutral-400">
            <div className="flex flex-col gap-y-8">
                <h1 className="text-xl">Hello! Welcome to my website.</h1>
                <div className="flex flex-col gap-y-6 text-lg leading-relaxed">
                    <p>
                        The first version of this website was created in 2022. I was just getting started with
                        web technologies and built that one with vanilla js, after that I used some templates and code snippets from here and there,
                        those version are still open source back then. The old version is
                        actually open-sourced.
                    </p>
                    <p>
                        Recently, in 2025, it was time for an evolution. I completely
                        redesigned the site to better showcase my current front-end
                        development capabilities, focusing on a clean aesthetic and refined
                        animations.
                    </p>
                    <p>
                        I would like to express my thanks to all of websites that inspired me
                        to build this website (non-exhaustive):
                    </p>
                </div>
                <ul className="flex flex-col gap-y-3 pl-6">
                    {attributions.map((attribution) => {
                        return <li className="relative" key={attribution.person}>
                            <div className="absolute top-2 -left-6 h-2 w-2 rounded-full bg-neutral-500" />
                            <span className="dark:text-neutral-200 text-black">{attribution.person}</span>
                            <span>'s {attribution.attribute}</span>
                        </li>
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
                        responsive, and SEO-optimized 🚀. To bring your vision to life with
                        clean code, you can reach me at{" "}
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

}