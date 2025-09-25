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


## Map column aliases to their canonical headers.
COLUMN_ALIASES: dict[str, str] = {
    "Type": "Type (Long/Short)",
    "Trade type": "Type (Long/Short)",
    "Direction": "Type (Long/Short)",
    "Side": "Type (Long/Short)",
    "Price INR": "Price",
    "Price USD": "Price",
    "Price (INR)": "Price",
    "Price (USD)": "Price",
    "Entry price": "Price",
    "Exit price": "Price",
    "Position size (qty)": "Position size",
    "Position size (value)": "Position size",
    "Position size value": "Position size",
    "Position size quantity": "Position size",
    "Net P&L INR": "Net P&L",
    "Net P&L USD": "Net P&L",
    "Net profit": "Net P&L",
    "Profit": "Net P&L",
    "Run-up INR": "Run-up",
    "Run-up USD": "Run-up",
    "Runup": "Run-up",
    "Max run-up": "Run-up",
    "Maximum Run-up": "Run-up",
    "Drawdown INR": "Drawdown",
    "Drawdown USD": "Drawdown",
    "Draw down": "Drawdown",
    "Max drawdown": "Drawdown",
    "Maximum Drawdown": "Drawdown",
    "Cumulative P&L INR": "Cumulative P&L",
    "Cumulative P&L USD": "Cumulative P&L",
    "Cumulative profit": "Cumulative P&L",
    "Cumulative Profit": "Cumulative P&L",
}


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Rename known column aliases to their canonical headers."""

    stripped = {column: column.strip() for column in df.columns}
    if any(original != trimmed for original, trimmed in stripped.items()):
        df = df.rename(columns=stripped)

    rename_map: dict[str, str] = {}

    qty_col = "Position size (qty)"
    value_col = "Position size (value)"
    canonical_col = "Position size"
    if qty_col in df.columns and value_col in df.columns:
        df = df.drop(columns=[qty_col])
        if canonical_col not in df.columns:
            rename_map[value_col] = canonical_col

    for alias, canonical in COLUMN_ALIASES.items():
        if alias in df.columns and canonical not in df.columns:
            rename_map[alias] = canonical

    if rename_map:
        df = df.rename(columns=rename_map)

    return df


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
