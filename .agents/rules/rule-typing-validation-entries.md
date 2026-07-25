# Regla de Desarrollo: Tipado Estricto y Validación de Entrada

## Objetivo
Asegurar consistencia, mantenibilidad y menor tasa de errores en tiempo de ejecución mediante tipado fuerte y validaciones explícitas.

## Alcance de aplicación
- Tipo de alcance: Por patrón de archivo
- Activación: Automática cuando el archivo coincida con el patrón
- Patrones:
  - src/**/*.ts
  - uis/talent-pipeline-tracker/**/*.ts
  - uis/talent-pipeline-tracker/**/*.tsx

## Regla
1. Todo dato externo (API, formularios, query params, env vars) debe validarse antes de usarse en lógica de negocio.
2. Está prohibido usar any salvo justificación temporal documentada con comentario TODO y ticket asociado.
3. Las funciones públicas deben declarar tipos de entrada y salida explícitos.
4. Los enums o unions de dominio no deben duplicarse; deben reutilizarse desde el módulo de tipos compartido cuando exista.
5. Los errores de validación deben retornar mensajes accionables para UI o logs técnicos claros para backend.

## Criterios de aceptación
- No hay uso de any sin justificación documentada.
- No hay acceso directo a datos externos sin validación previa.
- Las funciones modificadas o nuevas exponen tipos explícitos.
- Lint y type-check sin errores.

## Ejemplo de cumplimiento
- Correcto: parsear y validar payload antes de mapearlo a tipos de dominio.
- Incorrecto: castear respuesta de API con as sin validación previa.