from fastapi import APIRouter, Depends, HTTPException, Request, status

from ..core.ratelimit import limiter
from ..deps import get_backtest_service
from ..models.schemas import BacktestRequest, BacktestResult
from ..services.backtests import BacktestService

router = APIRouter()


@router.post("", response_model=BacktestResult, status_code=status.HTTP_202_ACCEPTED)
@limiter.limit("15/minute")
def create_backtest(
    payload: BacktestRequest,
    request: Request,
    service: BacktestService = Depends(get_backtest_service),
) -> BacktestResult:
    if not payload.symbols:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="At least one symbol is required")
    if payload.start_date > payload.end_date:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Start date must be before end date")
    job = service.create(
        strategy=payload.strategy,
        symbols=payload.symbols,
        start_date=payload.start_date,
        end_date=payload.end_date,
    )
    return BacktestResult(backtest_id=job.id, status=job.status, strategy=job.strategy)
