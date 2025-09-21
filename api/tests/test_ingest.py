from __future__ import annotations

import pandas as pd

from app.services import ingest


def test_normalize_columns_tradingview_export_headers() -> None:
    df = pd.DataFrame(
        columns=[
            "Trade #",
            "Type",
            "Date/Time",
            "Signal",
            "Price INR",
            "Position size (qty)",
            "Position size (value)",
            "Net P&L INR",
            "Net P&L %",
            "Run-up INR",
            "Run-up %",
            "Drawdown INR",
            "Drawdown %",
            "Cumulative P&L INR",
            "Cumulative P&L %",
        ]
    )

    normalized = ingest.normalize_columns(df)

    for column in ingest.REQUIRED_COLUMNS:
        assert column in normalized.columns
