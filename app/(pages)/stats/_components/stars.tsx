import { Star } from "lucide-react";
import { statsConfig } from "../config";
import { getStarHistory, GitHubStarHistory } from "../lib/github";
import { GraphSkeleton } from "./graph.skeleton";
import { StarsGraph } from "./stars.client";
import StargazersList from "./stars.gazers-list";
import { WidgetSkeleton } from "./widget.skeleton";

export async function StarHistoryGraph() {
   const stars = await Promise.all(
      statsConfig.repositories.map((r) => r.repo).map(getStarHistory),
    );
  const starsByRepo: Record<string, GitHubStarHistory> = {};
  statsConfig.repositories.forEach((r, i) => {
    starsByRepo[r.repo] = stars[i];
  });

  return (
    <StarsGraph
      data={starsByRepo}
      stargazersTab={
        <StargazersList data={starsByRepo} key="stars.gazers-list" />
      }
    />
  );
}

export function StarHistoryGraphSkeleton() {
  return (
    <WidgetSkeleton
      title={
        <div className="flex w-full items-center gap-2 pb-1">
          <Star size={20} />
          <div className="bg-muted h-5 w-16 animate-pulse rounded-md" />
          <div className="bg-muted ml-auto h-9 w-50 animate-pulse rounded-md" />
        </div>
      }
    >
      <GraphSkeleton className="h-74.5 pt-2" />
    </WidgetSkeleton>
  );
}
