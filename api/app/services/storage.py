from __future__ import annotations

from typing import BinaryIO, Optional

import boto3
from botocore.client import Config
from botocore.exceptions import BotoCoreError, ClientError, ParamValidationError

from ..core.config import settings


class StorageError(RuntimeError):
    """Raised when the object storage backend rejects a request."""


def _humanize_storage_error(exc: Exception) -> str:
    message = str(exc)
    if isinstance(exc, ParamValidationError) and "bucket" in message.lower():
        return (
            "Invalid bucket name. Bucket identifiers must use lowercase letters, numbers, dots, or hyphens."
        )
    if isinstance(exc, ClientError):
        code = exc.response.get("Error", {}).get("Code") if hasattr(exc, "response") else None
        if code == "NoSuchBucket":
            return "Configured S3 bucket does not exist and automatic creation failed."
        if code in {"InvalidAccessKeyId", "SignatureDoesNotMatch"}:
            return "S3 credentials were rejected. Verify access key, secret, and region."
    return f"Object storage error: {message}"


class StorageService:
    def __init__(self, client: Optional[object] = None, bucket: Optional[str] = None) -> None:
        self._client = client or boto3.client(
            "s3",
            endpoint_url=settings.s3_endpoint_url,
            aws_access_key_id=settings.s3_access_key,
            aws_secret_access_key=settings.s3_secret_key,
            config=Config(signature_version="s3v4"),
        )
        self._bucket = bucket or settings.s3_bucket

    def ensure_bucket(self) -> None:
        try:
            existing = self._client.list_buckets().get("Buckets", [])
            if not any(b["Name"] == self._bucket for b in existing):
                self._client.create_bucket(Bucket=self._bucket)
        except (BotoCoreError, ClientError, ParamValidationError) as exc:
            raise StorageError(_humanize_storage_error(exc)) from exc

    def put_object(self, key: str, fileobj: BinaryIO, content_type: str = "text/csv") -> None:
        try:
            self._client.put_object(Bucket=self._bucket, Key=key, Body=fileobj, ContentType=content_type)
        except (BotoCoreError, ClientError, ParamValidationError) as exc:
            raise StorageError(_humanize_storage_error(exc)) from exc

    def get_object(self, key: str) -> bytes:
        try:
            response = self._client.get_object(Bucket=self._bucket, Key=key)
            return response["Body"].read()
        except (BotoCoreError, ClientError, ParamValidationError) as exc:
            raise StorageError(_humanize_storage_error(exc)) from exc


storage_service = StorageService()
