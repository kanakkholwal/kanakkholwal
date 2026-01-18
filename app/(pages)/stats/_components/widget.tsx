import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

export type WidgetProps = Omit<ComponentProps<"div">, "title"> & {
  title?: ReactNode;
  icon?: ReactNode;
};

export function Widget({ title, children, className, ...props }: WidgetProps) {
  return (
    <Card
      className={cn(
        "relative flex flex-col rounded-xl border border-border",
        // Base Glassmorphism
        "bg-background/60 backdrop-blur-md shadow-sm",
        // Interactive states
        "transition-all duration-300 hover:shadow-md hover:border-primary/20",
        "h-auto min-h-[200px]",
        className
      )}
      {...props}
    >
      {Boolean(title) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/40 bg-muted/20 rounded-t-xl">
          <div className="flex flex-wrap items-center gap-2 text-foreground font-medium w-full tracking-tight">
            {title}
          </div>
        </div>
      )}

      <div className="flex-1 p-5 relative">
        {children}
      </div>
    </Card>
  );
}