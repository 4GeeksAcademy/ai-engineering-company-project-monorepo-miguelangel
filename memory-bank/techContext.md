# Stack tecnológico
- Monorepo por dominios para separar UI, servicios, datos, agentes, workflows e infraestructura.
- TypeScript como base técnica del proyecto.
- Frontend principal del caso de uso en Next.js 16 con React 19.
- Tailwind CSS 4 para estilos y PostCSS para procesamiento.
- ESLint 9 con configuración de Next.js para calidad de código.
- Capa cliente de API REST centralizada para consumir candidatos y notas.
- Backend centralizado en FastAPI (`services/api`) con routers por dominio, Pydantic para contratos, SQLModel sobre Supabase para inventario y TinyDB/JSON para usuarios, perfiles y proveedores.
- Backoffice (`uis/backoffice`) y web corporativa (`uis/website/my-app`) en Next.js; el backoffice consume la API mediante rutas proxy de Next.
- Entorno de desarrollo con Docker Compose (`api` y `uis` en la red `nexova-net`).
- Telemetría propia: envelope común versionado (`schemaVersion` 1.0.0), `TelemetryService` en frontend y `log_telemetry_event` en backend.

## Decisiones de arquitectura tomadas
- Todo endpoint de la API declara `response_model` explícito; los modelos de entrada y salida no se heredan entre sí y no se devuelven campos sensibles (ver `docs/serialization-audit.md`).
- Caché en memoria con TTL en el backend (`services/api/cache.py`), con invalidación por prefijo al escribir; sin dependencias externas y sin compartir entre workers.
- Stock de inventario calculado por agregación (`GROUP BY`), nunca con queries por producto.
- Telemetría: eventos con allowlist cerrada de `properties`, `office` normalizado a minúscula y `currency` derivada de la oficina, sin conversión entre monedas. Frontend con lotes de 10s/20 eventos y `sendBeacon`; backend con muestreo configurable (`API_TELEMETRY_SAMPLE_RATE`).
- Las mediciones de rendimiento se hacen contra build de producción, no contra `next dev` (ver `REPORT.md`).
- Estructura modular por responsabilidades para facilitar escalabilidad y mantenimiento.
- Implementación inicial enfocada en una UI independiente de seguimiento de candidatos (Talent Pipeline Tracker).
- Centralización del acceso HTTP en una librería de API para evitar lógica de red dispersa en componentes.
- Definición de contratos tipados de dominio (status, stage, payloads y responses) para consistencia entre frontend y backend.
- Estado de filtros sincronizado con query params para compartir vistas filtradas y mantener navegación coherente.
- Uso de Suspense en la página principal para soportar correctamente hooks de navegación y parámetros en cliente.
- Enfoque human-in-the-loop: la IA asiste el pre-cribado y ranking, pero la decisión final de selección sigue en manos del consultor.

## Restricciones técnicas
- Dependencia obligatoria de variable de entorno para URL de API; sin configuración no funciona la integración.
- Restricción de valores de estado y etapa mediante enums cerrados; cualquier valor fuera de contrato rompe consistencia.
- Dependencia de endpoints REST existentes para records y notes; sin backend compatible no hay flujo completo.
- Contexto técnico formal todavía incipiente: no hay ADRs documentadas en este punto.
- Alcance funcional acotado al pre-cribado asistido; no se contempla automatización completa de contratación sin intervención humana.