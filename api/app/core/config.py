from __future__ import annotations

import json
from functools import lru_cache
from typing import Sequence

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic_settings.sources import PydanticBaseSettingsSource


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="allow",
    )

    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_log_level: str = "info"

    database_url: str = "postgresql://portfolio:portfolio@postgres:5432/portfolio"

    s3_endpoint_url: str = "http://minio:9000"
    s3_access_key: str = "minioadmin"
    s3_secret_key: str = "minioadmin"
    s3_bucket: str = "portfolio-uploads"

    cors_allow_origins: Sequence[str] | str = (
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    )

    total_capital_default: float = 100_000

    free_max_files: int = 5
    pro_max_files: int = 25
    enterprise_max_files: int = 100
    free_runs_per_day: int = 1
    pro_runs_per_day: int = 20
    enterprise_runs_per_day: int = 1000

    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls: type[BaseSettings],
        init_settings: PydanticBaseSettingsSource,
        env_settings: PydanticBaseSettingsSource,
        dotenv_settings: PydanticBaseSettingsSource,
        file_secret_settings: PydanticBaseSettingsSource,
    ) -> tuple[PydanticBaseSettingsSource, ...]:
        class PermissiveEnvSettingsSource(env_settings.__class__):
            def decode_complex_value(self, field_name, field, value):  # type: ignore[override]
                try:
                    return super().decode_complex_value(field_name, field, value)
                except json.JSONDecodeError:
                    return value

        class PermissiveDotEnvSettingsSource(dotenv_settings.__class__):
            def decode_complex_value(self, field_name, field, value):  # type: ignore[override]
                try:
                    return super().decode_complex_value(field_name, field, value)
                except json.JSONDecodeError:
                    return value

        return (
            init_settings,
            PermissiveEnvSettingsSource(settings_cls),
            PermissiveDotEnvSettingsSource(settings_cls),
            file_secret_settings,
        )
    stripe_api_key: str = ""
    stripe_webhook_secret: str = ""
    stripe_price_standard_monthly: str = "price_standard_monthly"
    stripe_price_standard_annual: str = "price_standard_annual"
    stripe_price_pro_monthly: str = "price_pro_monthly"
    stripe_price_pro_annual: str = "price_pro_annual"
    @property
    def sqlalchemy_database_url(self) -> str:
        """Return a SQLAlchemy-compatible DSN, coercing the driver if needed."""

        if self.database_url.startswith("postgresql+psycopg"):
            return self.database_url
        if self.database_url.startswith("postgresql://"):
            return self.database_url.replace("postgresql://", "postgresql+psycopg://", 1)
        return self.database_url

    @field_validator("cors_allow_origins", mode="before")
    @classmethod
    def _split_origins(cls, value: Sequence[str] | str) -> Sequence[str]:
        if isinstance(value, str):
            return tuple(origin.strip() for origin in value.split(",") if origin.strip())
        if isinstance(value, Sequence):
            return tuple(value)
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[arg-type]


def reset_settings_cache() -> None:
    get_settings.cache_clear()  # type: ignore[attr-defined]
    global settings
    settings = get_settings()


settings = get_settings()
