# Portfolio Backtester

Portfolio Backtester automates multi-symbol TradingView strategy aggregation. Upload many “List of trades” CSV exports at once, run equal-capital portfolio math, and review a TradingView-like dashboard that mirrors familiar KPIs, reports, and equity curves.

## Features

- Next.js 14 + Tailwind + shadcn/ui-inspired components for a TradingView-style dashboard
- FastAPI backend with Pandas/NumPy powered portfolio analytics
- Equal-capital portfolio compounding, daily aligned equity curves, CAGR approximation, and TradingView report parity
- Stripe metered subscriptions, NextAuth (Email/Google/GitHub), and usage gating per plan
- Postgres persistence, MinIO (S3-compatible) file storage, and saved backtest runs
- Docker Compose stack with nginx reverse proxy, seeded demo data, and Playwright/FastAPI tests

## Repository Layout

```
app/        # Next.js frontend
api/        # FastAPI backend services
infra/      # Docker, nginx, and deployment manifests
db/         # SQL migrations and seed helpers
examples/   # Sample TradingView CSV exports
tests/      # Cross-cutting docs/tests (FastAPI + PyTest inside api/, Playwright inside app/)
```

## Quickstart (Development)

1. Copy `.env.example` to `.env` (project root) and adjust the credentials for Postgres, MinIO, and any OAuth/email providers you plan to enable. For local Next.js development also copy it to `app/.env.local` so the frontend can read the same values.
2. Install dependencies for the backend and frontend:
   ```bash
   cd api && pip install -e .[dev]
   cd ../app && npm install
   ```
3. Run the backend:
   ```bash
   uvicorn app.main:app --reload --port 8000 --app-dir api
   ```
4. Run the frontend (in a new terminal):
   ```bash
   cd app
   npm run dev
   ```
5. Visit `http://localhost:3000` and upload the sample CSVs from `examples/`.

## Preview without touching code (Docker Desktop)

If you just want to see the app in action without learning any commands, follow this plain-language checklist:

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop) and open it once so it finishes setting up.
2. Download or clone this repository and open a terminal (Terminal on macOS, Command Prompt or PowerShell on Windows).
3. Inside the project folder run `cp .env.example .env` (macOS/Linux) or `copy .env.example .env` (Windows). The file already contains safe defaults for a quick preview.
4. Start the stack with `cd infra` followed by `docker compose up --build`. The first run may take a few minutes while Docker downloads everything.
5. When the scrolling text shows that the web server is ready, open your browser to `http://localhost:3000`. Leave the terminal open while you click around.
6. Press `Ctrl + C` in the terminal when you want to shut everything down.

## Docker instructions

Build and start the full stack with one command:

```bash
cd infra
docker compose up --build
```

The stack exposes:

- nginx proxy: `http://localhost:8080`
- Next.js (direct): `http://localhost:3000`
- FastAPI: `http://localhost:8000`
- MinIO console: `http://localhost:9001` (credentials from `.env`)

The Docker entrypoints automatically install dependencies, apply migrations (see `db/migrations`), and serve the production build.

## Environment variables

The project shares a single `.env` file for both the FastAPI backend and the Next.js frontend. The sample `.env.example` includes sensible defaults for local Docker Compose usage:

| Variable                                                         | Purpose                                                                                                                                                 |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                                                   | Postgres connection string used by Prisma and FastAPI (FastAPI automatically upgrades it to the `postgresql+psycopg://` form that SQLAlchemy requires). |
| `S3_ENDPOINT_URL`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_BUCKET` | Object storage configuration for uploaded TradingView CSVs (MinIO or AWS S3).                                                                           |
| `NEXTAUTH_SECRET`, `NEXTAUTH_URL`                                | Required for NextAuth session encryption and callback URL configuration.                                                                                |
| `GOOGLE_*`, `GITHUB_*`                                           | Optional OAuth providers for social login. Leave blank to disable.                                                                                      |
| `EMAIL_*`                                                        | SMTP credentials for passwordless email sign-in (optional).                                                                                             |
| `NEXT_PUBLIC_API_BASE_URL`, `FASTAPI_URL`                        | URLs the frontend uses to talk to the FastAPI API. Update to match your deployment hostnames.                                                           |

Copy `.env.example` to `.env` before running any of the services, and populate the placeholders with the credentials for your server. When running the Next.js dev server outside Docker, duplicate the file to `app/.env.local` (or export the variables in your shell) so that Prisma and NextAuth receive the same configuration. In that scenario the Postgres host should typically be `localhost` instead of the Docker service name `postgres`.
