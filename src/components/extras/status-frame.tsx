import type { ReactNode } from "react";
import { Page, PixelHeading } from "@/components/site/page";
import { RevealText } from "@/components/text/reveal-text";
import { Shortcut } from "@/components/ui/shortcut";

/** Shared frame for 404 and error pages: a big pixel code, one line, a few ways out. */
export function StatusFrame({ code, children, actions }: { code: string; children: ReactNode; actions: ReactNode }) {
  return (
    <Page className="flex min-h-[70dvh] flex-col justify-center">
      <div className="rise mx-auto flex max-w-md flex-col items-center gap-5 text-center">
        <PixelHeading as="h1" className="text-6xl">
          <RevealText text={code} split="char" staggerMs={70} blur={6} />
        </PixelHeading>
        <div className="flex flex-col gap-3 text-base text-muted-foreground text-pretty">{children}</div>
        <div className="mt-1 flex flex-wrap justify-center gap-2">{actions}</div>
        <p className="inline-flex items-center gap-1.5 text-muted-foreground text-sm">
          or press <Shortcut shortcut="mod+k" size="sm" /> to search
        </p>
      </div>
    </Page>
  );
}
