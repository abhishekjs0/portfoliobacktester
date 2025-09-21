from __future__ import annotations

import os

import pytest

from app.core import config


@pytest.fixture(autouse=True)
def reset_settings(monkeypatch: pytest.MonkeyPatch):
    original_env = dict(os.environ)
    config.reset_settings_cache()
    yield
    os.environ.clear()
    os.environ.update(original_env)
    config.reset_settings_cache()


def test_cors_allow_origins_accepts_comma_string(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("CORS_ALLOW_ORIGINS", "http://foo.com,http://bar.com")

    config.reset_settings_cache()
    settings = config.get_settings()

    assert settings.cors_allow_origins == ("http://foo.com", "http://bar.com")


def test_cors_allow_origins_accepts_json_array(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("CORS_ALLOW_ORIGINS", "[\"http://foo.com\", \"http://bar.com\"]")

    config.reset_settings_cache()
    settings = config.get_settings()

    assert settings.cors_allow_origins == ("http://foo.com", "http://bar.com")
