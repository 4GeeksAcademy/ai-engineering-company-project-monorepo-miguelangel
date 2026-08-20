"""
Router: /users

CRUD de credenciales de usuario (email + password). Los datos de perfil
(nombre, teléfono, dirección) viven en `Profile`, no aquí.

`POST /users` es pública (registro) y crea el `User` + su `Profile` inicial
en la misma operación. El resto de rutas requieren un token válido.
"""

from __future__ import annotations

import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status
from tinydb import Query, TinyDB

from models import Role, User, UserCreate, UserRead, UserUpdate
from routes.profiles import create_profile, delete_profile_by_user_id
from security import get_current_user, hash_password

DB_PATH = Path(__file__).resolve().parent.parent / "data" / "users.json"
TABLE_NAME = "users"

router = APIRouter(prefix="/users", tags=["users"])


def _get_table() -> tuple[TinyDB, object]:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    db = TinyDB(DB_PATH)
    return db, db.table(TABLE_NAME)


def get_user_by_id(user_id: str) -> User | None:
    db, table = _get_table()
    try:
        doc = table.get(Query().id == user_id)
        return User.model_validate(doc) if doc else None
    finally:
        db.close()


def get_user_by_email(email: str) -> User | None:
    db, table = _get_table()
    try:
        doc = table.get(Query().email == email.strip().lower())
        return User.model_validate(doc) if doc else None
    finally:
        db.close()


def _require_self_or_admin(target_user_id: str, current_user: User) -> None:
    if current_user.id != target_user_id and current_user.role != Role.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para acceder a este recurso.",
        )


@router.post("", response_model=UserRead, status_code=201)
def create_user(payload: UserCreate) -> UserRead:
    db, table = _get_table()
    try:
        if table.get(Query().email == payload.email.strip().lower()) is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un usuario con ese email.",
            )

        user = User(
            id=str(uuid.uuid4()),
            email=payload.email.strip().lower(),
            hashed_password=hash_password(payload.password),
            role=Role.USER,
        )
        table.insert(user.model_dump(mode="json"))
    finally:
        db.close()

    # Crea el Profile vinculado (mismo `id` de usuario -> user_id).
    create_profile(
        user_id=user.id,
        name=payload.name,
        phone=payload.phone,
        address=payload.address,
    )

    return UserRead.model_validate(user)


@router.get("", response_model=list[UserRead])
def list_users(current_user: User = Depends(get_current_user)) -> list[UserRead]:
    db, table = _get_table()
    try:
        return [UserRead.model_validate(doc) for doc in table.all()]
    finally:
        db.close()


@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: str, current_user: User = Depends(get_current_user)) -> UserRead:
    user = get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    return UserRead.model_validate(user)


@router.put("/{user_id}", response_model=UserRead)
def update_user(
    user_id: str,
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
) -> UserRead:
    _require_self_or_admin(user_id, current_user)

    updates: dict = {}
    if payload.email is not None:
        updates["email"] = payload.email.strip().lower()
    if payload.role is not None:
        if current_user.role != Role.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Solo un admin puede cambiar el rol de un usuario.",
            )
        updates["role"] = payload.role.value

    db, table = _get_table()
    try:
        existing = table.get(Query().id == user_id)
        if existing is None:
            raise HTTPException(status_code=404, detail="Usuario no encontrado.")

        if updates:
            table.update(updates, Query().id == user_id)

        updated = table.get(Query().id == user_id)
        return UserRead.model_validate(updated)
    finally:
        db.close()


@router.delete("/{user_id}")
def delete_user(user_id: str, current_user: User = Depends(get_current_user)) -> dict[str, bool]:
    _require_self_or_admin(user_id, current_user)

    db, table = _get_table()
    try:
        existing = table.get(Query().id == user_id)
        if existing is None:
            raise HTTPException(status_code=404, detail="Usuario no encontrado.")
        table.remove(Query().id == user_id)
    finally:
        db.close()

    delete_profile_by_user_id(user_id)

    return {"deleted": True}
