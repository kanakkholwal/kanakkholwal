import Image from "next/image";
import { FaCheck } from "react-icons/fa6";
import { appConfig } from "root/project.config";
import { generateMetadata } from "~/utils/seo";

export default function BucketListPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h2 className="text-shadow-glow relative z-2  text-5xl font-medium tracking-tight text-balance sm:text-5xl md:mb-36 md:text-6xl text-center max-w-xl mx-auto !mb-12">
        <p className="mb-3 font-mono text-xs font-normal tracking-widest text-black/80 uppercase md:text-sm dark:text-white/70">
          The Bucket List
        </p>
        <span className="font-instrument-serif">
          <span className="md:text-6xl">The Things I{"'"}ll Do </span>{" "}
          <span className="text-colorful animate-gradient-x font-instrument-serif pe-2 tracking-tight italic">
            Before I{"'"}m Done
          </span>
        </span>
      </h2>
      <div className="mx-auto mb-20 max-w-3xl px-6 md:px-0">
        {appConfig.bucketList.map((item, index) => {
          return (
            <div key={index} className="flex items-start gap-4 border-b  py-5">
              <div className="mt-1 size-5 shrink-0 rounded border flex justify-center items-center">
                {item.completed && <FaCheck className="size-3 text-primary" />}
              </div>
              <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
                <div className="flex flex-col">
                  <h2 className="text-base md:text-xl text-foreground">
                    {item.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <div className="group flex w-full justify-end -space-x-6 transition-all duration-300 ease-in-out hover:space-x-0 md:w-fit">
                  {item.images.map((img, idx) => {
                    return (
                      <button
                        key={idx}
                        data-state="closed"
                        data-slot="tooltip-trigger"
                        className="size-10 max-w-12 overflow-hidden rounded-[8px] border-2 p-0 transition-all duration-300 group-hover:rotate-0 hover:z-10 hover:scale-105 hover:rotate-0 md:max-w-24 rotate-3"
                      >
                        <Image
                          alt={item.name}
                          loading="lazy"
                          width={48}
                          height={48}
                          src={img}
                          className="size-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const metadata = generateMetadata({
  title: "Bucket List",
  description:
    "Explore Kanak's personal bucket list, featuring exciting adventures and goals he aims to achieve in his lifetime. From travel destinations to life experiences, discover what drives his passion for living fully.",
  url: "/bucket-list",
  keywords: [
    "bucket list",
    "goals",
    "adventures",
    "travel",
    "life experiences",
    "personal aspirations",
    "Kanak Kholwal",
  ],
});
