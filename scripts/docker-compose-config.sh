#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="${1:-infra/docker-compose.yml}"

if command -v docker >/dev/null 2>&1; then
  if docker compose version >/dev/null 2>&1; then
    exec docker compose -f "${COMPOSE_FILE}" config
  fi
fi

if command -v docker-compose >/dev/null 2>&1; then
  exec docker-compose -f "${COMPOSE_FILE}" config
fi

echo "Error: Docker CLI with Compose plugin or docker-compose binary is required to validate ${COMPOSE_FILE}." >&2
exit 127
