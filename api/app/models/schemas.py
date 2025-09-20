from __future__ import annotations

from datetime import date, datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field, ConfigDict


class FileUploadSummary(BaseModel):
    fileId: str = Field(alias="fileId")
    ticker: str
    strategy: str
    exportDate: date
    rows: int
    model_config = ConfigDict(populate_by_name=True)


class UploadResponse(BaseModel):
    batchId: str
    files: list[FileUploadSummary]


class FileIngestReport(BaseModel):
    file_id: str
    ticker: str
    strategy: str
    export_date: date
    rows_parsed: int
    rows_skipped: int
    warnings: list[str] = []


class TradeRow(BaseModel):
    trade_number: int = Field(alias="Trade #")
    trade_type: Literal["Long", "Short"] = Field(alias="Type (Long/Short)")
    timestamp: datetime = Field(alias="Date/Time")
    signal: str = Field(alias="Signal")
    price: float = Field(alias="Price")
    position_size: float = Field(alias="Position size")
    pnl: float = Field(alias="Net P&L")
    runup: float = Field(alias="Run-up")
    drawdown: float = Field(alias="Drawdown")
    cumulative_pnl: float = Field(alias="Cumulative P&L")


class PortfolioRunRequest(BaseModel):
    batchId: str
    totalCapital: float
    currency: str = "USD"
    dateRange: tuple[datetime | None, datetime | None] | None = Field(default=None, description="Optional inclusive date range filter")


class KPISection(BaseModel):
    title: str
    metrics: list[dict[str, str | float | int | None]]


class EquityPoint(BaseModel):
    timestamp: datetime
    value: float


class PortfolioRunResponse(BaseModel):
    equityCurve: list[EquityPoint]
    buyHoldCurve: list[EquityPoint]
    drawdown: list[EquityPoint]
    kpis: dict[str, float | int]
    sections: dict[str, KPISection]
    tradesTable: list[dict[str, str | float | int]]


class PortfolioRunPersisted(PortfolioRunResponse):
    runId: str
    batchId: str
    currency: str
    totalCapital: float
    dateRange: tuple[datetime | None, datetime | None] | None
    createdAt: datetime
