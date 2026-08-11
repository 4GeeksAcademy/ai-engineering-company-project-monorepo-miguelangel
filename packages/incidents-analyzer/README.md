# `incidents-analyzer` (paquete compartido)

Lógica **pura** de validación y análisis de ficheros de incidentes de Nexova.
No imprime nada, no lee del disco (salvo `load_records_from_path`, usada por
el script CLI) y no expone nunca `customer_email` en sus salidas.

Es consumida por dos capas distintas para que la lógica **no esté duplicada**:

- `scripts/analyze.py` — CLI de la Fase 1.
- `services/api` — API FastAPI de la Fase 2 (`POST /api/incidents/analyze`,
  `GET /api/incidents/results/export`).

## Instalación (modo editable)

Desde la raíz del repo:

```bash
pip install -e packages/incidents-analyzer
```

Esto permite hacer `import incidents_analyzer` desde cualquier parte del
monorepo (scripts, servicios) sin duplicar código.

> Si no se instala, tanto `scripts/analyze.py` como `services/api` incluyen
> un *fallback* que añade esta carpeta a `sys.path` automáticamente, así que
> también funcionan "out of the box" sin este paso — pero se recomienda
> instalarlo para desarrollo real.

## Contenido

- `analyzer.py` — carga/parseo de CSV, reglas de validación, cálculo de
  métricas (`analyze`), y construcción de un resumen serializable
  (`build_summary`) reutilizado por consola, JSON de la API y export CSV.
- `console_report.py` — formatea un `summary` como texto de consola
  (usado solo por el CLI).
