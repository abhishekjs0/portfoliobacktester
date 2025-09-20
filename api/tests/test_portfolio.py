from __future__ import annotations

import io
from datetime import datetime
from pathlib import Path
import sys

import pandas as pd
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from api.app.models.base import Base
from api.app.models import tables
from api.app.services import portfolio
from api.app.services.portfolio import NormalizedTrade, _annualized_metrics
from api.app.models.schemas import PortfolioRunRequest


@pytest.fixture()
def in_memory_session(monkeypatch) -> Session:
    engine = create_engine("sqlite+pysqlite:///:memory:", future=True)
    Base.metadata.create_all(engine)
    session = Session(engine)

    storage = {}

    def fake_put(key: str, fileobj: io.BytesIO, content_type: str = "text/csv") -> None:
        storage[key] = fileobj.read()

    def fake_get(key: str) -> bytes:
        return storage[key]

    monkeypatch.setattr(portfolio.storage_service, "put_object", fake_put)
    monkeypatch.setattr(portfolio.storage_service, "get_object", fake_get)
    monkeypatch.setattr(portfolio.storage_service, "ensure_bucket", lambda: None)

    yield session
    session.close()


def create_csv(trades: list[dict[str, object]]) -> bytes:
    df = pd.DataFrame(trades)
    return df.to_csv(index=False).encode()


def seed_batch(session: Session, ticker: str, key: str, csv_bytes: bytes) -> tables.UploadFileRecord:
    batch = session.query(tables.Batch).first()
    if not batch:
        batch = tables.Batch(id="batch-1", user_id="user-1", strategy_name="Demo")
        user = tables.User(id="user-1", plan="pro")
        session.add_all([user, batch])
        session.commit()
    record = tables.UploadFileRecord(
        id=f"file-{ticker}",
        batch_id=batch.id,
        ticker=ticker,
        strategy="Demo",
        export_date=datetime(2024, 1, 1).date(),
        filename=f"Demo_{ticker}_2024-01-01.csv",
        object_key=key,
        rows_parsed=0,
        rows_skipped=0,
        warnings=[],
    )
    session.add(record)
    session.commit()
    portfolio.storage_service.put_object(key, io.BytesIO(csv_bytes))
    return record


def test_equal_capital_aggregation(in_memory_session: Session) -> None:
    csv_a = create_csv([
        {
            "Trade #": 1,
            "Type (Long/Short)": "Long",
            "Date/Time": "2024-01-02 09:30",
            "Signal": "Entry",
            "Price": 100,
            "Position size": 10000,
            "Net P&L": 500,
            "Run-up": 600,
            "Drawdown": -200,
            "Cumulative P&L": 500,
        },
        {
            "Trade #": 1,
            "Type (Long/Short)": "Long",
            "Date/Time": "2024-01-05 09:30",
            "Signal": "Exit",
            "Price": 105,
            "Position size": 10000,
            "Net P&L": 500,
            "Run-up": 600,
            "Drawdown": -200,
            "Cumulative P&L": 500,
        },
    ])
    csv_b = create_csv([
        {
            "Trade #": 1,
            "Type (Long/Short)": "Long",
            "Date/Time": "2024-01-03 09:30",
            "Signal": "Entry",
            "Price": 50,
            "Position size": 5000,
            "Net P&L": -250,
            "Run-up": 200,
            "Drawdown": -300,
            "Cumulative P&L": -250,
        },
        {
            "Trade #": 1,
            "Type (Long/Short)": "Long",
            "Date/Time": "2024-01-04 09:30",
            "Signal": "Exit",
            "Price": 49,
            "Position size": 5000,
            "Net P&L": -250,
            "Run-up": 200,
            "Drawdown": -300,
            "Cumulative P&L": -250,
        },
    ])

    seed_batch(in_memory_session, "TICK1", "key-a", csv_a)
    seed_batch(in_memory_session, "TICK2", "key-b", csv_b)

    request = PortfolioRunRequest(batchId="batch-1", totalCapital=100_000, currency="USD", dateRange=None)
    response = portfolio.run_portfolio(in_memory_session, tables.User(id="user-1"), request)

    assert response.equityCurve[-1].value == pytest.approx(100_000, rel=1e-3)
    assert len(response.tradesTable) == 4


def test_annualized_matches_hand_calc() -> None:
    trades = [
        NormalizedTrade(
            ticker="A",
            trade_number=1,
            entry_time=datetime(2024, 1, 1),
            exit_time=datetime(2024, 1, 11),
            net_pnl=100,
            position_size=1000,
            trade_return_pct=0.1,
            runup=0,
            drawdown=0,
            direction="Long",
        ),
        NormalizedTrade(
            ticker="A",
            trade_number=2,
            entry_time=datetime(2024, 1, 12),
            exit_time=datetime(2024, 1, 22),
            net_pnl=50,
            position_size=1000,
            trade_return_pct=0.05,
            runup=0,
            drawdown=0,
            direction="Long",
        ),
    ]
    metrics = _annualized_metrics(trades)
    avg_days = (10 + 10) / 2
    trades_per_year = 365 / avg_days
    avg_return = (0.1 + 0.05) / 2
    expected = (1 + avg_return) ** trades_per_year - 1
    assert metrics["annualized_return_pct"] == pytest.approx(expected * 100)


def test_date_filter_limits_trades(in_memory_session: Session) -> None:
    csv = create_csv([
        {
            "Trade #": 1,
            "Type (Long/Short)": "Long",
            "Date/Time": "2024-01-02 09:30",
            "Signal": "Entry",
            "Price": 100,
            "Position size": 10000,
            "Net P&L": 200,
            "Run-up": 250,
            "Drawdown": -100,
            "Cumulative P&L": 200,
        },
        {
            "Trade #": 1,
            "Type (Long/Short)": "Long",
            "Date/Time": "2024-01-05 09:30",
            "Signal": "Exit",
            "Price": 102,
            "Position size": 10000,
            "Net P&L": 200,
            "Run-up": 250,
            "Drawdown": -100,
            "Cumulative P&L": 200,
        },
        {
            "Trade #": 2,
            "Type (Long/Short)": "Long",
            "Date/Time": "2024-02-01 09:30",
            "Signal": "Entry",
            "Price": 110,
            "Position size": 10000,
            "Net P&L": -300,
            "Run-up": 100,
            "Drawdown": -350,
            "Cumulative P&L": -100,
        },
        {
            "Trade #": 2,
            "Type (Long/Short)": "Long",
            "Date/Time": "2024-02-10 09:30",
            "Signal": "Exit",
            "Price": 107,
            "Position size": 10000,
            "Net P&L": -300,
            "Run-up": 100,
            "Drawdown": -350,
            "Cumulative P&L": -100,
        },
    ])

    seed_batch(in_memory_session, "FILTER", "key-filter", csv)

    request = PortfolioRunRequest(
        batchId="batch-1",
        totalCapital=50_000,
        currency="USD",
        dateRange=(datetime(2024, 1, 1), datetime(2024, 1, 31)),
    )
    response = portfolio.run_portfolio(in_memory_session, tables.User(id="user-1"), request)
    assert len(response.tradesTable) == 2
    assert response.kpis["total_trades"] == 1
