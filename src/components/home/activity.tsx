import { resume_link } from "root/project.config";
import { GithubCalendar } from "@/components/blocks/github-calendar";
import { Icon } from "@/components/icons";
import { ArrowLink, ButtonLink } from "@/components/site/link";
import { CAL_URL, EMAIL } from "@/components/site/nav";
import { Well } from "@/components/site/page";
import { RollText } from "@/components/text/roll-text";
import { cn } from "@/lib/cn";

// The ramp is the accent at rising strength, so the graph follows the picked theme.
const ACCENT_RAMP =
  "[--chart-scale-2:color-mix(in_oklab,var(--primary)_22%,transparent)] [--chart-scale-3:color-mix(in_oklab,var(--primary)_42%,transparent)] [--chart-scale-4:color-mix(in_oklab,var(--primary)_68%,transparent)] [--chart-scale-5:var(--primary)]";

// The year can be wider than the pane: it still scrolls, without a bar, and the clipped edge fades.
const EDGE_FADE =
  "max-xl:[&>div:has(>[role=toolbar])]:[mask-image:linear-gradient(to_right,transparent,black_28px)] [&>div:has(>[role=toolbar])]:[scrollbar-width:none] [&>div:has(>[role=toolbar])::-webkit-scrollbar]:hidden";

export function Activity({ days }: { days: { date: string; count: number }[] }) {
  return (
    <Well
      className="rise [--i:2]"
      footer={
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Product engineer, open to founding engineer roles at early-stage teams.{" "}
            <ArrowLink href={resume_link} className="text-foreground">
              Resume
            </ArrowLink>
          </p>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href={CAL_URL} variant="default" size="md" className="group/roll">
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
          className={cn(ACCENT_RAMP, EDGE_FADE)}
        />
      ) : (
        <p className="py-6 text-center text-muted-foreground text-sm">
          Contribution graph is resting. GitHub didn't answer.
        </p>
      )}
    </Well>
  );
}
