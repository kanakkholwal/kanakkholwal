import { ArrowLink } from "@/components/site/link";
import { StatGrid } from "@/components/stats/stat-grid";
import { StatsEmpty } from "@/components/stats/stats-empty";
import type { ProjectConfig } from "../config";
import type { InsightResponse } from "../lib/insight";

const pct = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toFixed(0)}% vs last month`;

export function Insights({ items }: { items: { project: ProjectConfig; insight: InsightResponse | null }[] }) {
  // The endpoint answers 200 with zeros when its own store is down, so zeros count as offline.
  const live = items.filter(
    ({ insight: i }) => i && i.success !== false && (Number(i.data.visitors) || Number(i.data.users.totalUsers)),
  );
  if (!live.length) {
    return (
      <StatsEmpty
        icon="users"
        title="Usage numbers are offline"
        description="The projects' own stats endpoints didn't answer. They report back on the next refresh."
      />
    );
  }
  return (
    <div className="flex flex-col gap-8">
      {live.map(({ project, insight }) => {
        const d = insight?.data;
        if (!d) return null;
        const users = Number(d.users.totalUsers) || 0;
        const sessions = Number(d.sessions.totalSessions) || 0;
        return (
          <div key={project.id} className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-medium text-sm">{project.title}</p>
              <ArrowLink href={`/projects/${project.id}`} className="text-sm">
                Project
              </ArrowLink>
            </div>
            <StatGrid
              cells={[
                { label: "Visitors", value: Number(d.visitors) || 0 },
                { label: "Users", value: users, note: pct(Number(d.users.growthPercent) || 0) },
                { label: "Sessions", value: sessions, note: pct(Number(d.sessions.growthPercent) || 0) },
                {
                  label: "Sessions / user",
                  value: users ? Math.round((sessions / users) * 10) : 0,
                  format: (v) => (v / 10).toFixed(1),
                },
              ]}
            />
          </div>
        );
      })}
    </div>
  );
}
