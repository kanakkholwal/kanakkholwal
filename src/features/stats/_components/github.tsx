import { GithubStats, type GithubStatsData } from "@/components/blocks/github-stats";
import { StatsEmpty } from "@/components/stats/stats-empty";
import { MONO_SERIES } from "@/components/stats/tone";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";

export function GithubOverview({ data }: { data: GithubStatsData | null }) {
  if (!data || !Object.keys(data.contributions).length) {
    return (
      <StatsEmpty
        icon="brand-github"
        ghost="calendar"
        retry
        title="GitHub is quiet right now"
        description="The API didn't answer. The year view comes back on the next refresh."
      />
    );
  }
  return <GithubStats data={data} locale="en-US" className={cn(MONO_SERIES)} />;
}

export function GithubSkeleton() {
  return <Skeleton shape="block" className="h-96 rounded-2xl" aria-busy />;
}
