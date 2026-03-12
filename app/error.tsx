"use client";

import ErrorPageClient from "@/components/utils/error-page.client";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[ErrorBoundary]", error);
  }, [error]);

  return <ErrorPageClient error={error} reset={reset} />;
}
