from __future__ import annotations

import ast
import re
from pathlib import Path
from typing import Any

from tinydb import TinyDB

from models import ProviderCreate, ProviderResponse

SEEDERS_PATH = Path(__file__).parent / "seeders.MD"
DB_PATH = Path(__file__).parent / "data" / "suppliers.json"
TABLE_NAME = "suppliers"


def _extract_seed_records(seeders_path: Path) -> list[dict[str, Any]]:
    text = seeders_path.read_text(encoding="utf-8")
    blocks = re.findall(r"```python\s*(.*?)```", text, flags=re.DOTALL)

    for block in blocks:
        if "SUPPLIERS_SEED" not in block:
            continue

        module = ast.parse(block)
        for node in module.body:
            if not isinstance(node, ast.Assign):
                continue

            for target in node.targets:
                if isinstance(target, ast.Name) and target.id == "SUPPLIERS_SEED":
                    value = ast.literal_eval(node.value)
                    if not isinstance(value, list):
                        raise ValueError("SUPPLIERS_SEED must be a list.")
                    return value

    raise ValueError("Could not find SUPPLIERS_SEED in seeders.MD")


def _provider_key(record: dict[str, Any]) -> tuple[str, str]:
    name = str(record.get("name", "")).strip().lower()
    country = str(record.get("country", "")).strip()
    return (name, country)


def main() -> None:
    seed_records = _extract_seed_records(SEEDERS_PATH)

    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    db = TinyDB(DB_PATH)
    suppliers = db.table(TABLE_NAME)

    existing_keys = {_provider_key(doc) for doc in suppliers.all()}
    inserted = 0

    for raw_record in seed_records:
        valid_input = ProviderCreate.model_validate(raw_record)
        normalized_core = valid_input.model_dump(mode="json")
        unique_key = _provider_key(normalized_core)

        if unique_key in existing_keys:
            continue

        merged_record = {**raw_record, **normalized_core}
        provider = ProviderResponse.model_validate(merged_record)
        suppliers.insert(provider.model_dump(mode="json"))
        existing_keys.add(unique_key)
        inserted += 1

    db.close()
    print(f"Seeder completado. Registros insertados: {inserted}")


if __name__ == "__main__":
    main()
