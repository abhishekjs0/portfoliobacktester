from datetime import datetime, timezone

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from .. import deps
from ..models import schemas, tables

router = APIRouter()


@router.post("/events", status_code=status.HTTP_204_NO_CONTENT)
def record_event(
    payload: schemas.AnalyticsEventRequest,
    user: tables.User = Depends(deps.get_current_user),
    db_session: Session = Depends(deps.get_db_session),
) -> None:
    timestamp = payload.timestamp or datetime.now(tz=timezone.utc)
    event = tables.AnalyticsEvent(
        user_id=user.id,
        event=payload.event,
        payload=payload.payload,
        created_at=timestamp,
    )
    db_session.add(event)
    db_session.commit()
