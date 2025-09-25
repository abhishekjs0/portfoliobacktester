from __future__ import annotations

import io
import json
import math
import statistics
import uuid
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Iterable, Sequence

import numpy as np
import pandas as pd
from dateutil import parser
from sqlalchemy.orm import Session

from ..core.config import settings
from ..models import tables
from ..models.schemas import PortfolioRunRequest, PortfolioRunResponse
from .storage import storage_service
from .ingest import normalize_columns


@dataclass
class NormalizedTrade:
    ticker: str
    trade_number: int
    entry_time: datetime
    exit_time: datetime
    net_pnl: float
    position_size: float
    trade_return_pct: float
    runup: float
    drawdown: float
    direction: str

    @property
    def duration_days(self) -> float:
        return max((self.exit_time - self.entry_time).total_seconds() / 86_400, 1e-9)


@dataclass
class EquitySeries:
    ticker: str
    equity: pd.Series
    trades: list[NormalizedTrade]


def _read_csv(key: str) -> pd.DataFrame:
    raw = storage_service.get_object(key)
    df = pd.read_csv(io.BytesIO(raw))
    return normalize_columns(df)


def _extract_trades(ticker: str, df: pd.DataFrame) -> list[NormalizedTrade]:
    trades: list[NormalizedTrade] = []
    grouped = df.groupby("Trade #")
    for trade_number, group in grouped:
        group_sorted = group.sort_values("Date/Time")
        entry_row = group_sorted.iloc[0]
        exit_row = group_sorted.iloc[-1]
        entry_time = parser.parse(str(entry_row["Date/Time"]))
        exit_time = parser.parse(str(exit_row["Date/Time"]))
        position_candidates = group_sorted.get("Position size")
        position_size = float(position_candidates.replace(0, np.nan).dropna().iloc[0]) if not position_candidates.replace(0, np.nan).dropna().empty else 0.0
        net_pnl = float(exit_row["Net P&L"])
        runup = float(exit_row.get("Run-up", 0))
        drawdown = float(exit_row.get("Drawdown", 0))
        direction = str(exit_row.get("Type (Long/Short)", "Long"))

        trade_return_pct: float
        if position_size and abs(position_size) > 1e-9:
            trade_return_pct = net_pnl / position_size
        else:
            magnitude = max(abs(runup), abs(drawdown), 1e-6)
            estimated_position = abs(net_pnl) / magnitude
            position_size = estimated_position
            trade_return_pct = net_pnl / position_size if position_size else 0.0

        trades.append(
            NormalizedTrade(
                ticker=ticker,
                trade_number=int(trade_number),
                entry_time=entry_time,
                exit_time=exit_time,
                net_pnl=net_pnl,
                position_size=position_size,
                trade_return_pct=trade_return_pct,
                runup=runup,
                drawdown=drawdown,
                direction=direction,
            )
        )
    trades.sort(key=lambda t: t.exit_time)
    return trades


def _build_equity_series(trades: Sequence[NormalizedTrade], initial_capital: float) -> pd.Series:
    if not trades:
        return pd.Series(dtype=float)

    equity_points: list[tuple[datetime, float]] = []
    capital = initial_capital
    for trade in trades:
        capital *= 1 + trade.trade_return_pct
        equity_points.append((trade.exit_time, capital))

    data = pd.Series({ts: val for ts, val in equity_points}).sort_index()
    start = trades[0].entry_time
    if start not in data.index:
        data.loc[start] = initial_capital
    data = data.sort_index()
    return data


def _align_daily(equity_series: Sequence[EquitySeries]) -> pd.Series:
    if not equity_series:
        return pd.Series(dtype=float)
    frames = []
    for series in equity_series:
        s = series.equity.copy()
        if s.empty:
            continue
        s.index = pd.to_datetime(s.index)
        s = s.resample("B").ffill()
        frames.append(s.rename(series.ticker))
    if not frames:
        return pd.Series(dtype=float)
    combined = pd.concat(frames, axis=1).ffill()
    portfolio = combined.sum(axis=1)
    return portfolio


def _compute_drawdown(series: pd.Series) -> pd.Series:
    rolling_max = series.cummax()
    drawdown = (series - rolling_max) / rolling_max
    return drawdown.fillna(0)


def _buy_hold_curve(portfolio: pd.Series) -> pd.Series:
    if portfolio.empty:
        return portfolio
    returns = portfolio / portfolio.iloc[0]
    return portfolio.iloc[0] * returns


def _summarize_metrics(trades: list[NormalizedTrade], portfolio_curve: pd.Series, currency: str) -> dict[str, float | int]:
    total_trades = len(trades)
    total_pnl = sum(t.net_pnl for t in trades)
    wins = [t for t in trades if t.net_pnl > 0]
    losses = [t for t in trades if t.net_pnl <= 0]
    profitable_pct = (len(wins) / total_trades * 100) if total_trades else 0
    gross_profit = sum(t.net_pnl for t in wins)
    gross_loss = sum(t.net_pnl for t in losses)
    profit_factor = abs(gross_profit / gross_loss) if gross_loss != 0 else float("inf") if gross_profit > 0 else 0
    max_drawdown_abs = float((portfolio_curve - portfolio_curve.cummax()).min())
    max_drawdown_pct = float(((portfolio_curve / portfolio_curve.cummax()) - 1).min()) * 100
    if len(portfolio_curve) > 1 and portfolio_curve.iloc[0] != 0:
        total_return_pct = ((portfolio_curve.iloc[-1] / portfolio_curve.iloc[0]) - 1) * 100
    else:
        total_return_pct = 0

    kpis = {
        "total_pnl": total_pnl,
        "total_return_pct": total_return_pct,
        "max_drawdown_abs": max_drawdown_abs,
        "max_drawdown_pct": max_drawdown_pct,
        "total_trades": total_trades,
        "profitable_trades_pct": profitable_pct,
        "profit_factor": profit_factor,
    }
    return kpis


def _annualized_metrics(trades: Sequence[NormalizedTrade]) -> dict[str, float]:
    if not trades:
        return {"annualized_return_pct": 0.0, "avg_trade_duration_days": 0.0, "total_trade_days": 0.0}
    avg_return = statistics.fmean(t.trade_return_pct for t in trades)
    avg_days = statistics.fmean(t.duration_days for t in trades)
    trades_per_year = 365.0 / avg_days if avg_days else 0
    annualized = (1 + avg_return) ** trades_per_year - 1 if trades_per_year else 0
    total_days = sum(t.duration_days for t in trades)
    return {
        "annualized_return_pct": annualized * 100,
        "avg_trade_duration_days": avg_days,
        "total_trade_days": total_days,
    }


def _build_sections(kpis: dict[str, float | int], trades: list[NormalizedTrade], portfolio_curve: pd.Series) -> dict[str, dict]:
    wins = [t for t in trades if t.net_pnl > 0]
    losses = [t for t in trades if t.net_pnl <= 0]
    avg_win = statistics.fmean(t.net_pnl for t in wins) if wins else 0
    avg_loss = statistics.fmean(t.net_pnl for t in losses) if losses else 0
    avg_win_pct = statistics.fmean(t.trade_return_pct for t in wins) * 100 if wins else 0
    avg_loss_pct = statistics.fmean(t.trade_return_pct for t in losses) * 100 if losses else 0
    ratio = (avg_win / abs(avg_loss)) if avg_loss else float("inf") if avg_win > 0 else 0
    avg_trade_pct = statistics.fmean(t.trade_return_pct for t in trades) * 100 if trades else 0
    avg_trade_abs = statistics.fmean(t.net_pnl for t in trades) if trades else 0
    avg_bars = statistics.fmean(t.duration_days for t in trades) if trades else 0

    overview = {
        "title": "Overview",
        "metrics": [
            {"label": "Total P&L", "value": kpis["total_pnl"]},
            {"label": "Max equity drawdown", "value": kpis["max_drawdown_abs"]},
            {"label": "Total trades", "value": kpis["total_trades"]},
            {"label": "Profitable trades %", "value": kpis["profitable_trades_pct"]},
            {"label": "Profit factor", "value": kpis["profit_factor"]},
        ],
    }

    buy_hold_value = (portfolio_curve.iloc[-1] - portfolio_curve.iloc[0]) if len(portfolio_curve) > 1 else 0
    max_runup = float((portfolio_curve - portfolio_curve.cummin()).max()) if not portfolio_curve.empty else 0
    performance = {
        "title": "Performance",
        "metrics": [
            {"label": "Open P&L", "value": 0},
            {"label": "Net profit", "value": kpis["total_pnl"]},
            {"label": "Gross profit", "value": sum(t.net_pnl for t in wins)},
            {"label": "Gross loss", "value": sum(t.net_pnl for t in losses)},
            {"label": "Commission paid", "value": 0},
            {"label": "Buy & hold return", "value": buy_hold_value},
            {"label": "Max equity run-up", "value": max_runup},
            {"label": "Max equity drawdown", "value": kpis["max_drawdown_abs"]},
            {"label": "Max contracts held", "value": 1},
        ],
    }

    trades_analysis = {
        "title": "Trades analysis",
        "metrics": [
            {"label": "Total trades", "value": kpis["total_trades"]},
            {"label": "Winning trades", "value": len(wins)},
            {"label": "Losing trades", "value": len(losses)},
            {"label": "% Profitable", "value": kpis["profitable_trades_pct"]},
            {"label": "Avg trade", "value": avg_trade_abs},
            {"label": "Avg trade %", "value": avg_trade_pct},
            {"label": "Avg winning trade", "value": avg_win},
            {"label": "Avg losing trade", "value": avg_loss},
            {"label": "Ratio avg win / avg loss", "value": ratio},
            {"label": "Largest win", "value": max((t.net_pnl for t in wins), default=0)},
            {"label": "Largest loss", "value": min((t.net_pnl for t in losses), default=0)},
            {"label": "Largest win %", "value": max((t.trade_return_pct for t in wins), default=0) * 100},
            {"label": "Largest loss %", "value": min((t.trade_return_pct for t in losses), default=0) * 100},
            {"label": "Avg # bars in trades", "value": avg_bars},
            {"label": "Avg # bars winning", "value": statistics.fmean(t.duration_days for t in wins) if wins else 0},
            {"label": "Avg # bars losing", "value": statistics.fmean(t.duration_days for t in losses) if losses else 0},
        ],
    }

    sharpe = _sharpe_ratio(portfolio_curve)
    sortino = _sortino_ratio(portfolio_curve)

    risk_ratios = {
        "title": "Risk/performance ratios",
        "metrics": [
            {"label": "Sharpe ratio", "value": sharpe},
            {"label": "Sortino ratio", "value": sortino},
            {"label": "Profit factor", "value": kpis["profit_factor"]},
            {"label": "Margin calls", "value": 0},
        ],
    }

    return {
        "overview": overview,
        "performance": performance,
        "tradesAnalysis": trades_analysis,
        "riskRatios": risk_ratios,
    }


def _sharpe_ratio(series: pd.Series, risk_free: float = 0.0) -> float:
    if series.empty or len(series) < 2:
        return 0.0
    returns = series.pct_change().replace([np.inf, -np.inf], np.nan).dropna()
    if returns.empty or len(returns) < 2:
        return 0.0
    std = returns.std()
    if np.isnan(std) or std == 0:
        return 0.0
    return (returns.mean() - risk_free / 252) / std * math.sqrt(252)


def _sortino_ratio(series: pd.Series, risk_free: float = 0.0) -> float:
    if series.empty or len(series) < 2:
        return 0.0
    returns = series.pct_change().replace([np.inf, -np.inf], np.nan).dropna()
    downside = returns[returns < 0]
    if downside.empty or len(downside) < 2:
        return 0.0
    downside_std = downside.std()
    if np.isnan(downside_std) or downside_std == 0:
        return 0.0
    return (returns.mean() - risk_free / 252) / downside_std * math.sqrt(252)


def run_portfolio(db: Session, user: tables.User, request: PortfolioRunRequest) -> PortfolioRunResponse:
    batch: tables.Batch | None = db.get(tables.Batch, request.batchId)
    if batch is None:
        raise ValueError("Batch not found")

    records = batch.files
    if not records:
        raise ValueError("Batch has no files")

    total_capital = request.totalCapital or settings.total_capital_default
    per_ticker_capital = total_capital / len(records)

    date_start, date_end = (request.dateRange or (None, None))

    equity_series: list[EquitySeries] = []
    all_trades: list[NormalizedTrade] = []
    trades_table: list[dict[str, str | float | int]] = []

    for record in records:
        df = _read_csv(record.object_key)
        trades = _extract_trades(record.ticker, df)
        if date_start or date_end:
            trades = [
                t
                for t in trades
                if (date_start is None or t.exit_time >= date_start) and (date_end is None or t.exit_time <= date_end)
            ]
        equity = _build_equity_series(trades, per_ticker_capital)
        equity_series.append(EquitySeries(ticker=record.ticker, equity=equity, trades=trades))
        all_trades.extend(trades)

        # rebuild trades table from df to keep original columns but apply filters
        df_filtered = df.copy()
        if date_start or date_end:
            df_filtered = df_filtered[(pd.to_datetime(df_filtered["Date/Time"]) >= (date_start or pd.Timestamp.min)) & (pd.to_datetime(df_filtered["Date/Time"]) <= (date_end or pd.Timestamp.max))]
        trades_table.extend(df_filtered.to_dict(orient="records"))

    portfolio_curve = _align_daily(equity_series)
    drawdown = _compute_drawdown(portfolio_curve)
    buy_hold = _buy_hold_curve(portfolio_curve)

    kpis = _summarize_metrics(all_trades, portfolio_curve, request.currency)
    annualized = _annualized_metrics(all_trades)
    kpis.update({
        "annualized_return_pct": annualized["annualized_return_pct"],
        "avg_trade_duration_days": annualized["avg_trade_duration_days"],
        "total_trade_days": annualized["total_trade_days"],
    })

    sections = _build_sections(kpis, all_trades, portfolio_curve)
    sections["overview"]["metrics"].append({"label": "Annualized P&L %", "value": annualized["annualized_return_pct"]})

    response = PortfolioRunResponse(
        equityCurve=[{"timestamp": ts.to_pydatetime(), "value": float(val)} for ts, val in portfolio_curve.items()],
        buyHoldCurve=[{"timestamp": ts.to_pydatetime(), "value": float(val)} for ts, val in buy_hold.items()],
        drawdown=[{"timestamp": ts.to_pydatetime(), "value": float(val)} for ts, val in drawdown.items()],
        kpis=kpis,
        sections=sections,
        tradesTable=trades_table,
    )

    run = tables.PortfolioRun(
        id=str(uuid.uuid4()),
        batch_id=batch.id,
        currency=request.currency,
        total_capital=total_capital,
        date_start=date_start,
        date_end=date_end,
        metrics=json.loads(response.model_dump_json()),
        equity_curve=[{"timestamp": r.timestamp.isoformat(), "value": r.value} for r in response.equityCurve],
    )
    db.add(run)
    db.flush()

    return response
