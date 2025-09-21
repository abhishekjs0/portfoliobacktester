from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware


from .core.config import settings
from .core.logging import RequestLoggingMiddleware, configure_logging
from .core.ratelimit import limiter
from .routers import uploads, portfolio, users, sessions, backtests, feedback, billing, analytics

configure_logging(settings.api_log_level)

app = FastAPI(
    title="Portfolio Backtester API",
    description="Aggregate TradingView strategy CSV exports into equal-weight portfolios.",
    version="0.1.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=500)
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(RequestLoggingMiddleware)

app.include_router(uploads.router, prefix="/api/uploads", tags=["uploads"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["portfolio"])
app.include_router(billing.router, prefix="/api/billing", tags=["billing"])
app.include_router(feedback.router, prefix="/api/feedback", tags=["feedback"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(sessions.router, prefix="/api/sessions", tags=["auth"])
app.include_router(backtests.router, prefix="/api/backtests", tags=["backtests"])


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok"}
