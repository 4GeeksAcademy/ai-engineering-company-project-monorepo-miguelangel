"""
Conexiones de base de datos de la API de Nexova.

Dos bases de datos activas simultáneamente:
- TinyDB (existente): usuarios y autenticación. Cada router abre su propia
  tabla bajo `data/` (ver `routes/users.py`, `routes/suppliers.py`, etc.).
- Supabase / Postgres (nueva): inventario (`Asset`, `AssetEntry`, `AssetExit`)
  vía SQLModel. `get_db` entrega una sesión por request con `Depends()`.
"""

from __future__ import annotations

import os
from typing import Iterator

from dotenv import load_dotenv
from sqlmodel import Session, SQLModel, create_engine

load_dotenv()

DATABASE_URL = os.environ["DATABASE_URL"]

engine = create_engine(DATABASE_URL, pool_pre_ping=True)


def get_db() -> Iterator[Session]:
    with Session(engine) as session:
        yield session


def create_db_and_tables() -> None:
    """Crea el esquema de inventario en Supabase si no existe.

    `create_all()` es aceptable en desarrollo/aprendizaje. En producción los
    cambios de esquema se gestionan con migraciones versionadas (Alembic);
    nunca ejecutar esto contra una base de datos compartida o de producción.
    """
    import models  # noqa: F401  (registra Asset/AssetEntry/AssetExit en el metadata)

    SQLModel.metadata.create_all(engine)
