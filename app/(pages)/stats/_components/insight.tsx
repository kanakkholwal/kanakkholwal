import { GenericAreaChart } from "@/components/extended/chart.area";
import { Eye, User2, UsersIcon } from "lucide-react";
import { GrAnalytics } from "react-icons/gr";
import { changeCase } from "~/utils/string";
import { formatStatNumber } from "../lib/format";
import { cumulateStats, getProjectInsight } from "../lib/insight";
import { Widget } from "./widget";

export type ProjectConfig = {
    id: string;
    title: string;
    description: string;
    endpoint: string;
    headers?: Record<string, string>;
};

const period = "last_month"; // Example period, can be dynamic

export async function InsightStats({ project }: { project: ProjectConfig }) {
    const insightData = await getProjectInsight(project);
    // console.log("Insight Data for project", project.id, insightData);

    return (
        <Widget
            className="mt-4 col-span-1  @4xl:col-span-12 h-auto min-h-96"

            title={
                <>
                    <GrAnalytics size={20} />
                    {project.title}
                    <dl className="mr-1 ml-auto flex gap-2 text-sm font-mono font-semibold text-foreground/70 [&_svg]:size-4 [&_svg]:inline-block [&_svg]:mr-1">
                        <dd className="flex items-center" title="Total Visitors">
                            <Eye />
                            {formatStatNumber(Number(insightData.data.visitors))}
                        </dd>
                        <span className="font-light text-zinc-500" aria-hidden>
                            |
                        </span>
                        <dd className="flex items-center" title="Total Users">
                            <User2 />
                            {formatStatNumber(Number(insightData.data.users.totalUsers))}
                        </dd>
                        <span className="font-light text-zinc-500" aria-hidden>
                            |
                        </span>
                        <dd className="flex items-center" title="Total Sessions">
                            <UsersIcon />
                            {formatStatNumber(Number(insightData.data.sessions.totalSessions))}
                        </dd>

                    </dl>
                </>
            }
        >

            <GenericAreaChart
                data={cumulateStats(insightData.data.users, insightData.data.sessions)}
                series={[
                    { dataKey: "users", label: "New Users", color: "var(--chart-1)" },
                    { dataKey: "sessions", label: "Sessions", color: "var(--chart-2)" },
                ]}
                title="Users & Sessions Overview"
                description={`Overview over ${changeCase(period, "title")}`}
                showTimeRangeFilter={true}
                chartHeight={350}
                stacked={false}
                showLegend={true}
                showYAxis={true}
                className="col-span-1  @4xl:col-span-12"
            />
        </Widget>
    );
}
