from __future__ import annotations

import pytest
from botocore.exceptions import ParamValidationError

from app.services.storage import StorageError, StorageService


class DummyClient:
    def __init__(self, *, ensure_error: Exception | None = None, put_error: Exception | None = None):
        self.ensure_error = ensure_error
        self.put_error = put_error
        self.objects: dict[str, bytes] = {}

    def list_buckets(self):
        return {"Buckets": []}

    def create_bucket(self, Bucket: str):
        if self.ensure_error:
            raise self.ensure_error

    def put_object(self, Bucket: str, Key: str, Body, ContentType: str = "text/csv"):
        if self.put_error:
            raise self.put_error
        self.objects[Key] = Body.read() if hasattr(Body, "read") else Body

    def get_object(self, Bucket: str, Key: str):
        if Key not in self.objects:
            raise KeyError(Key)
        return {"Body": DummyBody(self.objects[Key])}


class DummyBody:
    def __init__(self, payload: bytes):
        self.payload = payload

    def read(self):
        return self.payload


def test_storage_raises_friendly_message_for_invalid_bucket():
    error = ParamValidationError(
        report='Parameter validation failed:\nInvalid bucket name "Bad Bucket": The string did not match the expected pattern.'
    )
    service = StorageService(client=DummyClient(ensure_error=error), bucket="Bad Bucket")

    with pytest.raises(StorageError) as excinfo:
        service.ensure_bucket()

    assert "bucket name" in str(excinfo.value).lower()


def test_storage_error_surface_from_put_object():
    error = ParamValidationError(report="The string did not match the expected pattern.")
    service = StorageService(client=DummyClient(put_error=error), bucket="valid-bucket")

    with pytest.raises(StorageError) as excinfo:
        service.put_object("key.csv", DummyBody(b"data"))

    message = str(excinfo.value)
    assert message.startswith("Object storage error:")
    assert "expected pattern" in message
