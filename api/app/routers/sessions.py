import secrets

from fastapi import APIRouter, Depends, HTTPException, Request, status

from ..core.ratelimit import limiter
from ..deps import get_user_service
from ..models.schemas import LoginRequest, SessionOut
from ..services.auth import InvalidCredentialsError, UserService

router = APIRouter()


@router.post("", response_model=SessionOut)
@limiter.limit("10/minute")
def login(
    payload: LoginRequest,
    request: Request,
    service: UserService = Depends(get_user_service),
) -> SessionOut:
    try:
        service.authenticate(email=payload.email, password=payload.password)
    except InvalidCredentialsError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password") from None
    token = secrets.token_urlsafe(32)
    return SessionOut(access_token=token)
