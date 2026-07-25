### SKILL: update-progress-memory

**PROMPT SYSTEM INSTRUCTION:**
Ejecuta esta skill INMEDIATAMENTE después de finalizar la implementación o modificación de cualquier característica en el proyecto.

**INSTRUCCIONES DE EJECUCIÓN:**
1. Lee el contenido actual de `memory-bank/progress.md`.
2. Actualiza la sección `## Estado actual del desarrollo` agregando el nuevo avance/funcionalidad lograda mediante viñetas (`- `).
3. Revisa la sección `## Pasos previstos`:
   - Elimina o marca como completados los ítems que se hayan resuelto con esta implementación.
   - Agrega nuevos pasos pendientes si surgieron durante el desarrollo.
4. (Opcional) Si la actualización es un hito relevante, registra la entrada en una sección `## Historial de Avances` al final del archivo con el formato:
   - **[YYYY-MM-DD] {feature_title}:** {summary_of_changes}
5. Guarda los cambios en `memory-bank/progress.md` asegurando que la estructura de encabezados H2 (`##`) se preserve intacta.