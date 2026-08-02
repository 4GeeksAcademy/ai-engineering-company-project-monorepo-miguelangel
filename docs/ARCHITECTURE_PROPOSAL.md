# Propuesta de Arquitectura de Backend — FastAPI (Arquitectura Hexagonal)

**Autor:** Miguelangel  
**Fecha:** Agosto 2026  
**Ubicación:** `docs/ARCHITECTURE_PROPOSAL.md`  
**Repositorio:** `ai-engineering-company-project-monorepo-miguelangel`  

---

## 📌 1. Introducción y Contexto del Negocio

Con las tres aplicaciones web corporativas operativas dentro del monorepo (`uis/website`, `uis/backoffice` y `uis/talent-pipeline-tracker`), el backend debe actuar como la orquestación central de datos y servicios de inteligencia artificial.

Debido a la alta dependencia de integraciones dinámicas (modelos de lenguaje, servicios MCP, bases de datos y múltiples aplicaciones cliente), se adopta una **Arquitectura Hexagonal (Puertos y Adaptadores)**. Este enfoque desacopla completamente el núcleo lógico de la empresa respecto a las dependencias tecnológicas externas.

---

## 🏗️ 2. Patrón Arquitectónico Propuesto

### Patrón Elegido: Arquitectura Hexagonal (Ports and Adapters)

El sistema se divide en tres bloques fundamentales:

1. **Dominio / Núcleo (Core Domain):** Contiene las entidades puras y los casos de uso del negocio (evaluación de talento, recepción de aplicaciones, orquestación de agentes). No depende de FastAPI, bases de datos ni librerías externas.
2. **Puertos (Interfaces):** Contratos abstractos que definen cómo el mundo exterior interactúa con el dominio (Puertos de Entrada) y cómo el dominio solicita datos hacia afuera (Puertos de Salida).
3. **Adaptadores (Adapters):** Implementaciones concretas de la tecnología (FastAPI APIRouters, conexiones SQLAlchemy, conectores a proveedores de LLMs, clientes HTTP).

### Justificación Técnica vinculada al Monorepo
* **Intercambiabilidad de Modelos de IA:** Si en el futuro cambiamos el proveedor de LLM o el framework de agentes (`/agents`), solo se reescribe el *Adaptador de Salida de IA*. El núcleo del negocio no sufre ningún cambio.
* **Múltiples Clientes (Frontends):** Los *Casos de Uso* pueden ser invocados por una API HTTP (FastAPI) para el `backoffice` o por ejecuciones en segundo plano/CLI sin duplicar lógica.
* **Independencia de Testeo:** Permite probar el 100% de la lógica de negocio y agentes mediante *Mocks* sin necesidad de levantar la base de datos o realizar llamadas reales a APIs pagadas de IA.

---

## 📁 3. Estructura de Carpetas y Módulos

Implementando las convenciones de Arquitectura Hexagonal en proyectos FastAPI:

```text
services/api/
├── app/
│   ├── domain/                   # NÚCLEO DE DOMINIO (Independiente)
│   │   ├── models/               # Entidades de dominio puras (dataclasses/Pydantic sin ORM)
│   │   ├── exceptions.py         # Excepciones de negocio personalizadas
│   │   └── ports/                # Interfaces/Contratos (Protocol/ABC)
│   │       ├── candidate_repo.py # Puerto para persistencia de candidatos
│   │       └── ai_service.py     # Puerto para servicios de Inteligencia Artificial
│   │
│   ├── use_cases/                # CASOS DE USO (Lógica del Negocio)
│   │   ├── evaluate_candidate.py # Caso de uso: Evaluar candidato con IA
│   │   ├── process_application.py# Caso de uso: Procesar solicitud del sitio web
│   │   └── manage_users.py       # Caso de uso: Gestión de usuarios/auth
│   │
│   ├── adapters/                 # ADAPTADORES TECNOLÓGICOS (Dependencias)
│   │   ├── input/                # Adaptadores de Entrada (Tráfico entrante)
│   │   │   └── api/              # FastAPI APIRouters
│   │   │       ├── v1/
│   │   │       │   ├── auth_router.py
│   │   │       │   ├── candidate_router.py
│   │   │       │   ├── website_router.py
│   │   │       │   └── agent_router.py
│   │   │       └── schemas/      # DTOs Pydantic de entrada/salida HTTP
│   │   └── output/               # Adaptadores de Salida (Infraestructura)
│   │       ├── persistence/      # SQLAlchemy ORM, repositorios y DB Models
│   │       ├── ai_agents/        # Conector con /agents, /skills y proveedores de LLM
│   │       └── notifications/    # Envío de correos / webhooks
│   │
│   ├── core/                     # Configuración global, variables de entorno, DI container
│   │   ├── config.py             # Pydantic BaseSettings
│   │   └── security.py           # JWT & Hashing
│   └── main.py                   # Punto de entrada FastAPI
├── .env.example
├── requirements.txt
└── README.md
```

## 🛣️ 4. Organización de Endpoints y Routers (FastAPI)

Los routers actúan únicamente como **Adaptadores de Entrada HTTP** que traducen peticiones JSON a llamados de los **Casos de Uso**:

### 1. Dominio de Autenticación (`/api/v1/auth`)
* `POST /api/v1/auth/login` — Invocación al caso de uso `AuthenticateUser`.
* `POST /api/v1/auth/refresh` — Invocación al caso de uso `RefreshToken`.

### 2. Dominio de Candidatos (`/api/v1/candidates`) — *Talent Pipeline Tracker*
* `GET /api/v1/candidates` — Invocación al caso de uso `ListCandidates`.
* `POST /api/v1/candidates` — Invocación al caso de uso `CreateCandidate`.
* `GET /api/v1/candidates/{id}` — Invocación al caso de uso `GetCandidateDetail`.
* `PATCH /api/v1/candidates/{id}` — Invocación al caso de uso `UpdateCandidateStatus`.

### 3. Dominio Corporativo (`/api/v1/website`) — *Sitio Web Público*
* `POST /api/v1/website/applications` — Invocación al caso de uso `ProcessWebsiteApplication`.
* `POST /api/v1/website/contact` — Invocación al caso de uso `SendContactMessage`.

### 4. Dominio de Agentes de IA (`/api/v1/agents`) — *Integración con Agentes*
* `POST /api/v1/agents/evaluate` — Invocación al caso de uso `EvaluateCandidateWithAI` (conecta con los agentes en `/agents`).

---

## 🔗 5. Coexistencia Frontend - Backend (Sistemas Separados en Monorepo)

### 1. Contratos OpenAPI e Inversión de Dependencias
FastAPI genera automáticamente la especificación OpenAPI basada en los DTOs de los adaptadores de entrada (`adapters/input/api/schemas`).

### 2. Gestión de CORS
Controlado globalmente mediante `CORSMiddleware` en `main.py`, permitiendo comunicación fluida con las aplicaciones en `uis/website`, `uis/backoffice` y `uis/talent-pipeline-tracker`.

### 3. Aislamiento de Credenciales
Las dependencias externas (bases de datos, claves de IA) se inyectan a los adaptadores de salida desde `core/config.py`. Ningún secreto se filtra a la capa de presentación.

---

## ⚠️ 6. Riesgos y Puntos de Atención

| Riesgo / Punto de Atención | Consecuencia si no se sigue | Medida Preventiva Propuesta |
| :--- | :--- | :--- |
| **Fuga de Infraestructura hacia el Dominio** | Importar SQLAlchemy o FastAPI dentro de la carpeta `domain/` o `use_cases/`, rompiendo la independencia arquitectónica. | Prohibir estrictamente importar librerías externas en la capa de dominio; usar únicamente tipos nativos de Python o Pydantic básico. |
| **Complejidad Excesiva (Over-Engineering)** | Crear demasiadas capas para operaciones CRUD muy simples. | Aplicar patrones de "Caso de Uso Directo" en consultas simples sin añadir abstracciones innecesarias. |
| **Bypass de Puertos** | Permitir que los routers de FastAPI llamen directamente a la base de datos o al cliente de OpenAI sin pasar por un Caso de Uso. | Exigir revisión de código para asegurar que los routers solo inyecten casos de uso y devuelvan DTOs. |