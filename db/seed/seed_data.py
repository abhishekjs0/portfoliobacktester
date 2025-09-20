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

    # Seed normalized SaaS schema with demo data
    plan = tables.Plan(name="Pro", price_cents=19900, features={"seats": 1, "storage": "10GB"})
    saas_user = tables.SaaSUser(
        plan=plan,
        name="Demo Researcher",
        email="researcher@example.com",
        password_hash="demo-hash",
    )
    strategy = tables.Strategy(
        user=saas_user,
        name="Momentum Blend",
        code="// trading strategy placeholder",
        description="Baseline momentum system for onboarding demos.",
    )
    upload = tables.Upload(
        user=saas_user,
        filename="demo.csv",
        s3_key="demo/demo.csv",
    )
    backtest = tables.Backtest(
        user=saas_user,
        strategy=strategy,
        upload=upload,
        result_json={"note": "seeded backtest"},
    )
    lead = tables.Lead(user=saas_user, name="Prospect", email="lead@example.com", message="Tell me more")
    feedback = tables.Feedback(user=saas_user, message="Great onboarding!", rating=5)
    session.add_all([plan, saas_user, strategy, upload, backtest, lead, feedback])
    session.commit()
    session.close()


if __name__ == "__main__":
    seed()
