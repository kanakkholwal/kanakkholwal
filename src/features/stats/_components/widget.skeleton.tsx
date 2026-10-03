import { cn } from "@/lib/utils";
import { Widget, WidgetProps } from "./widget";

export function WidgetSkeleton({ className, ...props }: WidgetProps) {
  return <Widget className={cn("animate-pulse", className)} {...props} />;
}
