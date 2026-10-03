import { Component, type ErrorInfo, type ReactNode, Suspense } from "react";
import ErrorBanner from "@/components/utils/error";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/** Contains a render failure to one part of the page; the rest keeps working. */
export class GracefullyDegradingErrorBoundary extends Component<ErrorBoundaryProps, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      this.props.fallback ?? (
        <ErrorBanner
          error={this.state.error}
          title="This part didn't load"
          description="The rest of the page is fine. Retry, or reload if it keeps failing."
          reset={() => this.setState({ error: null })}
        />
      )
    );
  }
}

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return <GracefullyDegradingErrorBoundary {...props} />;
}

/** Suspense outside, so a component that throws while loading still lands on the error fallback. */
export function ErrorBoundaryWithSuspense({
  loadingFallback,
  ...props
}: ErrorBoundaryProps & { loadingFallback: ReactNode }) {
  return (
    <Suspense fallback={loadingFallback}>
      <GracefullyDegradingErrorBoundary {...props} />
    </Suspense>
  );
}
