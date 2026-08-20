"""
Router: /auth

- POST /auth/login  -> valida credenciales, devuelve un JWT.
- GET  /auth/me     -> usuario autenticado (email, role) + su Profile.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from models import LoginRequest, MeRead, Token, User
from routes.profiles import get_profile_by_user_id
from routes.users import get_user_by_email
from security import create_access_token, get_current_user, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token)
def login(payload: LoginRequest) -> Token:
    user = get_user_by_email(payload.email)
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inactivo.",
        )

    access_token = create_access_token(user_id=user.id)
    return Token(access_token=access_token)


@router.get("/me", response_model=MeRead)
def read_me(current_user: User = Depends(get_current_user)) -> MeRead:
    profile = get_profile_by_user_id(current_user.id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Perfil no encontrado.")

    return MeRead(email=current_user.email, role=current_user.role, profile=profile)
