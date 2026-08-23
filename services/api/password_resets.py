"""
Tokens de un solo uso para `/auth/forgot-password` y `/auth/reset-password`.

Se guarda el hash SHA-256 del token (nunca el valor en claro) junto con su
expiración y si ya fue consumido, para que no pueda reutilizarse.
"""

from __future__ import annotations

import hashlib
import os
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path

from dotenv import load_dotenv
from tinydb import Query, TinyDB

load_dotenv()

TOKEN_EXPIRE_MINUTES = int(os.environ.get("PASSWORD_RESET_TOKEN_EXPIRE_MINUTES", "30"))

DB_PATH = Path(__file__).resolve().parent / "data" / "password_resets.json"
TABLE_NAME = "password_resets"


def _get_table() -> tuple[TinyDB, object]:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    db = TinyDB(DB_PATH)
    return db, db.table(TABLE_NAME)


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_reset_token(user_id: str) -> str:
    """Genera un token, persiste su hash y devuelve el valor en claro (va en el email)."""
    token = secrets.token_urlsafe(32)
    now = datetime.now(timezone.utc)

    db, table = _get_table()
    try:
        table.insert(
            {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "token_hash": _hash_token(token),
                "created_at": now.isoformat(),
                "expires_at": (now + timedelta(minutes=TOKEN_EXPIRE_MINUTES)).isoformat(),
                "used": False,
            }
        )
    finally:
        db.close()

    return token


def consume_reset_token(token: str) -> str | None:
    """Valida el token (existe, no expiro, no se uso) y lo marca como usado.

    Devuelve el `user_id` si es valido, o `None` en caso contrario.
    """
    token_hash = _hash_token(token)

    db, table = _get_table()
    try:
        record = table.get(Query().token_hash == token_hash)
        if record is None or record["used"]:
            return None

        expires_at = datetime.fromisoformat(record["expires_at"])
        if datetime.now(timezone.utc) >= expires_at:
            return None

        table.update({"used": True}, Query().token_hash == token_hash)
        return record["user_id"]
    finally:
        db.close()
