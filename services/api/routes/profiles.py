"""
Router: /profiles

Datos de perfil (nombre, teléfono, dirección), vinculados 1-a-1 a un `User`
mediante `user_id`. Todas las rutas requieren un token válido y solo el
dueño del perfil puede leerlo/modificarlo.
"""

from __future__ import annotations

import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from tinydb import Query, TinyDB

from models import ProfileRead, ProfileUpdate, User
from security import get_current_user

DB_PATH = Path(__file__).resolve().parent.parent / "data" / "profiles.json"
TABLE_NAME = "profiles"

router = APIRouter(prefix="/profiles", tags=["profiles"])


def _get_table() -> tuple[TinyDB, object]:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    db = TinyDB(DB_PATH)
    return db, db.table(TABLE_NAME)


def create_profile(
    user_id: str,
    name: str | None = None,
    phone: str | None = None,
    address: str | None = None,
) -> ProfileRead:
    db, table = _get_table()
    try:
        profile = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "name": name,
            "phone": phone,
            "address": address,
        }
        table.insert(profile)
        return ProfileRead.model_validate(profile)
    finally:
        db.close()


def get_profile_by_user_id(user_id: str) -> ProfileRead | None:
    db, table = _get_table()
    try:
        doc = table.get(Query().user_id == user_id)
        return ProfileRead.model_validate(doc) if doc else None
    finally:
        db.close()


def delete_profile_by_user_id(user_id: str) -> None:
    db, table = _get_table()
    try:
        table.remove(Query().user_id == user_id)
    finally:
        db.close()


@router.get("/me", response_model=ProfileRead)
def get_my_profile(current_user: User = Depends(get_current_user)) -> ProfileRead:
    profile = get_profile_by_user_id(current_user.id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Perfil no encontrado.")
    return profile


@router.put("/me", response_model=ProfileRead)
def update_my_profile(
    payload: ProfileUpdate,
    current_user: User = Depends(get_current_user),
) -> ProfileRead:
    db, table = _get_table()
    try:
        existing = table.get(Query().user_id == current_user.id)
        if existing is None:
            raise HTTPException(status_code=404, detail="Perfil no encontrado.")

        updates = payload.model_dump(exclude_unset=True)
        if updates:
            table.update(updates, Query().user_id == current_user.id)

        updated = table.get(Query().user_id == current_user.id)
        return ProfileRead.model_validate(updated)
    finally:
        db.close()
