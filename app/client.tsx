"use client"
import {
    ContributionGraph,
    ContributionGraphBlock,
    ContributionGraphCalendar,
    ContributionGraphFooter,
    ContributionGraphLegend,
    ContributionGraphTotalCount,
} from "@/components/kibo-ui/contribution-graph";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Contributions } from "~/api/github";



export function GithubSection({ data }: { data: Contributions }) {
    const [year, setYear] = useState(Object.keys(data.total).toReversed()[0])


    return <section
        id="github"
        className="mx-auto my-24 w-full max-w-6xl px-4 mt-10 mb-32 space-y-8"
    >
        <h2
            className="relative z-2 text-5xl font-medium tracking-tight text-balance sm:text-5xl md:text-6xl mb-12 md:mb-12 text-center"
            style={{
                textShadow:
                    "rgba(255, 255, 255, 0.05) 0px 4px 8px, rgba(255, 255, 255, 0.25) 0px 8px 30px"
            }}
        >
            <p className="mb-3 font-mono text-xs font-normal tracking-widest text-black/80 uppercase md:text-sm dark:text-white/70">
                Developer Insights
            </p>
            <span className="font-instrument-serif">
                <span className="">GitHub </span>{" "}
                <span className="text-colorfull animate-gradient-x font-instrument-serif pe-2 tracking-tight italic">
                    Activity
                </span>
            </span>
        </h2>


        <ContributionGraph data={data.contributions[year]} className="mx-auto">
            <div className="flex justify-end items-center-safe py-2">

                <Select defaultValue={year} onValueChange={(year) => setYear(year)}>
                    <SelectTrigger className="w-auto min-w-[8rem] h-8 text-sm text-muted-foreground font-light">
                        <SelectValue placeholder="Select a repository" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(data.total).toReversed().map((year) => {
                            return (
                                <SelectItem key={year} value={year}>
                                    {year}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>
            <ContributionGraphCalendar>
                {({ activity, dayIndex, weekIndex }) => (
                    <ContributionGraphBlock
                        activity={activity}
                        dayIndex={dayIndex}
                        weekIndex={weekIndex}
                        className={cn(
                            'data-[level="0"]:fill-[#ebedf0] dark:data-[level="0"]:fill-[#161b22]',
                            'data-[level="1"]:fill-[#9be9a8] dark:data-[level="1"]:fill-[#0e4429]',
                            'data-[level="2"]:fill-[#40c463] dark:data-[level="2"]:fill-[#006d32]',
                            'data-[level="3"]:fill-[#30a14e] dark:data-[level="3"]:fill-[#26a641]',
                            'data-[level="4"]:fill-[#216e39] dark:data-[level="4"]:fill-[#39d353]'
                        )}
                    />
                )}
            </ContributionGraphCalendar>
            <ContributionGraphFooter>
                <ContributionGraphTotalCount>
                    {({ totalCount, year }) => (
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm">Year {year}:</span>
                            <Badge className="ml-2">
                                {totalCount.toLocaleString()} contributions
                            </Badge>
                        </div>
                    )}
                </ContributionGraphTotalCount>
                <ContributionGraphLegend>
                    {({ level }) => (
                        <div
                            className="group relative flex h-3 w-3 items-center justify-center"
                            data-level={level}
                        >
                            <div
                                className={`h-full w-full rounded-sm border border-border ${level === 0 ? "bg-muted" : ""} ${level === 1 ? "bg-emerald-200 dark:bg-emerald-900" : ""} ${level === 2 ? "bg-emerald-400 dark:bg-emerald-700" : ""} ${level === 3 ? "bg-emerald-600 dark:bg-emerald-500" : ""} ${level === 4 ? "bg-emerald-800 dark:bg-emerald-300" : ""} `}
                            />
                            <span className="-top-8 absolute hidden rounded bg-popover px-2 py-1 text-popover-foreground text-xs shadow-md group-hover:block">
                                Level {level}
                            </span>
                        </div>
                    )}
                </ContributionGraphLegend>
            </ContributionGraphFooter>
        </ContributionGraph>
        <div className="mx-auto mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="relative overflow-hidden rounded-xl border p-3 transition-all duration-300 md:p-4 bg-zinc-900/50 border-purple-500/30 hover:bg-purple-500/5 col-span-1">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="rounded-lg p-3 bg-purple-900/20">
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
                            className="lucide lucide-users h-6 w-6 text-purple-400"
                            aria-hidden="true"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <circle cx={9} cy={7} r={4} />
                        </svg>
                    </div>
                    <div>
                        <p className="line-clamp-1 text-sm text-zinc-400">Followers</p>
                        <p className="text-xl font-bold text-zinc-100 md:text-2xl">{data.stats.followers}</p>
                    </div>
                </div>
            </div>
            <div className="relative overflow-hidden rounded-xl border p-3 transition-all duration-300 md:p-4 bg-zinc-900/50 border-yellow-500/30 hover:bg-yellow-500/5 col-span-1">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="rounded-lg p-3 bg-yellow-900/20">
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
                            className="lucide lucide-star h-6 w-6 text-yellow-400"
                            aria-hidden="true"
                        >
                            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                        </svg>
                    </div>
                    <div>
                        <p className="line-clamp-1 text-sm text-zinc-400">Total Stars</p>
                        <p className="text-xl font-bold text-zinc-100 md:text-2xl">{data.stats.stars}</p>
                    </div>
                </div>
            </div>
            <div className="relative overflow-hidden rounded-xl border p-3 transition-all duration-300 md:p-4 bg-zinc-900/50 border-green-500/30 hover:bg-green-500/5 col-span-1">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="rounded-lg p-3 bg-green-900/20">
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
                            className="lucide lucide-book-open h-6 w-6 text-green-400"
                            aria-hidden="true"
                        >
                            <path d="M12 7v14" />
                            <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                        </svg>
                    </div>
                    <div>
                        <p className="line-clamp-1 text-sm text-zinc-400">Public Repos</p>
                        <p className="text-xl font-bold text-zinc-100 md:text-2xl">{data.stats.repos}</p>
                    </div>
                </div>
            </div>
            <div className="relative overflow-hidden rounded-xl border p-3 transition-all duration-300 md:p-4 bg-zinc-900/50 border-blue-500/30 hover:bg-blue-500/5 col-span-1">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="rounded-lg p-3 bg-blue-900/20">
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
                            className="lucide lucide-git-fork h-6 w-6 text-blue-400"
                            aria-hidden="true"
                        >
                            <circle cx={12} cy={18} r={3} />
                            <circle cx={6} cy={6} r={3} />
                            <circle cx={18} cy={6} r={3} />
                            <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" />
                            <path d="M12 12v3" />
                        </svg>
                    </div>
                    <div>
                        <p className="line-clamp-1 text-sm text-zinc-400">Total Forks</p>
                        <p className="text-xl font-bold text-zinc-100 md:text-2xl">{data.stats.forks}</p>
                    </div>
                </div>
            </div>
        </div>

    </section>

}


