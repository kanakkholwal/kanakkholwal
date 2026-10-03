import { useEffect } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";

type Props = {
  error?: Error & { digest?: string };
  title?: string;
  description?: string;
  reset?: () => void;
};

/** Inline fallback for a section that failed to render; the rest of the page keeps working. */
export default function ErrorBanner({ error, title, description, reset }: Props) {
  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  return (
    <div role="alert" className="flex flex-col items-start gap-3 rounded-xl border border-border border-dashed p-4">
      <div className="flex flex-col gap-1">
        <p className="inline-flex items-center gap-2 font-medium text-foreground text-sm">
          <Icon name="warning" className="size-4 text-muted-foreground" />
          {title ?? "Something went wrong"}
        </p>
        <p className="text-muted-foreground text-sm text-pretty">
          {description ?? "This part of the page failed to load."}
        </p>
        {error?.digest ? <p className="font-mono text-muted-foreground text-xs">digest: {error.digest}</p> : null}
      </div>
      <Button variant="outline" size="sm" onClick={reset ?? (() => window.location.reload())}>
        <Icon name="refresh" />
        {reset ? "Retry" : "Reload"}
      </Button>
    </div>
  );
}
