"""
incidents_analyzer.analyzer
============================

Lógica de negocio PURA para el análisis de ficheros de incidentes de Nexova.

Este módulo no imprime nada, no lee ficheros del disco ni pide input al
usuario: solo transforma datos. Así puede reutilizarse sin cambios tanto
desde el script de línea de comandos (`scripts/analyze.py`) como desde el
endpoint de la API (`services/api`), cumpliendo el requisito de no duplicar
la lógica de validación y cálculo de métricas.

IMPORTANTE — Privacidad:
    Ninguna función de este módulo debe devolver, imprimir o registrar el
    valor de `customer_email`. El fichero de origen contiene datos
    sensibles y no debe salir de las fronteras internas del sistema.
"""

from __future__ import annotations

import csv
import io
import re
from collections import Counter, OrderedDict
from dataclasses import dataclass, field
from typing import Any

# ---------------------------------------------------------------------------
# Configuración derivada del CONTEXT de Nexova
# ---------------------------------------------------------------------------

REQUIRED_FIELDS = [
    "ticket_id", "date", "client_company", "category",
    "description", "agent_id", "status", "customer_email",
]

VALID_CATEGORIES = {"TECHNICAL", "BILLING", "ACCESS", "HR_QUERY", "COMPLAINT"}
VALID_STATUSES = {"OPEN", "CLOSED", "DISCARDED"}

AGENT_ID_PATTERN = re.compile(r"^AGT-\d{2}$")
MIN_DESCRIPTION_LEN = 5

# Orden y etiquetas de las reglas de invalidez, en el mismo orden que el
# CONTEXT. El orden se conserva en toda salida (consola, JSON y CSV).
RULE_LABELS: "OrderedDict[str, str]" = OrderedDict([
    ("missing_client_company", "Missing client_company"),
    ("invalid_category", "Invalid or missing category"),
    ("invalid_description", "Invalid or missing description"),
    ("invalid_agent_id", "Invalid or missing agent_id"),
    ("invalid_email", "Invalid or missing email"),
    ("invalid_status", "Invalid or missing status"),
    ("closed_without_score", "Closed ticket, no score"),
    ("score_out_of_range", "Satisfaction score out of range"),
])

SATISFACTION_LABELS = {
    1: "Very dissatisfied",
    2: "Dissatisfied",
    3: "Neutral",
    4: "Satisfied",
    5: "Very satisfied",
}

ORDERED_CATEGORIES = ["TECHNICAL", "BILLING", "ACCESS", "HR_QUERY", "COMPLAINT"]
ORDERED_STATUSES = ["OPEN", "CLOSED", "DISCARDED"]


# ---------------------------------------------------------------------------
# Excepciones propias (para que capas superiores las traduzcan a HTTP/CLI)
# ---------------------------------------------------------------------------

class EmptyFileError(ValueError):
    """El fichero no contiene filas de datos."""


class MissingHeaderError(ValueError):
    """El fichero no tiene fila de cabecera / está vacío."""


# ---------------------------------------------------------------------------
# Carga de datos
# ---------------------------------------------------------------------------

def parse_csv_text(text: str) -> list[dict[str, str]]:
    """
    Parsea el contenido de un CSV (ya decodificado a texto) y devuelve una
    lista de diccionarios, uno por fila. No valida el contenido de negocio,
    solo la estructura CSV.
    """
    reader = csv.DictReader(io.StringIO(text))
    if reader.fieldnames is None:
        raise MissingHeaderError("El fichero no tiene una fila de cabecera válida.")
    rows = list(reader)
    if not rows:
        raise EmptyFileError("El fichero no contiene registros.")
    return rows


def load_records_from_path(path: str) -> list[dict[str, str]]:
    """Lee un CSV desde disco (usado por el script CLI)."""
    with open(path, "r", encoding="utf-8-sig", newline="") as f:
        return parse_csv_text(f.read())


# ---------------------------------------------------------------------------
# Validación de un registro
# ---------------------------------------------------------------------------

def validate_record(record: dict[str, Any]) -> tuple[list[str], int | None]:
    """
    Devuelve (reglas_incumplidas, score_value).
    `reglas_incumplidas` es una lista de claves de RULE_LABELS.
    Lista vacía => registro válido.
    """
    failed: list[str] = []

    client_company = (record.get("client_company") or "").strip()
    category = (record.get("category") or "").strip()
    description = (record.get("description") or "").strip()
    agent_id = (record.get("agent_id") or "").strip()
    status = (record.get("status") or "").strip()
    email = (record.get("customer_email") or "").strip()
    raw_score = (record.get("satisfaction_score") or "").strip()

    if not client_company:
        failed.append("missing_client_company")

    if not category or category not in VALID_CATEGORIES:
        failed.append("invalid_category")

    if not description or len(description) < MIN_DESCRIPTION_LEN:
        failed.append("invalid_description")

    if not agent_id or not AGENT_ID_PATTERN.match(agent_id):
        failed.append("invalid_agent_id")

    if not email or "@" not in email:
        failed.append("invalid_email")

    if not status or status not in VALID_STATUSES:
        failed.append("invalid_status")

    score_value: int | None = None
    if raw_score != "":
        try:
            score_value = int(raw_score)
        except ValueError:
            score_value = None
            failed.append("score_out_of_range")
        else:
            if score_value < 1 or score_value > 5:
                failed.append("score_out_of_range")

    if status == "CLOSED" and raw_score == "":
        failed.append("closed_without_score")

    return failed, score_value


# ---------------------------------------------------------------------------
# Análisis del conjunto de registros
# ---------------------------------------------------------------------------

@dataclass
class AnalysisResult:
    source_name: str
    total: int
    valid_count: int
    invalid_count: int
    rule_counts: Counter = field(default_factory=Counter)
    category_counts: Counter = field(default_factory=Counter)
    status_counts: Counter = field(default_factory=Counter)
    satisfaction_scores: list[int] = field(default_factory=list)


def analyze(records: list[dict[str, Any]], source_name: str = "") -> AnalysisResult:
    total = len(records)
    rule_counts: Counter = Counter()
    invalid_count = 0
    category_counts: Counter = Counter()
    status_counts: Counter = Counter()
    satisfaction_scores: list[int] = []

    for record in records:
        failed_rules, score_value = validate_record(record)

        if failed_rules:
            invalid_count += 1
            for rule in failed_rules:
                rule_counts[rule] += 1
            continue  # excluido del análisis principal

        category_counts[record["category"].strip()] += 1
        status_counts[record["status"].strip()] += 1

        if record["status"].strip() == "CLOSED" and score_value is not None:
            satisfaction_scores.append(score_value)

    return AnalysisResult(
        source_name=source_name,
        total=total,
        valid_count=total - invalid_count,
        invalid_count=invalid_count,
        rule_counts=rule_counts,
        category_counts=category_counts,
        status_counts=status_counts,
        satisfaction_scores=satisfaction_scores,
    )


# ---------------------------------------------------------------------------
# Construcción de un resumen "serializable" (usado por CLI, API y export)
# ---------------------------------------------------------------------------

def _pct(part: int, whole: int) -> float:
    if whole == 0:
        return 0.0
    return round((part / whole) * 100, 1)


def build_summary(result: AnalysisResult) -> dict[str, Any]:
    """
    Convierte un AnalysisResult en un dict JSON-serializable con toda la
    información necesaria para consola, API y export CSV. Nunca incluye
    datos personales (emails).
    """
    valid = result.valid_count
    closed_valid = result.status_counts.get("CLOSED", 0)
    scores = result.satisfaction_scores
    scored_count = len(scores)
    avg_score = round(sum(scores) / scored_count, 2) if scored_count else 0.0
    score_dist = Counter(scores)

    invalid_breakdown = [
        {"rule": key, "label": label, "count": result.rule_counts.get(key, 0)}
        for key, label in RULE_LABELS.items()
    ]

    category_breakdown = [
        {
            "category": cat,
            "count": result.category_counts.get(cat, 0),
            "percentage": _pct(result.category_counts.get(cat, 0), valid),
        }
        for cat in ORDERED_CATEGORIES
    ]

    status_breakdown = [
        {
            "status": st,
            "count": result.status_counts.get(st, 0),
            "percentage": _pct(result.status_counts.get(st, 0), valid),
        }
        for st in ORDERED_STATUSES
    ]

    satisfaction_distribution = [
        {"score": i, "label": SATISFACTION_LABELS[i], "count": score_dist.get(i, 0)}
        for i in range(1, 6)
    ]

    return {
        "source_file": result.source_name,
        "total_records": result.total,
        "valid_records": result.valid_count,
        "invalid_records": result.invalid_count,
        "invalid_breakdown": invalid_breakdown,
        "category_breakdown": category_breakdown,
        "status_breakdown": status_breakdown,
        "satisfaction": {
            "closed_tickets": closed_valid,
            "scored_tickets": scored_count,
            "average": avg_score,
            "distribution": satisfaction_distribution,
        },
    }


# ---------------------------------------------------------------------------
# Exportación a filas "metric,value" (usada por CLI y por el endpoint export)
# ---------------------------------------------------------------------------

def summary_to_metric_rows(summary: dict[str, Any]) -> list[tuple[str, Any]]:
    """Aplana un summary en pares (metric, value), una fila por métrica."""
    rows: list[tuple[str, Any]] = [
        ("total_records", summary["total_records"]),
        ("valid_records", summary["valid_records"]),
        ("invalid_records", summary["invalid_records"]),
    ]

    for item in summary["invalid_breakdown"]:
        rows.append((item["rule"], item["count"]))

    for item in summary["category_breakdown"]:
        rows.append((f"category_{item['category']}", item["count"]))

    for item in summary["status_breakdown"]:
        rows.append((f"status_{item['status']}", item["count"]))

    for item in summary["satisfaction"]["distribution"]:
        rows.append((f"satisfaction_score_{item['score']}", item["count"]))

    rows.append(("satisfaction_average", summary["satisfaction"]["average"]))

    return rows


def summary_to_csv_text(summary: dict[str, Any]) -> str:
    """Genera el contenido de results.csv (una fila por métrica) como texto."""
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["metric", "value"])
    writer.writerows(summary_to_metric_rows(summary))
    return buf.getvalue()
