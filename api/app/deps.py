from __future__ import annotations

from datetime import date

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from . import db
from .models import tables
from .services.auth import UserService
from .services.backtests import BacktestService
from .services.feedback import FeedbackService


def get_db_session() -> Session:
    yield from db.get_db()


def get_current_user(
    db_session: Session = Depends(get_db_session),
    x_user_id: str | None = Header(default=None, alias="X-User-Id"),
    x_user_plan: str | None = Header(default=None, alias="X-User-Plan"),
) -> tables.User:
    user_id = x_user_id or "demo-user"
    plan = x_user_plan or "pro"
    user = db_session.get(tables.User, user_id)
    if not user:
        user = tables.User(id=user_id, plan=plan)
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
    else:
        if user.plan != plan:
            user.plan = plan
            db_session.add(user)
            db_session.commit()
    return user


def _get_usage(db_session: Session, user: tables.User) -> tables.UsageLog:
    today = date.today()
    usage = (
        db_session.query(tables.UsageLog)
        .filter(tables.UsageLog.user_id == user.id, tables.UsageLog.date == today)
        .first()
    )
    if not usage:
        usage = tables.UsageLog(user_id=user.id, date=today, runs=0, files_uploaded=0)
        db_session.add(usage)
        db_session.commit()
    return usage


def enforce_plan_limits(user: tables.User, db_session: Session, files_count: int) -> None:
    usage = _get_usage(db_session, user)

    plan_limits = {
        "free": (settings.free_max_files, settings.free_runs_per_day),
        "pro": (settings.pro_max_files, settings.pro_runs_per_day),
        "enterprise": (settings.enterprise_max_files, settings.enterprise_runs_per_day),
    }
    max_files, max_runs = plan_limits.get(user.plan, plan_limits["free"])

    if files_count > max_files:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail={
                "message": "Upload exceeds plan file limit",
                "action": "upgrade",
                "plan": user.plan,
                "maxFiles": max_files,
            },
        )

    usage.files_uploaded += files_count
    db_session.add(usage)
    db_session.commit()


def track_run(user: tables.User, db_session: Session) -> None:
    usage = _get_usage(db_session, user)
    plan_limits = {
        "free": (settings.free_max_files, settings.free_runs_per_day),
        "pro": (settings.pro_max_files, settings.pro_runs_per_day),
        "enterprise": (settings.enterprise_max_files, settings.enterprise_runs_per_day),
    }
    _, max_runs = plan_limits.get(user.plan, plan_limits["free"])
    if usage.runs >= max_runs:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail={
                "message": "Daily run limit reached",
                "action": "upgrade",
                "plan": user.plan,
                "maxRuns": max_runs,
            },
        )
    usage.runs += 1
    db_session.add(usage)
    db_session.commit()


from .core.config import settings

_user_service = UserService()
_user_service.seed_user(email="user@example.com", password="CorrectPassword123!", name="Demo User")
_backtest_service = BacktestService()
_feedback_service = FeedbackService()


def get_user_service() -> UserService:
    return _user_service


def get_backtest_service() -> BacktestService:
    return _backtest_service


def get_feedback_service() -> FeedbackService:
    return _feedback_service
