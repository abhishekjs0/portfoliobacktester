#!/usr/bin/env bash
set -euo pipefail

if ! command -v vercel >/dev/null 2>&1; then
  echo "Error: vercel CLI is not installed. Install it with 'npm i -g vercel'." >&2
  exit 127
fi

TOKEN="${VERCEL_TOKEN:-${VERCEL_DEPLOY_TOKEN:-}}"
if [[ -z "${TOKEN}" ]]; then
  echo "Error: set VERCEL_TOKEN (or VERCEL_DEPLOY_TOKEN) in your environment before running this script." >&2
  exit 1
fi

exec vercel deploy --prebuilt --prod --yes --token "${TOKEN}" "$@"
