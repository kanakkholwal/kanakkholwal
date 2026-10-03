import { useEffect } from "react";
import { StatusFrame } from "@/components/extras/status-frame";
import { Icon } from "@/components/icons";
import { ButtonLink } from "@/components/site/link";
import { Button } from "@/components/ui/button";

interface ErrorPageClientProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPageClient({ error, reset }: ErrorPageClientProps) {
  useEffect(() => console.error(error), [error]);

  return (
    <StatusFrame
      code="error."
      actions={
        <>
          <Button variant="default" onClick={reset}>
            <Icon name="refresh" />
            Retry
          </Button>
          <ButtonLink href="/" variant="outline">
            <Icon name="home" />
            Home
          </ButtonLink>
        </>
      }
    >
      <p>Something broke while loading this page. Retrying usually fixes it.</p>
      {/* The raw message helps while building; visitors get the plain sentence above. */}
      {import.meta.env.DEV && error.message ? (
        <p className="break-words rounded-xl border border-border bg-card px-3 py-2 text-left font-mono text-foreground text-xs">
          {error.message}
          {error.digest ? <span className="block text-muted-foreground">digest: {error.digest}</span> : null}
        </p>
      ) : null}
    </StatusFrame>
  );
}
