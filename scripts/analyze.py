"""
analyze.py — Analizador de ficheros de incidentes (Nexova) — CLI

Uso:
    python analyze.py incidents-COMPANY.csv

Este script es una capa fina de línea de comandos: la lógica de
validación y cálculo de métricas vive en el paquete compartido
`incidents_analyzer` (ver /packages/incidents-analyzer), reutilizado
también por la API en `services/api`. No hay lógica de negocio duplicada
aquí — solo argumentos, impresión y el prompt de exportación.

IMPORTANTE — Privacidad:
    Este script NUNCA imprime, registra ni exporta direcciones de email
    de clientes, ni siquiera en los mensajes de error.
"""

import sys
import os

# --- Hacer importable el paquete compartido sin necesidad de `pip install` ---
try:
    import incidents_analyzer as ia  # noqa: F401
except ImportError:
    _here = os.path.dirname(os.path.abspath(__file__))
    _shared_pkg = os.path.join(_here, "..", "packages", "incidents-analyzer")
    sys.path.insert(0, os.path.abspath(_shared_pkg))
    import incidents_analyzer as ia  # noqa: F401


def main() -> None:
    if len(sys.argv) != 2:
        print("Uso: python analyze.py incidents-COMPANY.csv")
        sys.exit(1)

    source_path = sys.argv[1]

    try:
        records = ia.load_records_from_path(source_path)
    except FileNotFoundError:
        print(f"Error: no se encontró el fichero '{source_path}'.")
        sys.exit(1)
    except UnicodeDecodeError:
        print(f"Error: '{source_path}' no está codificado en UTF-8.")
        sys.exit(1)
    except (ia.EmptyFileError, ia.MissingHeaderError) as exc:
        print(f"Error: {exc}")
        sys.exit(1)

    result = ia.analyze(records, source_name=os.path.basename(source_path))
    summary = ia.build_summary(result)

    print(ia.render_report(summary))

    answer = input("Export results to CSV? [s / n]: ").strip().lower()
    if answer == "s":
        csv_text = ia.summary_to_csv_text(summary)
        with open("results.csv", "w", newline="", encoding="utf-8") as f:
            f.write(csv_text)
        print("\n✔ Resultados exportados a 'results.csv'")
    else:
        print("No se exportaron resultados.")


if __name__ == "__main__":
    main()

