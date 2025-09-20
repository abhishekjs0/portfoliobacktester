from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Optional

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@dataclass
class UserRecord:
    id: int
    email: str
    name: Optional[str]
    password_hash: str


class EmailAlreadyRegisteredError(Exception):
    """Raised when attempting to register an email that already exists."""


class InvalidCredentialsError(Exception):
    """Raised when supplied credentials do not match a stored user."""


class UserService:
    def __init__(self) -> None:
        self._users: Dict[str, UserRecord] = {}
        self._id_counter = 1

    def _normalize_email(self, email: str) -> str:
        return email.strip().lower()

    def register(self, *, email: str, password: str, name: Optional[str]) -> UserRecord:
        key = self._normalize_email(email)
        if key in self._users:
            raise EmailAlreadyRegisteredError(email)
        hashed = pwd_context.hash(password)
        record = UserRecord(id=self._id_counter, email=email, name=name, password_hash=hashed)
        self._users[key] = record
        self._id_counter += 1
        return record

    def authenticate(self, *, email: str, password: str) -> UserRecord:
        key = self._normalize_email(email)
        record = self._users.get(key)
        if not record or not pwd_context.verify(password, record.password_hash):
            raise InvalidCredentialsError()
        return record

    def get_by_email(self, email: str) -> Optional[UserRecord]:
        return self._users.get(self._normalize_email(email))

    def seed_user(self, *, email: str, password: str, name: Optional[str]) -> None:
        key = self._normalize_email(email)
        if key in self._users:
            return
        hashed = pwd_context.hash(password)
        self._users[key] = UserRecord(id=self._id_counter, email=email, name=name, password_hash=hashed)
        self._id_counter += 1

    def clear(self) -> None:
        self._users.clear()
        self._id_counter = 1
