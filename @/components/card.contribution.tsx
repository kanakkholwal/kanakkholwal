"use client";

import {
    ContributionGraph,
    ContributionGraphBlock,
    ContributionGraphCalendar,
    ContributionGraphFooter,
    ContributionGraphLegend,
    ContributionGraphTotalCount,
} from "@/components/kibo-ui/contribution-graph";
import { cn } from "@/lib/utils";
import { eachDayOfInterval, endOfYear, formatISO, startOfYear } from "date-fns";
import { Badge } from "./ui/badge";

const maxCount = 20;
const maxLevel = 4;
const now = new Date();
const days = eachDayOfInterval({
    start: startOfYear(now),
    end: endOfYear(now),
});

const data = days.map((date) => {
    const c = Math.round(
        Math.random() * maxCount - Math.random() * (0.8 * maxCount)
    );
    const count = Math.max(0, c);
    const level = Math.ceil((count / maxCount) * maxLevel);

    return {
        date: formatISO(date, { representation: "date" }),
        count,
        level,
    };
});

type ContributionResponse = {
    total: Record<string, number>,
    contributions: Array<{
        date: string
        count: number
        level: number
    }>
}

function GithubContributionGraph({data}:{data: ContributionResponse["contributions"]}) {


    return <ContributionGraph data={data}>
        <ContributionGraphCalendar>
            {({ activity, dayIndex, weekIndex }) => (
                <ContributionGraphBlock
                    activity={activity}
                    className={cn(
                        'data-[level="0"]:fill-[#ebedf0] dark:data-[level="0"]:fill-[#161b22]',
                        'data-[level="1"]:fill-[#9be9a8] dark:data-[level="1"]:fill-[#0e4429]',
                        'data-[level="2"]:fill-[#40c463] dark:data-[level="2"]:fill-[#006d32]',
                        'data-[level="3"]:fill-[#30a14e] dark:data-[level="3"]:fill-[#26a641]',
                        'data-[level="4"]:fill-[#216e39] dark:data-[level="4"]:fill-[#39d353]'
                    )}
                    dayIndex={dayIndex}
                    weekIndex={weekIndex}
                />
            )}
        </ContributionGraphCalendar>
        <ContributionGraphFooter >
            <ContributionGraphTotalCount>
                {({ totalCount, year }) => (
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">Year {year}:</span>
                        <Badge >
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
}

export default GithubContributionGraph;
