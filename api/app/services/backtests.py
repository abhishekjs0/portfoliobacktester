from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from typing import Dict
from uuid import uuid4


@dataclass
class BacktestJob:
    id: str
    strategy: str
    symbols: list[str]
    start_date: date
    end_date: date
    status: str = "queued"


class BacktestService:
    def __init__(self) -> None:
        self._jobs: Dict[str, BacktestJob] = {}

    def create(self, *, strategy: str, symbols: list[str], start_date: date, end_date: date) -> BacktestJob:
        job = BacktestJob(id=str(uuid4()), strategy=strategy, symbols=symbols, start_date=start_date, end_date=end_date)
        self._jobs[job.id] = job
        return job

    def get(self, job_id: str) -> BacktestJob | None:
        return self._jobs.get(job_id)

    def clear(self) -> None:
        self._jobs.clear()
