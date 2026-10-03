import {
  CartesianGrid,
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  XAxis,
  YAxis,
} from "@/components/charts/chart";
import { Line, LineChart } from "@/components/charts/line-chart";
import { Well } from "@/components/site/page";
import { StatsEmpty } from "@/components/stats/stats-empty";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useStatsSearch } from "../client";
import { type PkgOption, pkgOptions } from "../searchParams";

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const pkgItems = pkgOptions.map((p) => ({ value: p, label: p === "both" ? "all packages" : p }));
const day = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

type VersionData = { records: Array<Record<string, number | string>>; versions: string[] };

export function Versions({ data }: { data: VersionData }) {
  const { pkg, beta, set } = useStatsSearch();
  // Version strings have dots, which CSS custom property names can't hold, so series get index keys.
  const keys = data.versions.map((_, i) => `v${i}`);
  const config: ChartConfig = Object.fromEntries(
    data.versions.map((v, i) => [keys[i], { label: v, color: `var(--chart-${(i % 5) + 1})` }]),
  );
  const rows = data.records.map((r) => ({
    date: new Date(`${r.date}T00:00:00Z`),
    ...Object.fromEntries(data.versions.map((v, i) => [keys[i], Number(r[v] ?? 0)])),
  }));

  return (
    <Well>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Select value={pkg} onValueChange={(v) => set({ pkg: v as PkgOption })} items={pkgItems}>
          <SelectTrigger variant="ghost" size="sm" className="-ml-2.5 font-mono text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent size="sm" align="start">
            {pkgItems.map((p) => (
              <SelectItem key={p.value} value={p.value} className="font-mono">
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ToggleGroup
          label="Release channel"
          variant="outline"
          size="sm"
          value={beta ? "beta" : "stable"}
          onValueChange={(v) => v && set({ beta: v === "beta" || undefined })}
        >
          <ToggleGroupItem value="stable">Stable</ToggleGroupItem>
          <ToggleGroupItem value="beta">Beta</ToggleGroupItem>
        </ToggleGroup>
      </div>
      {rows.length && keys.length ? (
        <ChartContainer config={config} title="Daily downloads per version" locale="en-US" aspect="wide">
          <ChartLegend interactive={false} />
          <LineChart data={rows} xKey="date">
            <CartesianGrid variant="dashed" className="stroke-border/70" />
            <YAxis tickFormatter={(v) => compact.format(v)} />
            <XAxis tickFormatter={day} />
            {keys.map((k) => (
              <Line key={k} dataKey={k} curve="monotone" strokeWidth={1.5} />
            ))}
            <ChartTooltip content={<ChartTooltipContent formatter={(v) => compact.format(Number(v))} />} />
          </LineChart>
        </ChartContainer>
      ) : (
        <StatsEmpty
          icon="layers"
          title="No releases to compare"
          description="Nothing on this channel in the last month."
        />
      )}
    </Well>
  );
}

export function VersionsSkeleton() {
  return <Skeleton shape="block" className="aspect-[2/1] h-auto rounded-2xl" />;
}
