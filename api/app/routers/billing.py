from __future__ import annotations

from datetime import datetime, timezone

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from .. import deps
from ..core.config import settings
from ..models import schemas, tables

router = APIRouter()


def _get_price_id(plan: str, interval: str) -> str:
    price_map = {
        ("standard", "monthly"): settings.stripe_price_standard_monthly,
        ("standard", "annual"): settings.stripe_price_standard_annual,
        ("pro", "monthly"): settings.stripe_price_pro_monthly,
        ("pro", "annual"): settings.stripe_price_pro_annual,
    }
    try:
        price_id = price_map[(plan, interval)]
    except KeyError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported plan") from exc
    if not price_id:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Stripe price not configured")
    return price_id


def _ensure_stripe_configured() -> None:
    if not settings.stripe_api_key:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Stripe is not configured")
    stripe.api_key = settings.stripe_api_key


@router.post("/checkout-session", response_model=schemas.CheckoutSessionResponse)
def create_checkout_session(
    payload: schemas.CheckoutSessionRequest,
    user: tables.User = Depends(deps.get_current_user),
) -> schemas.CheckoutSessionResponse:
    _ensure_stripe_configured()
    price_id = _get_price_id(payload.plan, payload.interval)
    success_url = f"{settings.cors_allow_origins[0]}/pricing?success=true"
    cancel_url = f"{settings.cors_allow_origins[0]}/pricing?canceled=true"
    session = stripe.checkout.Session.create(
        mode="subscription",
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=success_url,
        cancel_url=cancel_url,
        customer_email=user.email,
        metadata={"user_id": user.id, "plan": payload.plan, "interval": payload.interval},
    )
    return schemas.CheckoutSessionResponse(sessionId=session.id, url=session.url)


def _record_subscription(
    db_session: Session,
    user: tables.User,
    stripe_subscription_id: str,
    plan: str,
    interval: str,
    status_value: str,
    current_period_end: int | None,
) -> None:
    user.plan = plan
    user.subscription_status = status_value
    user.stripe_subscription_id = stripe_subscription_id
    if current_period_end:
        user.subscription_valid_until = datetime.fromtimestamp(current_period_end, tz=timezone.utc)
    db_session.add(user)
    db_session.add(
        tables.Subscription(
            user_id=user.id,
            stripe_subscription_id=stripe_subscription_id,
            plan=plan,
            interval=interval,
            status=status_value,
            current_period_end=
                datetime.fromtimestamp(current_period_end, tz=timezone.utc) if current_period_end else None,
        )
    )
    db_session.commit()


@router.post("/webhook", status_code=204)
async def stripe_webhook(request: Request, db_session: Session = Depends(deps.get_db_session)) -> None:
    _ensure_stripe_configured()
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    if not sig_header:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing stripe signature")
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, settings.stripe_webhook_secret)
    except (ValueError, stripe.error.SignatureVerificationError) as exc:  # type: ignore[attr-defined]
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        metadata = session.get("metadata", {}) or {}
        user_id = metadata.get("user_id")
        plan = metadata.get("plan", "standard")
        interval = metadata.get("interval", "monthly")
        subscription_id = session.get("subscription")
        if user_id and subscription_id:
            user = db_session.get(tables.User, user_id)
            if user:
                user.stripe_customer_id = session.get("customer")
                _record_subscription(
                    db_session,
                    user,
                    stripe_subscription_id=subscription_id,
                    plan=plan,
                    interval=interval,
                    status_value="active",
                    current_period_end=session.get("expires_at"),
                )
    elif event["type"] == "customer.subscription.updated":
        subscription = event["data"]["object"]
        subscription_id = subscription.get("id")
        if subscription_id:
            user = (
                db_session.query(tables.User)
                .filter(tables.User.stripe_subscription_id == subscription_id)
                .first()
            )
            if user:
                metadata = subscription.get("metadata", {}) or {}
                plan = metadata.get("plan", user.plan)
                interval = metadata.get("interval", "monthly")
                status_value = subscription.get("status", "active")
                current_period_end = subscription.get("current_period_end")
                _record_subscription(
                    db_session,
                    user,
                    stripe_subscription_id=subscription_id,
                    plan=plan,
                    interval=interval,
                    status_value=status_value,
                    current_period_end=current_period_end,
                )
    else:
        # Ignore other events for now
        return
