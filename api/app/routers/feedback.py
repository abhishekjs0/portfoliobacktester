from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from .. import deps
from ..core.ratelimit import limiter
from ..deps import get_feedback_service
from ..models import schemas, tables
from ..models.schemas import FeedbackIn, FeedbackResponse
from ..services.feedback import FeedbackService

router = APIRouter()

@router.post("", response_model=FeedbackResponse, status_code=status.HTTP_200_OK)
@limiter.limit("30/hour")
def submit_feedback(
    payload: FeedbackIn,
    request: Request,
    service: FeedbackService = Depends(get_feedback_service),
) -> FeedbackResponse:
    service.submit(message=payload.message, rating=payload.rating)
    return FeedbackResponse(detail="Feedback received")

@router.post("/nps", status_code=status.HTTP_204_NO_CONTENT)
def submit_nps(
    payload: schemas.NpsRequest,
    user: tables.User = Depends(deps.get_current_user),
    db_session: Session = Depends(deps.get_db_session),
) -> None:
    entry = tables.FeedbackEntry(
        user_id=user.id,
        email=user.email,
        message=payload.comment or "",
        score=payload.score,
    )
    db_session.add(entry)
    db_session.commit()
