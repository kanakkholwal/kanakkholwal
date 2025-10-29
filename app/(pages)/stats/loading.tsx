import { cn } from "@/lib/utils";
import {
    NPMDownloadsSkeleton,
    NPMStatsSkeleton
} from "./_components/downloads";
import {
    StarHistoryGraphSkeleton
} from "./_components/stars";
import { RepoBeatsActivityGraph } from "./_components/stars.client";
import { Widget } from "./_components/widget";
import { WidgetSkeleton } from "./_components/widget.skeleton";
import { statsConfig } from "./config";




export default function LoadingPage() {



    return (
        <div className="mx-auto max-w-[88rem] px-4">
            <h2 className="text-shadow-glow relative z-2  text-5xl font-medium tracking-tight text-balance sm:text-5xl md:mb-36 md:text-6xl text-center max-w-xl mx-auto !mb-12">
                <p className="mb-3 font-mono text-xs font-normal tracking-widest text-black/80 uppercase md:text-sm dark:text-white/70">
                    Project Stats
                </p>
                <span className="font-instrument-serif">
                    <span className="md:text-6xl">Statistics & </span>{" "}
                    <span className="text-colorful animate-gradient-x font-instrument-serif pe-2 tracking-tight italic">
                        Insights
                    </span>
                </span>
            </h2>
            <section className="my-4 grid grid-cols-1 gap-4 lg:grid-cols-2 max-w-(--max-app-width) mt-10">
                <StarHistoryGraphSkeleton />
                <Widget
                    className={cn(
                        "h-auto flex-col gap-2",
                        statsConfig.flags.repoBeats ? "flex" : "hidden",
                    )}
                >
                    {statsConfig.flags.repoBeats && <RepoBeatsActivityGraph />}
                    <div className="flex flex-1 items-center gap-6 p-4">
                        <NPMStatsSkeleton />
                    </div>
                </Widget>
                <NPMDownloadsSkeleton />
                {statsConfig.flags.versionAdoptionGraph && (
                    <WidgetSkeleton />
                )}
            </section>
        </div>
    );
}



