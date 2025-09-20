import json
import uuid
from datetime import datetime

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from api.app.models import tables
from api.app.models.base import Base


def seed(database_url: str = "postgresql+psycopg://portfolio:portfolio@localhost:5432/portfolio") -> None:
    engine = create_engine(database_url, future=True)
    Base.metadata.create_all(engine)
    session = Session(engine)

    user = tables.User(id="demo-user", email="demo@example.com", plan="pro")
    batch = tables.Batch(id=str(uuid.uuid4()), user_id=user.id, strategy_name="Demo Strategy")
    session.add_all([user, batch])
    session.commit()

    run = tables.PortfolioRun(
        id=str(uuid.uuid4()),
        batch_id=batch.id,
        currency="USD",
        total_capital=100_000,
        date_start=datetime(2024, 1, 1),
        date_end=datetime(2024, 12, 31),
        metrics={
            "equityCurve": [],
            "buyHoldCurve": [],
            "drawdown": [],
            "kpis": {},
            "sections": {},
            "tradesTable": [],
        },
        equity_curve=[],
    )
    session.add(run)
    session.commit()
    session.close()


if __name__ == "__main__":
    seed()
