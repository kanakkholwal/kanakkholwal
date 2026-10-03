import { RollingDigits } from "@/components/text/rolling-digits";
import type { HomeData } from "~/server/home";

/** Four numbers in a hairline grid; each rolls up the first time it scrolls into view. */
export function OpenSource({ github, projects }: { github: NonNullable<HomeData["github"]>; projects: number }) {
  const cells = [
    { label: "Contributions", value: github.contributions },
    { label: "Stars earned", value: github.stars },
    { label: "Public repos", value: github.repos },
    { label: "Projects shipped", value: projects },
  ];
  return (
    <dl className="grid grid-cols-2 overflow-hidden rounded-xl border border-border sm:grid-cols-4">
      {cells.map((c, i) => (
        <div
          key={c.label}
          className={[
            "flex flex-col gap-1 p-4",
            i % 2 === 1 ? "border-border border-l" : "",
            i >= 2 ? "border-border border-t sm:border-t-0" : "",
            i === 2 ? "sm:border-l" : "",
          ].join(" ")}
        >
          <dt className="text-muted-foreground text-xs">{c.label}</dt>
          <dd className="font-medium text-2xl tabular-nums">
            <RollingDigits value={c.value} startOnView locale="en-US" />
          </dd>
        </div>
      ))}
    </dl>
  );
}
