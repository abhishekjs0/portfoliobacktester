from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlalchemy.orm import Session

from .. import deps
from ..models import tables
from ..models.schemas import PortfolioRunPersisted, PortfolioRunRequest, PortfolioRunResponse
from ..services.portfolio import run_portfolio

router = APIRouter()


@router.post("/run", response_model=PortfolioRunResponse)
async def run_portfolio_endpoint(
    payload: PortfolioRunRequest,
    db_session: Session = Depends(deps.get_db_session),
    user=Depends(deps.get_current_user),
):
    deps.track_run(user, db_session)
    try:
        response = run_portfolio(db_session, user, payload)
        db_session.commit()
    except ValueError as exc:
        db_session.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    return response


@router.get("/{batch_id}", response_model=list[PortfolioRunPersisted])
async def get_portfolio_runs(
    batch_id: str = Path(..., description="Batch identifier"),
    db_session: Session = Depends(deps.get_db_session),
    user=Depends(deps.get_current_user),
):
    batch = db_session.get(tables.Batch, batch_id)
    if not batch or batch.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Batch not found")

    runs = (
        db_session.query(tables.PortfolioRun)
        .filter(tables.PortfolioRun.batch_id == batch_id)
        .order_by(tables.PortfolioRun.created_at.desc())
        .all()
    )
    responses: list[PortfolioRunPersisted] = []
    for run in runs:
        metrics = run.metrics
        if isinstance(metrics, str):
            raise HTTPException(status_code=500, detail="Stored metrics malformed")
        validated = PortfolioRunPersisted(
            runId=run.id,
            batchId=run.batch_id,
            currency=run.currency,
            totalCapital=run.total_capital,
            dateRange=(run.date_start, run.date_end),
            createdAt=run.created_at,
            **metrics,
        )
        responses.append(validated)
    return responses
