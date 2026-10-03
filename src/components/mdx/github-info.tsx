import { GithubInfo as FumaGithubInfo } from "fumadocs-ui/components/github-info";
import { type ComponentProps, Suspense } from "react";
import { GracefullyDegradingErrorBoundary } from "@/components/utils/error-boundary";

// Workers' fetch sends no User-Agent and GitHub's API rejects such requests (browsers ignore this header).
const FETCH_OPTIONS = { headers: { "User-Agent": "kanakkholwal.eu.org" } };

/** fumadocs' GithubInfo that degrades to a plain repo link instead of failing the whole MDX render. */
export function GithubInfo(props: ComponentProps<typeof FumaGithubInfo>) {
  const fallback = (
    <a
      href={`https://github.com/${props.owner}/${props.repo}`}
      target="_blank"
      rel="noreferrer noopener"
      className={props.className}
    >
      {props.owner}/{props.repo}
    </a>
  );
  return (
    <GracefullyDegradingErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <FumaGithubInfo fetchOptions={FETCH_OPTIONS} {...props} />
      </Suspense>
    </GracefullyDegradingErrorBoundary>
  );
}
