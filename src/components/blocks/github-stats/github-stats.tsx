"use client";

import { type ReactNode, useState } from "react";
import { GithubCalendar } from "@/components/blocks/github-calendar/github-calendar";
import { Bar, BarChart, BarTooltip, BarXAxis, BarYAxis } from "@/components/charts/bar-chart";
import { ChartContainer, ChartTooltipContent } from "@/components/charts/chart";
import { RollingDigits } from "@/components/text/rolling-digits/rolling-digits";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar/avatar";
import { Badge } from "@/components/ui/badge/badge";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty/empty";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/tabs";
import { cn } from "@/lib/cn";
import {
  contributionInsights,
  contributionYears,
  formatChange,
  formatCount,
  formatDay,
  formatPercent,
  GITHUB_COUNT_KEYS,
  GITHUB_STATS_LABELS,
  type GithubStatsData,
  type GithubStatsLabels,
  type GithubStatsView,
  initials,
  mixShares,
  sameDaysChange,
  weeklyContributions,
  yearTotal,
} from "./core";
import { GITHUB_MIX_FILL, GITHUB_STATS_LAYOUT, type GithubStatsVariant, githubStats } from "./variants";

export type { GithubStatsData, GithubStatsLabels, GithubStatsVariant, GithubStatsView };

export interface GithubStatsProps {
  data: GithubStatsData;
  variant?: GithubStatsVariant;
  /** Controlled year (`"2026"`); pair with `onYearChange`. Defaults to the newest. */
  year?: string;
  defaultYear?: string;
  onYearChange?: (year: string) => void;
  view?: GithubStatsView;
  defaultView?: GithubStatsView;
  onViewChange?: (view: GithubStatsView) => void;
  locale?: string;
  labels?: Partial<GithubStatsLabels>;
  className?: string;
}

const REPO_LIMIT = 5;

/** A year on GitHub: the total and its trend, the facts behind it, the calendar, and where it went. */
export function GithubStats({
  data,
  variant = "default",
  year: yearProp,
  defaultYear,
  onYearChange,
  view: viewProp,
  defaultView = "days",
  onViewChange,
  locale,
  labels: labelsProp,
  className,
}: GithubStatsProps) {
  const labels = { ...GITHUB_STATS_LABELS, ...labelsProp };
  const styles = githubStats({ variant });
  const layout = GITHUB_STATS_LAYOUT[variant];
  const years = contributionYears(data.contributions);
  const [ownYear, setOwnYear] = useState(defaultYear ?? years[0] ?? "");
  const [ownView, setOwnView] = useState<GithubStatsView>(defaultView);
  const year = yearProp ?? ownYear;
  const view = viewProp ?? ownView;
  const days = data.contributions[year] ?? [];
  const total = yearTotal(days);
  const facts = contributionInsights(days);
  const change = sameDaysChange(data.contributions, year);

  const setYear = (next: string) => {
    if (yearProp === undefined) setOwnYear(next);
    onYearChange?.(next);
  };
  const setView = (next: string) => {
    if (next !== "days" && next !== "weeks") return;
    if (viewProp === undefined) setOwnView(next);
    onViewChange?.(next);
  };

  if (years.length === 0) {
    return (
      <div data-slot="github-stats" data-variant={variant} className={cn(styles.root(), className)}>
        <Empty variant="outline" size="sm" role="status">
          <EmptyHeader>
            <EmptyTitle>{labels.emptyTitle}</EmptyTitle>
            <EmptyDescription>{labels.emptyDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div data-slot="github-stats" data-variant={variant} className={cn(styles.root(), className)}>
      <Tabs value={view} onValueChange={setView} variant="segment" size="sm">
        <header className={styles.head()}>
          <div className="min-w-0">
            <p className={styles.eyebrow()}>{labels.eyebrow}</p>
            <p className={styles.hero()}>
              {layout.animate ? (
                <RollingDigits
                  variant="count"
                  value={total}
                  format={(value) => formatCount(Math.round(value), locale)}
                  durationMs={900}
                  size="md"
                  className={cn("font-bold text-foreground", styles.heroValue())}
                />
              ) : (
                <span className={styles.heroValue()}>{formatCount(total, locale)}</span>
              )}
              <span className={styles.heroUnit()}>{labels.totalIn(year)}</span>
            </p>
            {change ? (
              <p className={styles.trendRow()}>
                <Badge
                  size="sm"
                  variant={
                    change.ratio === null || change.ratio === 0
                      ? "secondary"
                      : change.ratio > 0
                        ? "success"
                        : "destructive"
                  }
                  className={styles.trend()}
                >
                  <TrendArrow ratio={change.ratio} />
                  {change.ratio === null ? labels.newLabel : formatChange(change.ratio, locale)}
                </Badge>
                <span className={styles.compare()}>{labels.compare(change.previousYear)}</span>
              </p>
            ) : null}
          </div>
          <div className={styles.controls()}>
            <TabsList aria-label={labels.view}>
              <TabsTrigger value="days">{labels.days}</TabsTrigger>
              <TabsTrigger value="weeks">{labels.weeks}</TabsTrigger>
            </TabsList>
            {years.length > 1 ? (
              <Select value={year} onValueChange={setYear} items={years.map((y) => ({ value: y, label: y }))}>
                <SelectTrigger aria-label={labels.year} className={styles.yearTrigger()}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y} className="font-mono text-xs">
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
          </div>
        </header>

        <dl className={styles.insights()}>
          <Fact label={labels.longestStreak} styles={styles}>
            {labels.dayCount(facts.longestStreak)}
          </Fact>
          <Fact label={labels.currentStreak} styles={styles}>
            {labels.dayCount(facts.currentStreak)}
          </Fact>
          <Fact label={labels.bestDay} styles={styles}>
            {facts.best ? (
              <>
                {formatCount(facts.best.count, locale)}{" "}
                <span className={styles.insightNote()}>{formatDay(facts.best.date, locale)}</span>
              </>
            ) : (
              "–"
            )}
          </Fact>
          <Fact label={labels.activeDays} styles={styles}>
            {formatCount(facts.activeDays, locale)} <span className={styles.insightNote()}>/ {days.length}</span>
          </Fact>
        </dl>

        <div className={styles.calendar()}>
          <TabsContent value="days" className={styles.panel()}>
            <GithubCalendar
              key={year}
              days={days}
              size={layout.calendar}
              tone="success"
              showTotal={false}
              locale={locale}
            />
          </TabsContent>
          <TabsContent value="weeks" className={styles.panel()}>
            {view === "weeks" ? <WeeklyChart days={days} labels={labels} locale={locale} /> : null}
          </TabsContent>
        </div>
      </Tabs>

      <dl className={styles.counts()}>
        {GITHUB_COUNT_KEYS.map((key) => (
          <div key={key} className={styles.count()}>
            <dt className={styles.countLabel()}>{labels[key]}</dt>
            <dd className="order-first">
              {layout.animate ? (
                <RollingDigits
                  variant="count"
                  value={data.counts[key]}
                  format={(value) => formatCount(Math.round(value), locale)}
                  durationMs={1200}
                  size="md"
                  className={cn("font-bold text-foreground", styles.countValue())}
                />
              ) : (
                <span className={styles.countValue()}>{formatCount(data.counts[key], locale)}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>

      {layout.footer && (data.mix || data.repositories?.length) ? (
        <div className={styles.footer()}>
          {data.mix ? <Mix data={data} labels={labels} locale={locale} styles={styles} /> : <span />}
          {data.repositories?.length ? <Where data={data} labels={labels} styles={styles} /> : null}
        </div>
      ) : null}
    </div>
  );
}

type Styles = ReturnType<typeof githubStats>;

function Fact({ label, styles, children }: { label: string; styles: Styles; children: ReactNode }) {
  return (
    <div className={styles.insight()}>
      <dt className={styles.insightLabel()}>{label}</dt>
      <dd className={styles.insightValue()}>{children}</dd>
    </div>
  );
}

/** One bar of the whole, in a fixed order and shade per kind, with every share written out. */
function Mix({
  data,
  labels,
  locale,
  styles,
}: {
  data: GithubStatsData;
  labels: GithubStatsLabels;
  locale?: string;
  styles: Styles;
}) {
  if (!data.mix) return null;
  const shares = mixShares(data.mix);
  return (
    <section className={styles.mix()}>
      <h3 className={styles.sectionTitle()}>{labels.mixTitle}</h3>
      <div className={styles.mixBar()} aria-hidden="true">
        {shares.map(({ key, share }) =>
          share > 0 ? (
            <span
              key={key}
              className={styles.mixSegment()}
              style={{ flexGrow: share, background: GITHUB_MIX_FILL[key] }}
            />
          ) : null,
        )}
      </div>
      <ul className={styles.mixLegend()}>
        {shares.map(({ key, share }) => (
          <li key={key} className={styles.mixItem()}>
            <span aria-hidden="true" className={styles.mixSwatch()} style={{ background: GITHUB_MIX_FILL[key] }} />
            <span className={styles.mixLabel()}>{labels[key]}</span>
            <span className={styles.mixValue()}>{formatPercent(share, locale)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Where({ data, labels, styles }: { data: GithubStatsData; labels: GithubStatsLabels; styles: Styles }) {
  const repositories = data.repositories ?? [];
  const hidden = repositories.length - REPO_LIMIT;
  return (
    <section className={styles.where()}>
      <h3 className={styles.sectionTitle()}>{labels.contributedTo}</h3>
      <ul className={styles.repoList()}>
        {repositories.slice(0, REPO_LIMIT).map((repo) => (
          <li key={repo.url} className="min-w-0">
            <a href={repo.url} target="_blank" rel="noopener noreferrer" className={styles.repo()}>
              <span className={styles.repoOwner()}>{repo.owner}/</span>
              <span className={styles.repoName()}>{repo.name}</span>
            </a>
          </li>
        ))}
      </ul>
      {hidden > 0 ? (
        data.profileUrl ? (
          <a href={data.profileUrl} target="_blank" rel="noopener noreferrer" className={styles.more()}>
            {labels.more(hidden)}
          </a>
        ) : (
          <p className={styles.more()}>{labels.more(hidden)}</p>
        )
      ) : null}
      {data.organizations?.length ? (
        <p className={styles.orgs()}>
          {labels.alongside}
          {data.organizations.map((org) => (
            <a key={org.url} href={org.url} target="_blank" rel="noopener noreferrer" className={styles.org()}>
              <Avatar size="sm" shape="square" className={styles.orgAvatar()}>
                <AvatarImage src={org.avatarUrl} alt="" />
                <AvatarFallback>{initials(org.name)}</AvatarFallback>
              </Avatar>
              {org.name}
            </a>
          ))}
        </p>
      ) : null}
    </section>
  );
}

function WeeklyChart({
  days,
  labels,
  locale,
}: {
  days: GithubStatsData["contributions"][string];
  labels: GithubStatsLabels;
  locale?: string;
}) {
  const rows = weeklyContributions(days).map((week) => ({
    label: formatDay(week.date, locale),
    count: week.count,
  }));
  return (
    <ChartContainer
      config={{ count: { label: labels.contributions, color: "var(--success)" } }}
      title={`${labels.contributions}: ${labels.weeks.toLowerCase()}`}
      locale={locale}
      aspect="wide"
    >
      <BarChart data={rows} xKey="label">
        <Bar dataKey="count" />
        <BarXAxis maxLabels={8} />
        <BarYAxis tickFormatter={(value) => formatCount(value, locale)} />
        <BarTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(label) => `${labels.weekOf} ${label}`}
              formatter={(value) => formatCount(Number(value), locale)}
            />
          }
        />
      </BarChart>
    </ChartContainer>
  );
}

function TrendArrow({ ratio }: { ratio: number | null }) {
  const d =
    ratio === null || ratio === 0 ? "M2.5 6h7" : ratio > 0 ? "M6 9.5v-7M3 5.5l3-3 3 3" : "M6 2.5v7M3 6.5l3 3 3-3";
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
