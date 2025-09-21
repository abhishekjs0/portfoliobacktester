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
from .storage import StorageError, storage_service

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


## Map canonical headers to acceptable aliases ordered by preference.
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
=======
COLUMN_ALIASES = {
    "Type": "Type (Long/Short)",
    "Side": "Type (Long/Short)",
    "Price INR": "Price",
    "Price USD": "Price",
    "Price (INR)": "Price",
    "Price (USD)": "Price",
    "Position size (qty)": "Position size",
    "Position size (value)": "Position size",
    "Net P&L INR": "Net P&L",
    "Net P&L USD": "Net P&L",
    "Net Profit": "Net P&L",
    "Run-up INR": "Run-up",
    "Run-up USD": "Run-up",
    "Maximum Run-up": "Run-up",
    "Drawdown INR": "Drawdown",
    "Drawdown USD": "Drawdown",
    "Maximum Drawdown": "Drawdown",
    "Cumulative P&L INR": "Cumulative P&L",
    "Cumulative P&L USD": "Cumulative P&L",
    "Cumulative Profit": "Cumulative P&L",
>>>>>>> origin/main
}


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
<<<<<<< HEAD
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
=======
    """Rename known TradingView header variants to the canonical schema."""

    stripped = {col: col.strip() for col in df.columns}
    if any(original != trimmed for original, trimmed in stripped.items()):
        df = df.rename(columns=stripped)

    # Special handling for Position size columns
    qty_col = "Position size (qty)"
    value_col = "Position size (value)"
    canonical_col = "Position size"
    if qty_col in df.columns and value_col in df.columns:
        # Prefer value_col, drop qty_col
        df = df.drop(columns=[qty_col])
        if canonical_col not in df.columns:
            df = df.rename(columns={value_col: canonical_col})
    else:
        rename_map: dict[str, str] = {}
        for alias, canonical in COLUMN_ALIASES.items():
            if alias in df.columns and canonical not in df.columns:
                rename_map[alias] = canonical
        if rename_map:
            df = df.rename(columns=rename_map)

    return df
>>>>>>> origin/main


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

    try:
        storage_service.ensure_bucket()
    except StorageError as exc:
        raise ValueError(str(exc)) from exc

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
        try:
            storage_service.put_object(object_key, io.BytesIO(file_bytes))
        except StorageError as exc:
            raise ValueError(str(exc)) from exc

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
