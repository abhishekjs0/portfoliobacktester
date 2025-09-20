from fastapi import APIRouter, Depends, Request, status

from ..core.ratelimit import limiter
from ..deps import get_feedback_service
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
