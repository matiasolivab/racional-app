# racional-app

Prueba técnica — frontend de visualización de portafolios de inversión.

## 📖 About

Web app desarrollada para esta prueba técnica. Permite visualizar la evolución del portafolio de un usuario **en tiempo real**: la UI se suscribe a Firestore vía `onSnapshot` y refresca el chart automáticamente cuando cambian los puntos. Incluye landing page con animación de typewriter, página de portafolio con header de métricas, chart de evolución, selector de rangos temporales (1M / 3M / 6M / 1A / MAX) e indicador _live_ del último snapshot recibido.

## ✨ Features

- **Landing**: hero con typewriter animado, navbar de marca y CTAs de demo.
- **Portfolio page**: streaming de puntos desde Firestore, header con valor actual + retorno + variación, chart con `lightweight-charts` y selector de rango temporal.
- **Live indicator**: timestamp del último snapshot recibido — feedback visual de que la suscripción está viva.
- **Time-range filter**: filtrado de puntos en el cliente por rango (`TimeRangeFilter.byRange`), sin pegar de nuevo a Firestore al cambiar de rango.
- **Estados de UI**: skeleton durante el primer load, error boundary con botón de retry y empty state cuando el rango no tiene puntos.
- **App Router** de Next.js 16 con archivos `loading.tsx` / `error.tsx` por ruta.

## 📋 Supuestos (scope de la prueba técnica)

Para acotar el alcance fijé los siguientes supuestos. La arquitectura del repositorio (Screaming + Clean / Hexagonal por feature) está pensada para que ninguno de ellos sea una limitación a futuro: **cada uno se relaja con cambios localizados**.

- **Usuario demo hardcodeado** (`user1`) en `PortfolioPage`. No hay flujo real de auth ni sesión. → _Relajar_: Consumir el JWT de `racional-api` y derivar el `userId` desde la sesión; el resto de la cadena ya recibe el id por parámetro.
- **Conexion a api**: Frontend no consume la api del backend. Se recomienda usar tanstack query para poder hacer las consultas y mutantes a los endpoints.

## 🛠 Tech Stack

| Layer           | Technology                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------ |
| Runtime         | Node.js ≥22                                                                                |
| Framework       | Next.js 16 (App Router, RSC)                                                               |
| UI              | React 19                                                                                   |
| Language        | TypeScript (strict, `noUncheckedIndexedAccess`)                                            |
| Styling         | Tailwind CSS 4 (`@tailwindcss/postcss`)                                                    |
| Charts          | lightweight-charts 5                                                                       |
| Icons           | lucide-react                                                                               |
| Realtime data   | Firebase Firestore (`onSnapshot`)                                                          |
| Linter          | ESLint 9 (flat config) + plugins (sonarjs, unicorn, security, no-secrets, import, promise) |
| Formatter       | Prettier                                                                                   |
| Git hooks       | Husky + lint-staged + commitlint (Conventional Commits)                                    |
| Package Manager | pnpm ≥10                                                                                   |

## 🏗 Architecture

El proyecto combina dos enfoques. A nivel raíz se aplica **Screaming Architecture**: la estructura del repo (`src/features/landing/`, `src/features/investment-evolution/`, `src/shared/`) refleja el dominio del producto, no el framework. Dentro de cada feature se aplica **Clean / Hexagonal Architecture**, separando `domain/` (tipos y reglas puras) → `application/` (servicios, puertos, filtros) → `infrastructure/` (adapter de Firestore, mappers) + `ui/` (componentes, hooks). Las dependencias apuntan siempre hacia adentro: la infraestructura implementa los puertos definidos en `application/` y los hooks de UI solo dependen de servicios e interfaces.

El **cableado de dependencias** vive en los hooks de cada feature (p.ej. `use-investment-evolution.ts`): el hook instancia el `FirebaseClient` (singleton), construye el `FirestoreInvestmentEvolutionRepository` y lo inyecta en `InvestmentEvolutionService`. La UI no conoce Firestore ni Firebase; solo consume el hook. Esto deja el adapter trivialmente reemplazable (HTTP, mock, fixture) sin tocar componentes.

La capa de Next.js (`src/app/`) actúa como **orquestador HTTP**: cada route file re-exporta el componente de UI de la feature. La lógica de negocio no vive en `app/`.

```
src/
├── app/                       # App Router — route files (page/layout/loading/error)
│   ├── layout.tsx             # root layout, fonts, html lang es-CL
│   ├── page.tsx               # → re-export LandingPage
│   └── portfolio/             # → re-export PortfolioPage
├── features/
│   ├── landing/               # hero + typewriter + navbar de marca
│   │   └── ui/                # componentes y hook use-typewriter
│   └── investment-evolution/  # chart en tiempo real
│       ├── domain/            # InvestmentPoint, TimeRange (tipos puros)
│       ├── application/       # InvestmentEvolutionService, TimeRangeFilter, puerto Repository
│       ├── infrastructure/    # adapter Firestore + mapper de snapshot
│       └── ui/                # PortfolioPage + componentes + hooks
└── shared/
    ├── infrastructure/        # FirebaseClient (singleton, init perezosa)
    └── ui/                    # formatters (Currency, Percent, Date), navbars, UserMenu, identity helpers
```

Path aliases por feature en `tsconfig.json` (`@investment-evolution/*`, `@landing/*`, `@shared/*`, `@/*`).

## 🚀 Getting Started

### Prerequisites

- Node.js ≥22, pnpm ≥10
- Un proyecto de Firebase con Firestore habilitado y un doc `investmentEvolutions/user1` con la forma esperada por `FirestoreInvestmentPointMapper`.

### Install

```bash
pnpm install
cp .env.example .env   # rellenar con las credenciales del proyecto Firebase
```

`.env` debe contener:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

`FirebaseClient` valida que estén todas presentes al instanciarse y lanza un error explícito si falta alguna — la app no arranca silenciosamente con config rota.

## 🖥 Usage

### Desarrollo

```bash
pnpm dev      # next dev en :3000
```

- `http://localhost:3000` → landing
- `http://localhost:3000/portfolio` → chart en tiempo real

### Build de producción

```bash
pnpm build
pnpm start
```

### Quality

```bash
pnpm lint         # ESLint flat config (sonarjs, unicorn, security, etc.)
pnpm type-check   # tsc --noEmit en modo strict
pnpm format       # prettier --write
```

`lint-staged` corre Prettier + ESLint sobre los archivos staged en cada commit, y `commitlint` valida que el mensaje siga Conventional Commits.

## 🤖 AI Workflow

El frontend se construyó con el **mismo flujo** que la API: **PRD + SDD (Spec-Driven Development) + orquestador con sub-agentes**. Las decisiones, convenciones y refactors quedan registrados en commits atómicos (ver `git log`) y en memoria persistente entre sesiones.

- **PRD primero**: el documento `docs/PRD-investment-evolution.md` fija el scope, los estados de UI, los rangos temporales y los criterios de aceptación. Sin PRD no arranca código.
- **SDD por cambio**: cada feature pasa por `propose → spec → design → tasks → apply → verify → archive`. Cada fase produce un artefacto verificable antes de pasar a la siguiente. Los refactors recientes (path aliases por feature, extracción del state machine del typewriter, rename `filter → byRange`) salieron de este pipeline.
- **Orquestador + sub-agentes**: el orquestador coordina pero NO ejecuta. Delega cada fase a un sub-agente con contexto aislado. El hilo global se mantiene limpio; los sub-agentes queman contexto en su tarea puntual y devuelven resumen. Resultado: mucho menos contexto perdido y menos alucinaciones en runs largos.
- **Skills globales (`gentle-ai`)**: las convenciones, patrones, workflow y personalidad del agente viven en una librería global cargada desde mi `~/.claude`, **no en este repo**. El agente lee los skills y los aplica; el repo queda limpio de instrucciones para la IA.
- **Memoria persistente**: decisiones arquitectónicas, fixes y patrones se guardan en engram y sobreviven entre sesiones.

## 🔗 Relación con `racional-api`

Este repo es **independiente** de `racional-api`. Hoy lee directo de Firestore para cumplir el alcance de la prueba (visualización en tiempo real). El acoplamiento real con la API se relaja agregando un nuevo adapter del puerto `InvestmentEvolutionRepository` que pegue HTTP a `racional-api` — la UI no se entera del cambio.

Si se hiciera ese paso, **recomendaría introducir [TanStack Query](https://tanstack.com/query)** como capa de cache y sincronización de servidor. Razones:

- **Cache compartido entre componentes**: `portfolio total`, `positions`, `movements` se consumen desde múltiples vistas — TanStack Query las dedupe por `queryKey` y evita refetches redundantes.
- **Estados ya resueltos**: `isLoading` / `isError` / `isFetching` / `isStale` salen de fábrica, eliminando el `useState<Status>` manual que hoy tienen los hooks (`use-investment-evolution`).
- **Invalidación dirigida**: tras un BUY / SELL / depósito, basta `queryClient.invalidateQueries({ queryKey: ['portfolio'] })` para refrescar lo que corresponda — sin reachear el repository ni reinventar pub/sub.
- **Optimistic updates** para órdenes y cash movements: la UI responde instantáneamente y se reconcilia con la respuesta real del backend.
- **Convive con el patrón actual**: la `queryFn` puede llamar a un método del `Repository` (puerto), preservando Clean Architecture. TanStack Query queda confinado a `ui/` — el dominio y la aplicación no lo conocen.

Para el flujo en tiempo real (Firestore `onSnapshot`) seguiría usando un hook de suscripción dedicado: TanStack Query es para request/response, no para streams. Ambos modelos coexisten sin fricción.
