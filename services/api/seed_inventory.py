"""
Seeder de inventario (Hito 5, Nexova) — Supabase.

Siembra los `Asset`/`AssetEntry`/`AssetExit` mínimos exigidos por
CONTEXT-nexova-ORM.md. Es idempotente: si un `Asset` con el mismo `sku`
ya existe, no lo vuelve a insertar.

`user_uuid` se toma del primer usuario existente en TinyDB — si no hay
ninguno, registra uno primero vía `POST /users`.
"""

from __future__ import annotations

from datetime import datetime, timezone

from sqlmodel import Session, select
from tinydb import TinyDB

from database import create_db_and_tables, engine
from models import Asset, AssetEntry, AssetExit

ASSETS_SEED = [
    {"name": 'Portátil 14" Business', "sku": "NXV-IT-001", "category": "hardware", "office": "Valencia"},
    {"name": 'Portátil 14" Business', "sku": "NXV-IT-002", "category": "hardware", "office": "Miami"},
    {"name": "Ratón ergonómico", "sku": "NXV-PER-001", "category": "peripherals", "office": "Valencia"},
    {"name": "Hub USB-C", "sku": "NXV-PER-002", "category": "peripherals", "office": "Miami"},
    {"name": "Resma de papel A4", "sku": "NXV-OFF-001", "category": "office_supplies", "office": "Valencia"},
    {"name": "Cuaderno de formación en liderazgo", "sku": "NXV-TRN-001", "category": "training_materials", "office": "Valencia"},
]

ENTRIES_SEED = [
    # (sku, quantity, supplier)
    ("NXV-IT-001", 10, "TechDistrib Valencia S.L."),
    ("NXV-IT-001", 5, "TechDistrib Valencia S.L."),
    ("NXV-IT-002", 8, "TechDistrib Miami Inc."),
    ("NXV-OFF-001", 100, "Office Depot Valencia"),
]

EXITS_SEED = [
    # (sku, quantity, exit_type, assigned_to)
    ("NXV-IT-001", 2, "allocation", "Laura Gómez"),
    ("NXV-IT-002", 3, "allocation", "Marcus Lee"),
    ("NXV-OFF-001", 20, "consumption", None),
]


def _first_tinydb_user_id() -> str:
    db = TinyDB("data/users.json")
    try:
        users = db.table("users").all()
        if not users:
            raise RuntimeError(
                "No hay usuarios en TinyDB. Registra uno primero vía POST /users "
                "antes de sembrar el inventario (las órdenes necesitan un user_uuid real)."
            )
        return users[0]["id"]
    finally:
        db.close()


def main() -> None:
    create_db_and_tables()
    user_uuid = _first_tinydb_user_id()

    with Session(engine) as session:
        assets_by_sku: dict[str, Asset] = {}
        created_assets = 0

        for record in ASSETS_SEED:
            existing = session.exec(select(Asset).where(Asset.sku == record["sku"])).first()
            if existing is not None:
                assets_by_sku[record["sku"]] = existing
                continue
            asset = Asset(**record)
            session.add(asset)
            session.flush()
            assets_by_sku[record["sku"]] = asset
            created_assets += 1

        created_entries = 0
        for sku, quantity, supplier in ENTRIES_SEED:
            asset = assets_by_sku[sku]
            already = session.exec(
                select(AssetEntry).where(
                    AssetEntry.asset_id == asset.id,
                    AssetEntry.supplier == supplier,
                    AssetEntry.quantity == quantity,
                )
            ).first()
            if already is not None:
                continue
            session.add(
                AssetEntry(
                    asset_id=asset.id,
                    quantity=quantity,
                    supplier=supplier,
                    office=asset.office,
                    created_at=datetime.now(timezone.utc),
                    user_uuid=user_uuid,
                )
            )
            created_entries += 1

        created_exits = 0
        for sku, quantity, exit_type, assigned_to in EXITS_SEED:
            asset = assets_by_sku[sku]
            already = session.exec(
                select(AssetExit).where(
                    AssetExit.asset_id == asset.id,
                    AssetExit.exit_type == exit_type,
                    AssetExit.quantity == quantity,
                )
            ).first()
            if already is not None:
                continue
            session.add(
                AssetExit(
                    asset_id=asset.id,
                    quantity=quantity,
                    exit_type=exit_type,
                    assigned_to=assigned_to,
                    office=asset.office,
                    created_at=datetime.now(timezone.utc),
                    user_uuid=user_uuid,
                )
            )
            created_exits += 1

        session.commit()

    print(
        f"Seed de inventario completado. Assets creados: {created_assets}, "
        f"entradas creadas: {created_entries}, salidas creadas: {created_exits}."
    )


if __name__ == "__main__":
    main()
