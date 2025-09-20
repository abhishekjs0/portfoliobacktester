import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from api.app.core.ratelimit import limiter
from api.app.deps import get_backtest_service, get_feedback_service, get_user_service
from api.app.main import app


@pytest.fixture()
def client() -> TestClient:
    user_service = get_user_service()
    user_service.clear()
    user_service.seed_user(email="user@example.com", password="CorrectPassword123!", name="Demo User")
    get_backtest_service().clear()
    get_feedback_service().clear()
    limiter.reset()
    with TestClient(app) as test_client:
        yield test_client


def test_register_user_success(client: TestClient) -> None:
    response = client.post(
        "/api/users",
        json={"email": "new@example.com", "password": "ValidPass123!", "name": "New User"},
    )
    assert response.status_code == 201
    payload = response.json()
    assert payload["email"] == "new@example.com"
    assert payload["id"] > 0


def test_register_user_duplicate_email(client: TestClient) -> None:
    client.post(
        "/api/users",
        json={"email": "dupe@example.com", "password": "ValidPass123!", "name": "First"},
    )
    response = client.post(
        "/api/users",
        json={"email": "dupe@example.com", "password": "ValidPass123!", "name": "Second"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_login_success(client: TestClient) -> None:
    client.post(
        "/api/users",
        json={"email": "login@example.com", "password": "ValidPass123!", "name": "Login"},
    )
    response = client.post(
        "/api/sessions",
        json={"email": "login@example.com", "password": "ValidPass123!"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["token_type"] == "bearer"
    assert "access_token" in payload


def test_login_invalid_credentials(client: TestClient) -> None:
    response = client.post(
        "/api/sessions",
        json={"email": "user@example.com", "password": "WrongPass!"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_backtest_creation_returns_id(client: TestClient) -> None:
    response = client.post(
        "/api/backtests",
        json={
            "strategy": "Momentum",
            "symbols": ["AAPL", "MSFT"],
            "start_date": "2024-01-01",
            "end_date": "2024-02-01",
            "parameters": {"lookback": 14},
        },
    )
    assert response.status_code == 202
    payload = response.json()
    assert payload["status"] == "queued"
    assert payload["strategy"] == "Momentum"
    assert isinstance(payload["backtest_id"], str)


def test_feedback_requires_message(client: TestClient) -> None:
    response = client.post("/api/feedback", json={"message": "Great product!", "rating": 5})
    assert response.status_code == 200
    assert response.json()["detail"] == "Feedback received"

    bad_response = client.post("/api/feedback", json={"message": ""})
    assert bad_response.status_code == 422


def test_user_registration_rate_limit(client: TestClient) -> None:
    for index in range(5):
        res = client.post(
            "/api/users",
            json={"email": f"rate{index}@example.com", "password": "ValidPass123!", "name": "Rate"},
        )
        assert res.status_code == 201
    blocked = client.post(
        "/api/users",
        json={"email": "rate-limit@example.com", "password": "ValidPass123!", "name": "Rate"},
    )
    assert blocked.status_code == 429
