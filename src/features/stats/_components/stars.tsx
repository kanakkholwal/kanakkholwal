import { Bar, BarChart, BarTooltip, BarXAxis, BarYAxis } from "@/components/charts/bar-chart";
import { CartesianGrid, ChartContainer, ChartTooltipContent } from "@/components/charts/chart";
import { ArrowLink } from "@/components/site/link";
import { Meta, Well } from "@/components/site/page";
import { StatGrid } from "@/components/stats/stat-grid";
import { StatsEmpty } from "@/components/stats/stats-empty";
import { MONO_SERIES } from "@/components/stats/tone";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { useStatsSearch } from "../client";
import { statsConfig } from "../config";
import type { GitHubStarHistory } from "../lib/github";
import { defaultRepo } from "../searchParams";

const repoItems = statsConfig.repositories.map((r) => ({ value: r.repo, label: r.name }));
// Bin dates are UTC days from the server; format in UTC so hydration agrees.
const day = (date: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });

export function Stars({ data }: { data: Record<string, GitHubStarHistory> }) {
  const { repo, set } = useStatsSearch();
  const active = data[repo] ? repo : defaultRepo;
  const history = data[active];

  if (Object.values(data).every((h) => !h.bins.length)) {
    return (
      <StatsEmpty
        icon="star"
        title="Star history is resting"
        description="GitHub didn't answer this time. Counts come back on the next refresh."
      >
        <ArrowLink href={`https://github.com/${active}`} className="text-sm">
          Open on GitHub
        </ArrowLink>
      </StatsEmpty>
    );
  }

  const bins = history?.bins ?? [];
  const gained = bins.reduce((sum, b) => sum + b.diff, 0);
  const best = bins.reduce((max, b) => Math.max(max, b.diff), 0);
  const gazers = bins.flatMap((b) => b.stargarzers.map((g) => ({ ...g, date: b.date })));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Select value={active} onValueChange={(v) => set({ repo: v })} items={repoItems}>
          <SelectTrigger variant="ghost" size="sm" className="-ml-2.5 font-mono text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent size="sm" align="start">
            {repoItems.map((r) => (
              <SelectItem key={r.value} value={r.value} className="font-mono">
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ArrowLink href={`https://github.com/${active}`} className="text-sm">
          GitHub
        </ArrowLink>
      </div>

      {bins.length ? (
        <>
          <StatGrid
            className="grid-cols-3 sm:grid-cols-3"
            cells={[
              { label: "Stars", value: history?.count ?? 0 },
              { label: "Last 12 days", value: gained, format: (v) => `+${v}` },
              { label: "Best day", value: best, format: (v) => `+${v}` },
            ]}
          />
          {gained > 0 ? (
            <Well>
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <p className="font-medium text-sm">Stars gained per day</p>
                <Meta>
                  {day(bins.at(-1)?.date ?? "")} to {day(bins[0]?.date ?? "")}
                </Meta>
              </div>
              <div className={MONO_SERIES}>
                <ChartContainer
                  config={{ gained: { label: "Stars", color: "var(--chart-1)" } }}
                  title={`${active}: stars gained per day`}
                  locale="en-US"
                  aspect="wide"
                  className="sm:aspect-[3/1]"
                >
                  <BarChart
                    data={bins.toReversed().map((b) => ({ label: day(b.date), gained: b.diff }))}
                    xKey="label"
                    barGap={0.45}
                  >
                    <CartesianGrid variant="dashed" className="stroke-border/70" />
                    <Bar dataKey="gained" />
                    <BarXAxis maxLabels={4} />
                    <BarYAxis tickCount={3} tickFormatter={(v) => (Number.isInteger(v) ? String(v) : "")} />
                    <BarTooltip content={<ChartTooltipContent formatter={(v) => `+${v}`} />} />
                  </BarChart>
                </ChartContainer>
              </div>
            </Well>
          ) : null}
          <Stargazers gazers={gazers} />
        </>
      ) : (
        <StatsEmpty icon="star" title="No history for this repo" description="GitHub skipped this one. Try another." />
      )}
    </div>
  );
}

type Gazer = GitHubStarHistory["bins"][number]["stargarzers"][number] & { date: string };

function Stargazers({ gazers }: { gazers: Gazer[] }) {
  if (!gazers.length) {
    return <p className="text-muted-foreground text-sm">No new stars in the last 12 days.</p>;
  }
  return (
    <div>
      <p className="mb-2 text-muted-foreground text-xs">Recent stargazers</p>
      <ul className="group/list -mx-3 flex flex-col">
        {gazers.slice(0, 8).map((g) => (
          <li key={`${g.login}-${g.date}`}>
            <a
              href={`https://github.com/${g.login}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 outline-none",
                "transition-[opacity,background-color] duration-(--duration-base) ease-(--ease-out)",
                "pointer-fine:group-hover/list:opacity-45 pointer-fine:hover:opacity-100! hover:bg-foreground/[0.03]",
                "focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <img
                src={g.avatarUrl}
                alt=""
                width={24}
                height={24}
                loading="lazy"
                className="size-6 shrink-0 rounded-full bg-card"
              />
              <span className="flex min-w-0 flex-1 items-baseline gap-2">
                <span className="truncate font-medium text-sm">{g.name ?? g.login}</span>
                {g.name ? <span className="truncate text-muted-foreground text-xs">@{g.login}</span> : null}
              </span>
              <Meta className="shrink-0">{day(g.date)}</Meta>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StarsSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy>
      <Skeleton className="h-8 w-40" />
      <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border">
        {Array.from({ length: 3 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: a fixed-length skeleton never reorders.
          <div key={i} className="flex flex-col gap-2 bg-background p-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-7 w-14" />
          </div>
        ))}
      </div>
      <Skeleton shape="block" className="aspect-[2/1] h-auto rounded-2xl sm:aspect-[3/1]" />
    </div>
  );
}
