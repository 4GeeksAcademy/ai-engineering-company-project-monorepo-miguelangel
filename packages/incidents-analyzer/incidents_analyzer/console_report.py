"""
incidents_analyzer.console_report
===================================

Formatea un `summary` (ver `analyzer.build_summary`) como texto legible de
consola, igual que en la Fase 1. Separado de `analyzer.py` para mantener la
lógica de negocio 100% pura y sin efectos de impresión.
"""

from __future__ import annotations

from typing import Any


def render_report(summary: dict[str, Any]) -> str:
    lines: list[str] = []
    sep = "=" * 60

    lines.append(sep)
    lines.append("  NEXOVA — SUPPORT TICKET ANALYSIS")
    lines.append(f"  Source file: {summary['source_file']}")
    lines.append(sep)
    lines.append("")

    total = summary["total_records"]
    valid = summary["valid_records"]
    invalid = summary["invalid_records"]

    lines.append(f"TOTAL RECORDS IN FILE .......... {total}")
    lines.append(f"  ├─ Valid records ................ {valid}")
    lines.append(f"  └─ Invalid / incomplete .......... {invalid}")
    lines.append("")

    lines.append("INVALID RECORDS BREAKDOWN")
    active_rules = [item for item in summary["invalid_breakdown"] if item["count"] > 0]
    if not active_rules:
        lines.append("  └─ (no invalid records found)")
    else:
        for i, item in enumerate(active_rules):
            branch = "└─" if i == len(active_rules) - 1 else "├─"
            dots = "." * max(1, 34 - len(item["label"]))
            lines.append(f"  {branch} {item['label']} {dots} {item['count']}")
    lines.append("")

    lines.append("BREAKDOWN BY CATEGORY (valid records)")
    cats = summary["category_breakdown"]
    for i, item in enumerate(cats):
        branch = "└─" if i == len(cats) - 1 else "├─"
        dots = "." * max(1, 24 - len(item["category"]))
        lines.append(f"  {branch} {item['category']} {dots} {item['count']}  ({item['percentage']}%)")
    lines.append("")

    lines.append("BREAKDOWN BY STATUS (valid records)")
    sts = summary["status_breakdown"]
    for i, item in enumerate(sts):
        branch = "└─" if i == len(sts) - 1 else "├─"
        dots = "." * max(1, 24 - len(item["status"]))
        lines.append(f"  {branch} {item['status']} {dots} {item['count']}  ({item['percentage']}%)")
    lines.append("")

    sat = summary["satisfaction"]
    lines.append("SATISFACTION INDEX (closed tickets)")
    lines.append(f"  Scored tickets: {sat['scored_tickets']} of {sat['closed_tickets']}")
    lines.append(f"  Average score: {sat['average']:.2f} / 5.00")
    dist = sat["distribution"]
    for i, item in enumerate(dist):
        branch = "└─" if i == len(dist) - 1 else "├─"
        text = f"Score {item['score']} ({item['label']})"
        dots = "." * max(1, 24 - len(text))
        lines.append(f"  {branch} {text} {dots} {item['count']}")
    lines.append("")
    lines.append(sep)

    return "\n".join(lines)
