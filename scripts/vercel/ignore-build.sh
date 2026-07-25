#!/usr/bin/env bash
# Vercel "Ignored Build Step" engine. Exit 1 = build, exit 0 = skip.
# Usage: bash scripts/vercel/ignore-build.sh [extra ignored pathspec...]
set -uo pipefail

build() { echo "✅ BUILD: $1"; exit 1; }
skip()  { echo "🛑 SKIP: $1";  exit 0; }

MSG="${VERCEL_GIT_COMMIT_MESSAGE:-}"
ENV_NAME="${VERCEL_ENV:-unknown}"
REF="${VERCEL_GIT_COMMIT_REF:-unknown}"
AUTHOR="${VERCEL_GIT_COMMIT_AUTHOR_LOGIN:-${VERCEL_GIT_COMMIT_AUTHOR_NAME:-unknown}}"

echo "▲ env=$ENV_NAME ref=$REF author=$AUTHOR"
echo "▲ msg=${MSG%%$'\n'*}"

# Paths that can never change the rendered site.
IGNORED_PATHS=(
  ':(exclude)README.md'
  ':(exclude)LICENSE'
  ':(exclude)CHANGELOG.md'
  ':(exclude).github/'
  ':(exclude).vscode/'
  ':(exclude).gitignore'
  ':(exclude).gitattributes'
  ':(exclude).editorconfig'
  ':(exclude)docs/'
)

# Branches that only exist to hold generated artifacts (pacman graph, gh-pages).
IGNORED_BRANCHES=(
  'pacmangraph'
  'gh-pages'
  'badges'
)

# Bots whose commits are cron output only. Dependabot is deliberately absent —
# it touches package.json/bun.lock and must deploy.
CRON_BOTS=(
  'github-actions[bot]'
  'github-actions'
  'actions-user'
  'web-flow'
)

# 1. Escape hatches win over everything else.
case "$MSG" in
  *"[vercel deploy]"*|*"[force deploy]"*|*"[force build]"*)
    build "commit message requests a forced deploy" ;;
  *"[vercel skip]"*|*"[skip deploy]"*|*"[skip ci]"*|*"[ci skip]"*)
    skip "commit message requests a skip" ;;
esac

# 2. Artifact branches never deserve a preview deployment.
for branch in "${IGNORED_BRANCHES[@]}"; do
  [ "$REF" = "$branch" ] && skip "'$REF' is a generated-artifact branch"
done

# 3. Cron bot commits, decided before any git work so shallow clones skip too.
for bot in "${CRON_BOTS[@]}"; do
  if [ "$AUTHOR" = "$bot" ]; then
    case "$MSG" in
      *"Update README"*|*"update README"*|*"recent activity"*|*"contribution-graph"*|*"pacman"*|*"snake"*|*"waka"*|*"metrics"*)
        skip "cron commit by $AUTHOR" ;;
    esac
  fi
done

# 4. Manual redeploys / CLI builds have no usable git context — fail open.
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  build "no git metadata available"
fi

# Vercel clones shallow; deepen once so HEAD^ resolves.
BASE="${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}"
if ! git rev-parse --verify --quiet "$BASE" >/dev/null 2>&1; then
  git fetch --deepen=25 --quiet >/dev/null 2>&1 || true
fi
if ! git rev-parse --verify --quiet "$BASE" >/dev/null 2>&1; then
  build "base commit '$BASE' unavailable (shallow clone / initial commit)"
fi

CHANGED="$(git diff --name-only "$BASE" HEAD -- . "${IGNORED_PATHS[@]}" "$@")"

if [ -z "$CHANGED" ]; then
  skip "only ignored paths changed since $(git rev-parse --short "$BASE")"
fi

echo "── changed files ──"
echo "$CHANGED" | head -20
TOTAL="$(echo "$CHANGED" | wc -l | tr -d ' ')"
[ "$TOTAL" -gt 20 ] && echo "   … and $((TOTAL - 20)) more"

build "$TOTAL source file(s) changed"
