import { resume_link } from "root/project.config";
import { GithubCalendar } from "@/components/blocks/github-calendar";
import { Icon } from "@/components/icons";
import { ArrowLink, ButtonLink } from "@/components/site/link";
import { CAL_URL, EMAIL } from "@/components/site/nav";
import { Well } from "@/components/site/page";
import { RollText } from "@/components/text/roll-text";
import { cn } from "@/lib/cn";

// Monochrome ramp: the page has no accent to spend on a decorative graph.
const NEUTRAL_RAMP =
  "[--chart-scale-2:color-mix(in_oklab,var(--foreground)_16%,transparent)] [--chart-scale-3:color-mix(in_oklab,var(--foreground)_32%,transparent)] [--chart-scale-4:color-mix(in_oklab,var(--foreground)_52%,transparent)] [--chart-scale-5:color-mix(in_oklab,var(--foreground)_78%,transparent)]";

// The year is wider than the column; fade the scrolled-off edge instead of clipping a column in half.
const EDGE_FADE = "max-lg:[&>div:has(>[role=toolbar])]:[mask-image:linear-gradient(to_right,transparent,black_28px)]";

export function Activity({ days }: { days: { date: string; count: number }[] }) {
  return (
    <Well
      className="rise [--i:2]"
      footer={
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Software engineer at Zoven AI. Happy to talk about side projects and collaborations.{" "}
            <ArrowLink href={resume_link} className="text-foreground">
              Resume
            </ArrowLink>
          </p>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href={CAL_URL} variant="dark" size="md" className="group/roll">
              <Icon name="calendar" />
              <RollText text="Book an intro call" groupHover size="sm" />
            </ButtonLink>
            <ButtonLink href={`mailto:${EMAIL}`} variant="outline" size="md" className="group/roll">
              <Icon name="mail" />
              <RollText text="Send an email" groupHover size="sm" />
            </ButtonLink>
          </div>
        </div>
      }
    >
      {days.length ? (
        <GithubCalendar
          days={days}
          size="fluid"
          shape="rounded"
          showTotal
          showLegend
          locale="en-US"
          labels={{ grid: "GitHub contributions, last 12 months" }}
          className={cn(NEUTRAL_RAMP, EDGE_FADE)}
        />
      ) : (
        <p className="py-6 text-center text-muted-foreground text-sm">
          Contribution graph is resting. GitHub didn't answer.
        </p>
      )}
    </Well>
  );
}
