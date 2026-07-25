# 🤖 Protocolo de Operación de Agentes (`AGENTS.md`)

Este archivo define el protocolo mandatorio de actuación, restricciones y flujos de trabajo para cualquier agente de Inteligencia Artificial (Cursor, Windsurf, Claude Code, etc.) que opere dentro de este monorepo. El cumplimiento estricto de estas directrices asegura la consistencia técnica, evita la degradación del código y garantiza el alineamiento con los objetivos de negocio de la empresa.

---

## 🧠 1. Sesión de Inicio: Lectura Obligatoria del Banco de Memoria

Antes de realizar cualquier análisis, sugerir código o modificar archivos, el agente **DEBE** leer los siguientes archivos del Banco de Memoria (`/memory-bank`) para inicializar su contexto operativo:

1. **`memory-bank/projectbrief.md`**: Contexto fundamental de negocio, la propuesta de valor de la empresa, los objetivos estratégicos del proyecto y los problemas clave que soluciona el software.
2. **`memory-bank/techContext.md`**: El ecosistema tecnológico, las decisiones de arquitectura definitivas, las convenciones de diseño de software y las restricciones técnicas absolutas.
3. **`memory-bank/progress.md`**: El estado actual de la iteración de desarrollo, las tareas completadas, los cuellos de botella identificados y los próximos pasos inmediatos.

*Nota: Es responsabilidad del agente y del desarrollador mantener actualizados estos tres archivos a medida que evolucione el proyecto.*

---

## 🔄 2. Flujo de Trabajo Mandatorio Antes de Cada Commit

Ningún agente puede dar por finalizada una tarea ni sugerir un commit sin haber ejecutado de forma secuencial y estricta el siguiente flujo de cuatro (4) pasos:

```
[ PASO 1: Verificación de Reglas ]
               │
               ▼
[ PASO 2: Validación Técnica (Build/Lint) ]
               │
               ▼
[ PASO 3: Actualización del Banco de Memoria ]
               │
               ▼
[ PASO 4: Generación del Reporte Pre-Commit ]
```

### Pasos Detallados:

1. **Paso 1: Verificación de Reglas y Alcances (`.agents/rules/`)**
   - El agente debe cotejar los cambios realizados contra los archivos de reglas específicos definidos en `.agents/rules/` para asegurar que no se violaron las convenciones del monorepo.
2. **Paso 2: Validación Técnica (Build, Lint y Tests)**
   - El agente debe ejecutar o solicitar la ejecución de los comandos de validación en el espacio de trabajo correspondiente (por ejemplo: `npm run lint`, `npm run build` o comandos análogos del monorepo). Queda estrictamente prohibido proceder si existen errores de tipado en TypeScript o fallos de compilación.
3. **Paso 3: Actualización del Banco de Memoria**
   - El agente debe evaluar el impacto de los cambios introducidos y actualizar correspondientemente `memory-bank/progress.md` (y `techContext.md` si se introdujo una nueva decisión tecnológica relevante).
4. **Paso 4: Generación del Reporte Pre-Commit**
   - El agente debe redactar un mensaje resumido que contenga:
     - 🎯 Objetivo de la tarea completada.
     - 🧪 Resultado de las pruebas/compilación (Paso 2).
     - 📦 Archivos modificados y justificación.
     - 🚀 Confirmación de que el flujo se completó con éxito, dejando el repositorio listo para el commit del desarrollador.

---

## 🚫 3. Restricciones y Áreas Protegidas

Para mitigar riesgos operativos, el agente tiene prohibido modificar los siguientes archivos y directorios sin una **confirmación explícita, textual e inequívoca** por parte del desarrollador:

- **`AGENTS.md`**: Este protocolo base no puede auto-modificarse por el agente.
- **`CONTEXT.md`**: El documento raíz de la empresa suministrado por negocio es de solo lectura.
- **Lógica de negocio Core**: No se debe duplicar ni alterar su implementación (ubicada en su módulo correspondiente) al integrarla en `./uis/backoffice`. Se debe consumir mediante importaciones limpias.
- **Configuraciones raíz de Infraestructura**: Archivos de configuración global como `package.json` de la raíz, `turbo.json`, configuraciones globales de TypeScript o entornos compartidos, a menos que sea explícitamente instruido.

---

*Recordatorio de Arquitectura:* El directorio `/.agents` configura el comportamiento de las herramientas de asistencia al desarrollo (Cursor, Windsurf, Claude Code), mientras que las carpetas `/agents` o `/skills` en la raíz (si existen) corresponden al código de producto e inteligencia artificial que la empresa distribuye a sus usuarios finales.