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
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class User(Base):
    id: Mapped[str] = mapped_column(String(255), primary_key=True)
    email: Mapped[str | None] = mapped_column(String(255), unique=True)
    name: Mapped[str | None] = mapped_column(String(255))
    plan: Mapped[str] = mapped_column(String(32), default="free")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    batches: Mapped[list[Batch]] = relationship(back_populates="user")
    usage_logs: Mapped[list[UsageLog]] = relationship(back_populates="user")


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
