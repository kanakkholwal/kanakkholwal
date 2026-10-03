import type { ReactNode } from "react";
import { Icon, type IconType } from "@/components/icons";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/lib/cn";

/** A deliberate blank: what is missing and why, in the same dashed frame everywhere. */
export function StatsEmpty({
  icon,
  title,
  description,
  children,
  className,
}: {
  icon: IconType;
  title: string;
  description: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Empty variant="outline" role="status" className={cn("rounded-2xl", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon name={icon} />
        </EmptyMedia>
        <EmptyTitle className="text-base">{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {children ? <EmptyContent>{children}</EmptyContent> : null}
    </Empty>
  );
}
