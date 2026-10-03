import { useTheme } from "next-themes";
import { Suspense, use, useEffect, useId, useState } from "react";
import { GracefullyDegradingErrorBoundary } from "../utils/error-boundary";

const FRAME = "not-prose my-6 overflow-x-auto rounded-xl border border-border bg-card p-4";

export function Mermaid({ chart }: { chart: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fixed-height placeholder so the article does not jump when the diagram lands.
  const placeholder = <div aria-hidden="true" className={`${FRAME} h-64`} />;
  if (!mounted) return placeholder;
  return (
    <GracefullyDegradingErrorBoundary fallback={<pre className={FRAME}>{chart.trim()}</pre>}>
      {/* Own boundary: suspending here must not blank the article's outer Suspense. */}
      <Suspense fallback={placeholder}>
        <MermaidContent chart={chart} />
      </Suspense>
    </GracefullyDegradingErrorBoundary>
  );
}

// Constant-folded in the SSR build so mermaid (and cytoscape, katex) stay out of the Worker bundle.
const loadMermaid = () =>
  import.meta.env.SSR ? Promise.reject(new Error("mermaid is client-only")) : import("mermaid");

const cache = new Map<string, Promise<unknown>>();

function cachePromise<T>(key: string, setPromise: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  if (cached) return cached as Promise<T>;
  const promise = setPromise();
  cache.set(key, promise);
  return promise;
}

function MermaidContent({ chart }: { chart: string }) {
  const id = useId();
  const { resolvedTheme } = useTheme();
  const { default: mermaid } = use(cachePromise("mermaid", loadMermaid));

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    fontFamily: "inherit",
    theme: resolvedTheme === "dark" ? "dark" : "neutral",
  });

  const { svg, bindFunctions } = use(
    cachePromise(`${chart}-${resolvedTheme}`, () => mermaid.render(id, chart.replaceAll("\\n", "\n"))),
  );

  return (
    <div
      ref={(container) => {
        if (container) bindFunctions?.(container);
      }}
      className={`${FRAME} flex justify-center [&_svg]:max-w-full`}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: mermaid renders trusted chart source from our own MDX.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
