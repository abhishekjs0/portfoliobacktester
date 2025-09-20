import re

from fastapi import APIRouter, Depends, HTTPException, Request, status

from ..core.ratelimit import limiter
from ..deps import get_user_service
from ..models.schemas import UserCreate, UserOut
from ..services.auth import EmailAlreadyRegisteredError, UserService

router = APIRouter()

PASSWORD_REGEX = re.compile(r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$")


@router.post("", response_model=UserOut, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/hour")
def register_user(
    payload: UserCreate,
    request: Request,
    service: UserService = Depends(get_user_service),
) -> UserOut:
    if not PASSWORD_REGEX.match(payload.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must include uppercase, lowercase, number, and special character",
        )
    try:
        record = service.register(email=payload.email, password=payload.password, name=payload.name)
    except EmailAlreadyRegisteredError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered") from None
    return UserOut(id=record.id, email=record.email, name=record.name)
