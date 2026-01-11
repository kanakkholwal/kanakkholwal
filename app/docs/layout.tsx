import PageWrapper from "@/components/wrapper";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (<PageWrapper>
    {children}
  </PageWrapper>
  );
}