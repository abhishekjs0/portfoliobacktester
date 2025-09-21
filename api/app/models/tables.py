from __future__ import annotations

from datetime import datetime, date
from typing import Optional

from sqlalchemy import (
    JSON,
    Boolean,
    Date,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class User(Base):
    id: Mapped[str] = mapped_column(String(255), primary_key=True)
    email: Mapped[str | None] = mapped_column(String(255), unique=True)
    name: Mapped[str | None] = mapped_column(String(255))
    plan: Mapped[str] = mapped_column(String(32), default="free")
    subscription_status: Mapped[str] = mapped_column(String(32), default="inactive")
    stripe_customer_id: Mapped[str | None] = mapped_column(String(255))
    stripe_subscription_id: Mapped[str | None] = mapped_column(String(255))
    subscription_valid_until: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    batches: Mapped[list[Batch]] = relationship(back_populates="user")
    usage_logs: Mapped[list[UsageLog]] = relationship(back_populates="user")
    subscriptions: Mapped[list[Subscription]] = relationship(back_populates="user", cascade="all, delete-orphan")
    feedback_entries: Mapped[list[FeedbackEntry]] = relationship(back_populates="user", cascade="all, delete-orphan")
    analytics_events: Mapped[list[AnalyticsEvent]] = relationship(back_populates="user", cascade="all, delete-orphan")


class Batch(Base):
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    strategy_name: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    user: Mapped[User] = relationship(back_populates="batches")
    files: Mapped[list[UploadFileRecord]] = relationship(back_populates="batch", cascade="all, delete-orphan")
    runs: Mapped[list[PortfolioRun]] = relationship(back_populates="batch", cascade="all, delete-orphan")


class UploadFileRecord(Base):
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    batch_id: Mapped[str] = mapped_column(ForeignKey("batch.id", ondelete="CASCADE"))
    ticker: Mapped[str] = mapped_column(String(32))
    strategy: Mapped[str] = mapped_column(String(255))
    export_date: Mapped[date]
    filename: Mapped[str] = mapped_column(String(255))
    object_key: Mapped[str] = mapped_column(String(255))
    rows_parsed: Mapped[int] = mapped_column(Integer)
    rows_skipped: Mapped[int] = mapped_column(Integer)
    warnings: Mapped[list[str]] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    batch: Mapped[Batch] = relationship(back_populates="files")


class PortfolioRun(Base):
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    batch_id: Mapped[str] = mapped_column(ForeignKey("batch.id", ondelete="CASCADE"))
    currency: Mapped[str] = mapped_column(String(8), default="USD")
    total_capital: Mapped[float] = mapped_column(Float)
    date_start: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    date_end: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    metrics: Mapped[dict] = mapped_column(JSON)
    equity_curve: Mapped[list[dict]] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    batch: Mapped[Batch] = relationship(back_populates="runs")


class UsageLog(Base):
    __tablename__ = "usage_log"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    date: Mapped[date] = mapped_column(Date)
    runs: Mapped[int] = mapped_column(Integer, default=0)
    files_uploaded: Mapped[int] = mapped_column(Integer, default=0)

    user: Mapped[User] = relationship(back_populates="usage_logs")

    __table_args__ = (UniqueConstraint("user_id", "date", name="uq_usage_user_date"),)


<<<<<<< HEAD
class Plan(Base):
    __tablename__ = "plans"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    price_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    features: Mapped[dict | None] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    users: Mapped[list[SaaSUser]] = relationship(back_populates="plan")


class SaaSUser(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    plan_id: Mapped[int] = mapped_column(ForeignKey("plans.id", ondelete="RESTRICT"), nullable=False)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    email: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    plan: Mapped[Plan] = relationship(back_populates="users")
    leads: Mapped[list[Lead]] = relationship(back_populates="user", cascade="all, delete-orphan")
    strategies: Mapped[list[Strategy]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    uploads: Mapped[list[Upload]] = relationship(back_populates="user", cascade="all, delete-orphan")
    backtests: Mapped[list[Backtest]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    feedback_entries: Mapped[list[Feedback]] = relationship(back_populates="user")


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    name: Mapped[str | None] = mapped_column(Text)
    email: Mapped[str | None] = mapped_column(Text)
    message: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped[SaaSUser | None] = relationship(back_populates="leads")


class Strategy(Base):
    __tablename__ = "strategies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    code: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    user: Mapped[SaaSUser] = relationship(back_populates="strategies")
    backtests: Mapped[list[Backtest]] = relationship(back_populates="strategy")

    __table_args__ = (UniqueConstraint("user_id", "name", name="uq_strategy_user_name"),)


class Upload(Base):
    __tablename__ = "uploads"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename: Mapped[str] = mapped_column(Text, nullable=False)
    s3_key: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped[SaaSUser] = relationship(back_populates="uploads")
    backtests: Mapped[list[Backtest]] = relationship(back_populates="upload")

    __table_args__ = (UniqueConstraint("user_id", "s3_key", name="uq_upload_user_object"),)


class Backtest(Base):
    __tablename__ = "backtests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    strategy_id: Mapped[int] = mapped_column(ForeignKey("strategies.id", ondelete="CASCADE"), nullable=False)
    upload_id: Mapped[int | None] = mapped_column(
        ForeignKey("uploads.id", ondelete="SET NULL"), nullable=True
    )
    start_date: Mapped[date | None] = mapped_column(Date)
    end_date: Mapped[date | None] = mapped_column(Date)
    result_json: Mapped[dict | None] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    user: Mapped[SaaSUser] = relationship(back_populates="backtests")
    strategy: Mapped[Strategy] = relationship(back_populates="backtests")
    upload: Mapped[Upload | None] = relationship(back_populates="backtests")


class Feedback(Base):
    __tablename__ = "feedback"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    message: Mapped[str] = mapped_column(Text, nullable=False)
    rating: Mapped[int | None] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped[SaaSUser | None] = relationship(back_populates="feedback_entries")
=======
class Subscription(Base):
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    stripe_subscription_id: Mapped[str] = mapped_column(String(255))
    plan: Mapped[str] = mapped_column(String(32))
    interval: Mapped[str] = mapped_column(String(16))
    status: Mapped[str] = mapped_column(String(32))
    current_period_end: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    user: Mapped[User] = relationship(back_populates="subscriptions")


class FeedbackEntry(Base):
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str | None] = mapped_column(ForeignKey("user.id", ondelete="SET NULL"), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255))
    message: Mapped[str] = mapped_column(Text)
    score: Mapped[int | None] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    user: Mapped[User | None] = relationship(back_populates="feedback_entries")


class AnalyticsEvent(Base):
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str | None] = mapped_column(ForeignKey("user.id", ondelete="SET NULL"), nullable=True)
    event: Mapped[str] = mapped_column(String(128))
    payload: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    user: Mapped[User | None] = relationship(back_populates="analytics_events")
>>>>>>> origin/main
