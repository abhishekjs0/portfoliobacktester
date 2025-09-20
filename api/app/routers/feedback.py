from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from .. import deps
from ..models import schemas, tables

router = APIRouter()


@router.post("", status_code=status.HTTP_204_NO_CONTENT)
def submit_feedback(
    payload: schemas.FeedbackRequest,
    user: tables.User = Depends(deps.get_current_user),
    db_session: Session = Depends(deps.get_db_session),
) -> None:
    entry = tables.FeedbackEntry(
        user_id=user.id,
        email=payload.email,
        message=payload.message,
    )
    db_session.add(entry)
    db_session.commit()


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
