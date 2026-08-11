"""
Almacenamiento en memoria del último resultado de análisis.

Para este proyecto (demo / desarrollo) basta con guardar el último
`summary` en un objeto en memoria del proceso. En producción esto se
sustituiría por una tabla en base de datos o un almacenamiento por
sesión/usuario, pero la interfaz (`get_last_summary` / `set_last_summary`)
se mantendría igual.
"""

from __future__ import annotations

from threading import Lock
from typing import Any, Optional

_lock = Lock()
_last_summary: Optional[dict[str, Any]] = None


def set_last_summary(summary: dict[str, Any]) -> None:
    global _last_summary
    with _lock:
        _last_summary = summary


def get_last_summary() -> Optional[dict[str, Any]]:
    with _lock:
        return _last_summary
