#!/usr/bin/env bash
set -euo pipefail

if [[ $# -gt 0 && ( "$1" == "-h" || "$1" == "--help" ) ]]; then
  cat <<'USAGE'
Usage: scripts/vercel-deploy.sh [extra vercel deploy args]

Wraps the Vercel CLI to ensure a project-local binary is used and that a
VERCEL_TOKEN (or VERCEL_DEPLOY_TOKEN) is passed automatically. Additional
arguments are forwarded to `vercel deploy`.

Examples:
  VERCEL_TOKEN=abc123 scripts/vercel-deploy.sh
  VERCEL_TOKEN=abc123 scripts/vercel-deploy.sh --metadata branch=main
USAGE
  exit 0
fi

if command -v vercel >/dev/null 2>&1; then
  VERCEL_CMD=(vercel)
elif command -v pnpm >/dev/null 2>&1; then
  VERCEL_CMD=(pnpm dlx vercel)
elif command -v npx >/dev/null 2>&1; then
  VERCEL_CMD=(npx vercel)
else
  echo "Error: vercel CLI is not installed and pnpm/npx are unavailable to download it automatically." >&2
  echo "Install the CLI with 'pnpm add -g vercel' or 'npm i -g vercel' and rerun." >&2
  exit 127
fi

TOKEN="${VERCEL_TOKEN:-${VERCEL_DEPLOY_TOKEN:-}}"
if [[ -z "${TOKEN}" ]]; then
  echo "Error: set VERCEL_TOKEN (or VERCEL_DEPLOY_TOKEN) in your environment before running this script." >&2
  exit 1
fi

exec "${VERCEL_CMD[@]}" deploy --prebuilt --prod --yes --token "${TOKEN}" "$@"
