import { Area, AreaChart } from "@/components/charts/area-chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent, XAxis } from "@/components/charts/chart";
import { Lately } from "@/components/home/lately";
import { Delta, Figure, Note, Tile } from "@/components/stats/tiles";
import { MONO_SERIES } from "@/components/stats/tone";
import { cn } from "@/lib/cn";
import type { HeroOrbitActivityItem } from "~/api/github";
import type { HomeData } from "~/server/home";

type Day = { date: string; count: number };

const week = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

/** Daily counts folded into weeks, oldest first, so the chart reads as a year at a glance. */
function weekly(days: Day[]) {
  const out: { date: Date; contributions: number }[] = [];
  for (let i = 0; i < days.length; i += 7) {
    const slice = days.slice(i, i + 7);
    out.push({
      date: new Date(`${slice[0].date}T00:00:00Z`),
      contributions: slice.reduce((sum, d) => sum + d.count, 0),
    });
  }
  return out;
}

/** Last six months against the six before; 0 when there is no earlier half to compare. */
function halfYearChange(days: Day[]) {
  const half = Math.floor(days.length / 2);
  const sum = (part: Day[]) => part.reduce((n, d) => n + d.count, 0);
  const before = sum(days.slice(0, half));
  const now = sum(days.slice(half));
  return before ? ((now - before) / before) * 100 : 0;
}

export function OpenSource({
  github,
  projects,
  calendar,
  activity,
}: {
  github: NonNullable<HomeData["github"]>;
  projects: number;
  calendar: Day[];
  activity: HeroOrbitActivityItem[];
}) {
  const series = weekly(calendar);
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Tile
        icon="git-commit"
        label="Contributions, last 12 months"
        aside={calendar.length > 14 ? <Delta percent={halfYearChange(calendar)} vs="vs the 6 months before" /> : null}
        className="col-span-2 lg:row-span-2"
      >
        <Figure value={github.contributions} />
        {series.length > 1 ? (
          <div className={cn(MONO_SERIES, "-mx-1 mt-3")}>
            <ChartContainer
              config={{ contributions: { label: "Contributions", color: "var(--chart-1)" } }}
              title="Contributions per week, last 12 months"
              locale="en-US"
              aspect="wide"
              className="aspect-[16/7]"
            >
              <AreaChart data={series} xKey="date">
                <XAxis tickFormatter={(d) => week(d as Date)} />
                <Area dataKey="contributions" variant="gradient" curve="monotone" line fillOpacity={0.16} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, datum) => (datum.date instanceof Date ? `Week of ${week(datum.date)}` : "")}
                    />
                  }
                />
              </AreaChart>
            </ChartContainer>
          </div>
        ) : null}
      </Tile>

      <Tile icon="users-group" label="Followers">
        <Figure value={github.followers} />
        <Note>on GitHub</Note>
      </Tile>
      <Tile icon="star" label="Stars earned">
        <Figure value={github.stars} />
        <Note>across my repos</Note>
      </Tile>
      <Tile icon="folder" label="Public repos">
        <Figure value={github.repos} />
        <Note>open source</Note>
      </Tile>
      <Tile icon="rocket" label="Projects shipped">
        <Figure value={projects} />
        <Note>products and tools</Note>
      </Tile>

      {activity.length ? (
        <Tile icon="pulse" label="Lately on GitHub" className="col-span-2 lg:col-span-4">
          <Lately items={activity} />
        </Tile>
      ) : null}
    </div>
  );
}
