# `services/api` — API centralizada de Nexova (FastAPI)

## Dominio: `incidents`

Endpoints para el análisis de ficheros de incidentes de soporte (Fase 2 del
reto "Analizador de Incidencias").

| Método | Ruta                              | Descripción                                                       |
| ------ | ---------------------------------- | ------------------------------------------------------------------ |
| `POST` | `/api/incidents/analyze`           | Recibe un CSV (`multipart/form-data`, campo `file`) y devuelve el resumen en JSON. |
| `GET`  | `/api/incidents/results/export`    | Descarga el último análisis como `results.csv`.                    |
| `GET`  | `/api/health`                      | Comprobación de estado del servicio.                               |

La lógica de validación y cálculo de métricas se reutiliza tal cual del
paquete compartido `packages/incidents-analyzer` — la misma que usa
`scripts/analyze.py`. No hay lógica duplicada.

## Cómo ejecutar en local

```bash
cd services/api
python -m venv .venv && source .venv/bin/activate   # opcional pero recomendado
pip install -r requirements.txt
pip install -e ../../packages/incidents-analyzer

uvicorn app.main:app --reload --port 8000
```

La API queda disponible en `http://localhost:8000`. Documentación
interactiva automática en `http://localhost:8000/docs`.

> Nota: si no instalas `incidents-analyzer` con `pip install -e`, la app
> intenta localizarlo automáticamente vía `sys.path` (ver `app/main.py`),
> así que funciona igualmente para pruebas rápidas.

## Errores manejados

| Situación                         | Código HTTP |
| ---------------------------------- | ----------- |
| No se envía fichero                | 400         |
| Extensión distinta de `.csv`       | 400         |
| Fichero vacío                      | 400         |
| Fichero > 50 MB                    | 413         |
| Codificación no UTF-8              | 400         |
| CSV sin cabecera / sin filas       | 400         |
| Export sin análisis previo         | 404         |

## Privacidad

El endpoint `/api/incidents/analyze` nunca incluye `customer_email` en la
respuesta JSON, ni el export CSV lo incluye en ninguna fila. Solo se
procesan las columnas necesarias para el cálculo de métricas.

## CORS

Por defecto permite `http://localhost:3000` (el backoffice en Next.js en
desarrollo). Configurable vía la variable de entorno `ALLOWED_ORIGINS`
(lista separada por comas).
