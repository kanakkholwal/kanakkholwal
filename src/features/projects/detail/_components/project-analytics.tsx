import { useState } from "react";
import { Section } from "@/components/site/page";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group/toggle-group";
import { Breakdowns, Traffic } from "~/features/stats/_components/usage";
import { type AnalyticsResult, RANGES, type RangeKey } from "~/lib/analytics/types";

/** The same traffic cards as /stats, for the project's own site; renders nothing until analytics is connected. */
export function ProjectAnalytics({ result, index }: { result: AnalyticsResult | null; index?: number }) {
  const [range, setRange] = useState<RangeKey>("30d");
  if (!result?.ok) return null;

  const snapshot = result.ranges[range];
  return (
    <Section
      id="traffic"
      icon="chart"
      title="traffic."
      description="Visitors to the live site."
      index={index}
      action={
        <ToggleGroup
          label="Range"
          variant="outline"
          size="sm"
          value={range}
          onValueChange={(v) => v && setRange(v as RangeKey)}
        >
          {RANGES.map((r) => (
            <ToggleGroupItem key={r.key} value={r.key}>
              {r.short}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      }
    >
      <div className="flex flex-col gap-8">
        <Traffic snapshot={snapshot} />
        <Breakdowns snapshot={snapshot} />
      </div>
    </Section>
  );
}
