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
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";




type ContributionResponse = {
  total: Record<string, number>;
  contributions: Array<{
    date: string;
    count: number;
    level: number;
  }>;
};

export function GithubContributionGraphCalender({className}: {className?: string}) {
  return       <ContributionGraphCalendar className={cn("w-full px-2", className)}
        title="GitHub Contributions">
        {({ activity, dayIndex, weekIndex }) => (
          <Tooltip key={`${activity.date}-${dayIndex}-${weekIndex}`}>
            <TooltipTrigger asChild>
              <g>
                <ContributionGraphBlock
                  activity={activity}
                  dayIndex={dayIndex}
                  weekIndex={weekIndex}
                  className={cn(
                    // CUSTOM COLOR MAP: Using semantic opacity steps instead of hex codes
                    // This ensures it looks perfect in both Light (Green) and Dark (Glowing Green) modes
                    "rounded-[20px] transition-all duration-300",
                    'data-[level="0"]:fill-muted dark:data-[level="0"]:fill-muted',
                    'data-[level="1"]:fill-emerald-400/30 dark:data-[level="1"]:fill-emerald-900/40',
                    'data-[level="2"]:fill-emerald-400/60 dark:data-[level="2"]:fill-emerald-700/60',
                    'data-[level="3"]:fill-emerald-500 dark:data-[level="3"]:fill-emerald-600',
                    'data-[level="4"]:fill-emerald-600 dark:data-[level="4"]:fill-emerald-500',
                  )}
                />

              </g>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {activity.count} contribution{activity.count > 1 ? "s" : null}{" "}
                on {format(new Date(activity.date), "dd.MM.yyyy")}
              </p>
            </TooltipContent>
          </Tooltip>
        )}

      </ContributionGraphCalendar>
}

function GithubContributionGraph({
  data,
}: {
  data: ContributionResponse["contributions"];
}) {
  return (
    <ContributionGraph data={data}>

      <GithubContributionGraphCalender/>

      <ContributionGraphFooter>
        <ContributionGraphTotalCount>
          {({ totalCount, year }) => (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                Year {year}:
              </span>
              <Badge>{totalCount.toLocaleString()} contributions</Badge>
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
  );
}

export default GithubContributionGraph;
