from __future__ import annotations

import csv
import io
import uuid
from datetime import datetime
from typing import Iterable

import pandas as pd
from fastapi import UploadFile
from sqlalchemy.orm import Session

from ..core.config import settings
from ..models import tables
from ..models.schemas import FileIngestReport
from .storage import storage_service

REQUIRED_COLUMNS = [
    "Trade #",
    "Type (Long/Short)",
    "Date/Time",
    "Signal",
    "Price",
    "Position size",
    "Net P&L",
    "Run-up",
    "Drawdown",
    "Cumulative P&L",
]


# Map canonical headers to acceptable aliases ordered by preference.
COLUMN_ALIASES: dict[str, tuple[str, ...]] = {
    "Type (Long/Short)": (
        "Type",
        "Trade type",
        "Direction",
    ),
    "Price": (
        "Price INR",
        "Price USD",
        "Entry price",
        "Exit price",
    ),
    "Position size": (
        "Position size (value)",
        "Position size (qty)",
        "Position size value",
        "Position size quantity",
    ),
    "Net P&L": (
        "Net P&L INR",
        "Net profit",
        "Profit",
    ),
    "Run-up": (
        "Run-up INR",
        "Runup",
        "Max run-up",
    ),
    "Drawdown": (
        "Drawdown INR",
        "Draw down",
        "Max drawdown",
    ),
    "Cumulative P&L": (
        "Cumulative P&L INR",
        "Cumulative profit",
    ),
}


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Rename known column aliases to their canonical headers."""

    normalized = df.copy()
    normalized.columns = [col.strip() for col in normalized.columns]

    rename_map: dict[str, str] = {}
    for canonical, aliases in COLUMN_ALIASES.items():
        if canonical in normalized.columns:
            continue
        for alias in aliases:
            if alias in normalized.columns:
                rename_map[alias] = canonical
                break

    if rename_map:
        normalized = normalized.rename(columns=rename_map)

    return normalized


def parse_filename(filename: str) -> tuple[str, str, datetime]:
    try:
        strategy, ticker, date_part = filename.replace(".csv", "").rsplit("_", 2)
        export_date = datetime.strptime(date_part, "%Y-%m-%d")
        return strategy, ticker, export_date
    except ValueError as exc:
        raise ValueError(
            "Filename must follow Strategy_Ticker_YYYY-MM-DD.csv"
        ) from exc


def validate_columns(df: pd.DataFrame) -> None:
    missing = [c for c in REQUIRED_COLUMNS if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns: {', '.join(missing)}")


def ingest_files(db: Session, user: tables.User, files: Iterable[UploadFile]) -> tuple[tables.Batch, list[FileIngestReport]]:
    batch_id = str(uuid.uuid4())
    first_strategy: str | None = None
    batch = tables.Batch(id=batch_id, user_id=user.id, strategy_name="")
    db.add(batch)

    reports: list[FileIngestReport] = []

    storage_service.ensure_bucket()

    for upload in files:
        file_bytes = upload.file.read()
        buffer = io.BytesIO(file_bytes)
        df = pd.read_csv(buffer)
        df = normalize_columns(df)
        validate_columns(df)
        strategy, ticker, export_date = parse_filename(upload.filename)
        if first_strategy is None:
            first_strategy = strategy
            batch.strategy_name = strategy
        elif strategy != first_strategy:
            raise ValueError("All files in a batch must belong to the same strategy")

        df = df.drop_duplicates(subset=["Trade #", "Date/Time", "Signal"])  # dedupe duplicates
        rows_parsed = len(df)
        rows_skipped = 0
        warnings: list[str] = []

        object_key = f"{batch_id}/{uuid.uuid4()}-{upload.filename}"
        storage_service.put_object(object_key, io.BytesIO(file_bytes))

        record = tables.UploadFileRecord(
            id=str(uuid.uuid4()),
            batch_id=batch_id,
            ticker=ticker,
            strategy=strategy,
            export_date=export_date.date(),
            filename=upload.filename,
            object_key=object_key,
            rows_parsed=rows_parsed,
            rows_skipped=rows_skipped,
            warnings=warnings,
        )
        db.add(record)

        reports.append(
            FileIngestReport(
                file_id=record.id,
                ticker=ticker,
                strategy=strategy,
                export_date=record.export_date,
                rows_parsed=rows_parsed,
                rows_skipped=rows_skipped,
                warnings=warnings,
            )
        )

    db.flush()

    return batch, reports
