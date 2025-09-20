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

1. Copy `.env.example` to `.env` and adjust credentials for Postgres, MinIO, Stripe, and OAuth providers.
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

