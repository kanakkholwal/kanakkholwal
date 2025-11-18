import { MagicCard } from "@/components/animated/bg.card";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

export type WidgetProps = Omit<ComponentProps<"div">, "title"> & {
  title?: ReactNode;
};

export function Widget({ title, children, className, ...props }: WidgetProps) {
  return (
    <MagicCard
    layerClassName="bg-card"
    className={cn("h-96 rounded-xl border p-2 shadow", className)} {...props}>
      {Boolean(title) && (
        <div className="flex flex-wrap items-center gap-2 pl-1.5 text-lg font-bold text-inherit">
          {title}
        </div>
      )}
      {children}
    </MagicCard>
  );
}
