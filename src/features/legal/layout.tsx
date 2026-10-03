import type { ReactNode } from "react";
import { Page, PageHeader } from "@/components/site/page";

export const LEGAL_UPDATED = "October 4, 2026";

export function LegalPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Page>
      <PageHeader title={title} eyebrow={`Updated ${LEGAL_UPDATED}`} description={description} />
      <article className="rise prose max-w-2xl prose-h2:mt-10 prose-h2:font-medium prose-h2:text-lg [--i:1]">
        {children}
      </article>
    </Page>
  );
}
