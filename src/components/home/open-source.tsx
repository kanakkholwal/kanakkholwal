import { StatGrid } from "@/components/stats/stat-grid";
import type { HomeData } from "~/server/home";

/** Four numbers that roll up the first time they scroll into view. */
export function OpenSource({ github, projects }: { github: NonNullable<HomeData["github"]>; projects: number }) {
  return (
    <StatGrid
      cells={[
        { label: "Contributions", icon: "git-commit", value: github.contributions },
        { label: "Stars earned", icon: "star", value: github.stars },
        { label: "Public repos", icon: "folder", value: github.repos },
        { label: "Projects shipped", icon: "rocket", value: projects },
      ]}
    />
  );
}
