import { GenericAreaChart } from "@/components/extended/chart.area";
import { changeCase } from "~/utils/string";
import { formatStatNumber } from "../lib/format";
import { cumulateStats, getProjectInsight } from "../lib/insight";

// --- ICONS (Phosphor Duotone Only) ---
import { ButtonTransitionLink } from "@/components/utils/link";
import {
    PiAppWindowDuotone,
    PiArrowRightDuotone,
    PiCalendarBlankDuotone,
    PiCursorClickDuotone,
    PiEyeDuotone,
    PiTrendUpDuotone,
    PiUsersDuotone
} from "react-icons/pi";

export type ProjectConfig = {
    id: string;
    title: string;
    description: string;
    endpoint: string;
    headers?: Record<string, string>;
};

const period = "last_month";

export async function InsightStats({ project }: { project: ProjectConfig }) {
    const insightData = await getProjectInsight(project);

    // Metric Calculations
    const visitors = Number(insightData.data.visitors);
    const users = Number(insightData.data.users.totalUsers);
    const sessions = Number(insightData.data.sessions.totalSessions);

    // Calculate Sessions per User (Engagement Proxy)
    const sessionsPerUser = users > 0 ? (sessions / users).toFixed(1) : "0.0";

    return (

        <div
            className="w-full mt-8 first:mt-0 rounded-xl border border-border bg-card backdrop-blur-sm overflow-hidden hover:border-border/80 transition-colors duration-300">
            <header className="grid grid-cols-12 border-b border-border w-full">

                <div className="col-span-6 p-5 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border bg-muted/5">
                    <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background text-indigo-500 shadow-sm">
                            <PiAppWindowDuotone className="text-xl sm:text-2xl" />
                        </div>
                        <div className="space-y-1 min-w-0">
                            <h3 className="font-instrument-serif text-xl sm:text-2xl font-medium leading-none text-foreground tracking-tight truncate">
                                {project.title}
                            </h3>
                            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest truncate opacity-70">
                                {`/projects/${project.id}`}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 sm:mt-8 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                            <PiCalendarBlankDuotone className="text-base" />
                            <span className="uppercase tracking-wider opacity-80">{changeCase(period, "sentence")}</span>
                        </div>
                        <ButtonTransitionLink href={`/projects/${project.id}`} variant="ghost" size="sm">
                            Details
                            <PiArrowRightDuotone />
                        </ButtonTransitionLink>
                    </div>
                </div>


                <div className="col-span-6 p-5 sm:p-6 bg-background">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">

                        <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2">
                            <span className="flex items-center gap-1.5 text-[10px] font-mono font-medium uppercase text-muted-foreground tracking-widest">
                                <PiEyeDuotone className="text-sm" /> Views
                            </span>
                            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans">
                                {formatStatNumber(visitors)}
                            </span>
                        </div>

                        <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2 border-t sm:border-t-0 pt-4 sm:pt-0 border-dashed border-border/50">
                            <span className="flex items-center gap-1.5 text-[10px] font-mono font-medium uppercase text-muted-foreground tracking-widest">
                                <PiUsersDuotone className="text-sm text-emerald-500" /> Users
                            </span>
                            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans">
                                {formatStatNumber(users)}
                            </span>
                        </div>

                        <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2 border-t sm:border-t-0 pt-4 sm:pt-0 border-dashed border-border/50">
                            <span className="flex items-center gap-1.5 text-[10px] font-mono font-medium uppercase text-muted-foreground tracking-widest">
                                <PiCursorClickDuotone className="text-sm text-amber-500" /> S/U Ratio
                            </span>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans">
                                    {sessionsPerUser}
                                </span>
                                <span className="text-[10px] text-emerald-500 font-medium flex items-center bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                                    <PiTrendUpDuotone className="mr-0.5" /> +2.4%
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </header>


            {/* 2. CHART BODY */}
            <div className="relative p-2 bg-gradient-to-b from-transparent to-muted/5">

                {/* Floating Status Badge inside chart - Hidden on super small screens to save space */}
                <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-2 rounded-full border border-border/40 bg-background/60 px-2.5 py-1 backdrop-blur-md shadow-sm">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[9px] font-mono font-medium uppercase tracking-widest text-muted-foreground/80">
                        Live_Traffic
                    </span>
                </div>

                <GenericAreaChart
                    data={cumulateStats(insightData.data.users, insightData.data.sessions)}
                    series={[
                        { dataKey: "users", label: "Unique Users", color: "var(--chart-1)" },
                        { dataKey: "sessions", label: "Total Sessions", color: "var(--chart-2)" },
                    ]}
                    title=""
                    description=""
                    showTimeRangeFilter={false}
                    chartHeight={320}
                    stacked={false}
                    showLegend={true}
                    showYAxis={true}
                    className="w-full border-none shadow-none"
                />
            </div>
        </div>
    );
}