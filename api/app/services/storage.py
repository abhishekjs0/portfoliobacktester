from __future__ import annotations

from pathlib import Path
from typing import BinaryIO

import boto3
from botocore.client import Config

from ..core.config import settings


class StorageService:
    def __init__(self) -> None:
        self._client = boto3.client(
            "s3",
            endpoint_url=settings.s3_endpoint_url,
            aws_access_key_id=settings.s3_access_key,
            aws_secret_access_key=settings.s3_secret_key,
            config=Config(signature_version="s3v4"),
        )
        self._bucket = settings.s3_bucket

    def ensure_bucket(self) -> None:
        existing = self._client.list_buckets().get("Buckets", [])
        if not any(b["Name"] == self._bucket for b in existing):
            self._client.create_bucket(Bucket=self._bucket)

    def put_object(self, key: str, fileobj: BinaryIO, content_type: str = "text/csv") -> None:
        self._client.put_object(Bucket=self._bucket, Key=key, Body=fileobj, ContentType=content_type)

    def get_object(self, key: str) -> bytes:
        response = self._client.get_object(Bucket=self._bucket, Key=key)
        return response["Body"].read()


storage_service = StorageService()
