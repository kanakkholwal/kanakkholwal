import Image from "next/image";
import { appConfig } from "root/project.config";
import { toolKit } from "~/data/toolkit";
import { generateMetadata } from "~/utils/seo";

export default function ToolKitPage() {
  return (
    <>
      <main className="px-4 py-16 pt-36 sm:px-8 md:px-10">
        <h2 className="text-shadow-glow relative z-2  text-5xl font-medium tracking-tight text-balance sm:text-5xl md:mb-36 md:text-6xl text-center max-w-xl mx-auto !mb-12">
          <p className="mb-3 font-mono text-xs font-normal tracking-widest text-black/80 uppercase md:text-sm dark:text-white/70">
            My Tools
          </p>
          <span className="font-instrument-serif">
            <span className="md:text-6xl">The </span>{" "}
            <span className="text-colorful animate-gradient-x font-instrument-serif pe-2 tracking-tight italic">
              Setup
            </span>
          </span>
        </h2>
        <div className="mx-auto my-20 max-w-4xl">
          <div className="overflow-hidden rounded-2xl border-1 border-neutral-200/50 shadow-lg dark:border-white/10">
            <Image
              alt={toolKit.device.name}
              width={1920}
              height={1080}
              src={toolKit.device.mockup}
              className="object-cover h-full select-none"
              unoptimized
            />
          </div>
          <h3 className="mt-2 text-center text-base font-light text-neutral-900 dark:text-neutral-100">
            {toolKit.device.name}
          </h3>
        </div>
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-left text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Software &amp; Tools
          </h2>
          <div className="relative flex flex-wrap items-center justify-center gap-x-2 gap-y-4 sm:gap-x-4 md:gap-x-6 lg:gap-10">
            {toolKit.tools.map((tool) => {
              return (
                <a
                  href={tool.href}
                  key={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group no-underline transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="group inline-block text-center">
                    <div className="size-28 rounded-[20px] border-2 p-2 transition-all duration-300 group-hover:border-indigo-400 group-hover:shadow-lg dark:group-hover:border-indigo-500">
                      <div className="box-shadow-glow grid h-full place-items-center rounded-xl border-2 border-[#A5AEB81F]/10 bg-[#EDEEF0] dark:border-[#5A5F661F]/10 dark:bg-[#1A1B1E]">
                        <Image
                          className="h-10 w-10"
                          height={40}
                          width={40}
                          alt={tool.label}
                          src={tool.image}
                        />
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {tool.label}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
export const metadata = generateMetadata({
  title: "My ToolKit  ",
  description: `Explore the software and tools used by ${appConfig.name} for development, design, and productivity.`,
  path: "/toolkit",
  keywords: [
    "toolkit",
    "software",
    "tools",
    "development",
    "design",
    "productivity",
    appConfig.name,
  ],
});
