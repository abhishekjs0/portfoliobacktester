from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import List


@dataclass
class FeedbackRecord:
    message: str
    rating: int | None
    received_at: datetime


class FeedbackService:
    def __init__(self) -> None:
        self._records: List[FeedbackRecord] = []

    def submit(self, *, message: str, rating: int | None) -> FeedbackRecord:
        record = FeedbackRecord(message=message, rating=rating, received_at=datetime.utcnow())
        self._records.append(record)
        return record

    def all(self) -> List[FeedbackRecord]:
        return list(self._records)

    def clear(self) -> None:
        self._records.clear()
