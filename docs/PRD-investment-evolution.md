# PRD — Tus inversiones, en tiempo real

**Producto**: Racional (prueba técnica)
**Feature**: Visualización en tiempo real de la evolución del portafolio de inversión
**Audiencia del documento**: equipo de desarrollo + entrevistador
**Fecha**: 2026-04-23
**Estado**: propuesto (pre-implementación)

---

## 1. Contexto y problema

Una de las experiencias más valoradas por los usuarios de Racional es poder ver, en tiempo real, cómo evoluciona su portafolio de inversión. Esto aporta **transparencia** y **confianza**.

Hoy el usuario no tiene una visualización fluida que refleje cambios en vivo — cualquier actualización en los datos debería reflejarse sin recargar la página.

## 2. Objetivo

Entregar una página web con:

1. Una **landing mínima** estilo `racional.cl` con una navbar que tiene un botón **"Ingresar"**.
2. Al clickear "Ingresar", el usuario es redirigido a `/portfolio` donde ve la evolución de su portafolio.
3. La evolución se **escucha en vivo** desde Firestore (`investmentEvolutions/user1`) y se muestra en un gráfico interactivo.
4. Cualquier cambio en el documento de Firestore se refleja en el gráfico **sin recargar**.

## 3. Alcance

### En alcance

- Landing estática con navbar + hero + CTA "Ingresar".
- Página `/portfolio` con:
  - Header con métricas clave (valor actual, variación absoluta, variación %, aportes acumulados).
  - Gráfico interactivo (TradingView lightweight-charts).
  - Selector de rango temporal (1M · 3M · 6M · 1A · MAX).
  - Indicador "live" (punto pulsante) cuando llega un snapshot nuevo.
  - Manejo de estados: loading, error, sin datos.
- Suscripción en vivo al documento de Firestore vía `onSnapshot`.

### Fuera de alcance

- Autenticación real (Firebase Auth). El ingreso es **mock**: el botón redirige a `/portfolio` con `user1` hardcodeado.
- Testing automatizado (decisión del product owner).
- Internacionalización: solo español (es-CL).
- Dark mode: solo light.
- Múltiples usuarios o selección de cuenta.
- Operaciones de escritura sobre el portafolio (aportes, retiros).

## 4. Usuario objetivo

Inversor de Racional que quiere ver cómo va su portafolio sin hacer nada — abre la página y confía en que lo que ve es el estado real y actual.

## 5. Requisitos funcionales

### RF-1 — Landing

- La ruta `/` muestra una landing con:
  - **Navbar** fija arriba: logo "Racional" (izquierda) + botón "Ingresar" (derecha).
  - **Hero**: titular corto, subtítulo, CTA secundario.
- El botón "Ingresar" redirige a `/portfolio` (mock auth — no hay formulario).

### RF-2 — Conexión a Firestore

- La app se conecta a Firebase usando la config provista.
- Se suscribe al documento `investmentEvolutions/user1` vía `onSnapshot`.
- La suscripción se **limpia** al desmontar la página para evitar memory leaks.

### RF-3 — Modelo de datos

El documento de Firestore tiene esta forma (verificada):

```
investmentEvolutions/user1 = {
  array: [
    {
      date: Timestamp,
      portfolioValue: number,     // CLP
      portfolioIndex: number,     // base 100
      dailyReturn: number,        // fracción (0.0047 = 0.47%)
      contributions: number       // aportes acumulados CLP
    },
    ...
  ]
}
```

Dataset actual: 356 puntos desde 2019-01-01 hasta 2019-12-22.

### RF-4 — Header de portafolio

Muestra, en este orden:

1. **Valor actual** del portafolio (último `portfolioValue`), formateado en CLP.
2. **Variación absoluta** desde el inicio del rango seleccionado (ej. "+$377.856").
3. **Variación porcentual** desde el inicio del rango (ej. "+9,12%"), con color verde/rojo según signo.
4. **Aportes acumulados** (último `contributions`).
5. **Última actualización** (fecha del último punto), con indicador "live" animado.

### RF-5 — Gráfico

- Área o línea de `portfolioValue` vs `date`.
- Tooltip en hover con: fecha, valor, índice, variación del día.
- Eje X: fechas (abreviado según rango).
- Eje Y: valores CLP (formato compacto: $1M, $3,3M).
- El rango activo filtra qué puntos se muestran.

### RF-6 — Selector de rango

Botones: **1M · 3M · 6M · 1A · MAX**.

- `MAX` es el default al entrar (el dataset es corto — 356 puntos).
- El header y gráfico se recalculan cuando cambia el rango.
- No hay `1D` ni `1S` porque la granularidad es diaria.

### RF-7 — Actualización en tiempo real

- Cualquier cambio en el documento (snapshot nuevo) debe reflejarse en UI en **< 500ms** desde que llega el snapshot.
- El indicador "live" pulsa brevemente cuando llega un snapshot.
- El gráfico anima suavemente los puntos nuevos (sin redraw abrupto).

### RF-8 — Estados de UI

- **Loading**: skeleton del header y del gráfico mientras llega el primer snapshot.
- **Error**: mensaje claro con opción de reintentar.
- **Empty**: si el array está vacío, mensaje explicativo.

## 6. Requisitos no funcionales

| Tipo            | Requisito                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| Performance     | First contentful paint < 1,5s en conexión 4G. Render del gráfico con 356 puntos < 200ms.               |
| Responsive      | Funciona en mobile (≥ 360px), tablet, desktop.                                                         |
| Accesibilidad   | Navegación con teclado en navbar y selector de rango. Contraste AA. `aria-label` en botones sin texto. |
| Browser support | Chrome, Safari, Firefox, Edge versiones recientes (últimas 2).                                         |
| Seguridad       | La config de Firebase es pública (es frontend). La seguridad vive en las rules de Firestore.           |

## 7. Arquitectura

### 7.1 Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** estricto
- **Tailwind v4** para estilos
- **TradingView lightweight-charts** para el gráfico (~45kb, perf para streaming)
- **Firebase JS SDK v10+** (solo `firebase/app` + `firebase/firestore`)
- **pnpm**

### 7.2 Estructura de carpetas (Screaming Architecture)

Regla: `app/` es el rail de Next (routing, layouts, metadata). **Todo el código de negocio vive en `features/`**. Cada `page.tsx` en `app/` es un re-export de una línea.

```
src/
  app/
    layout.tsx                                 # root layout
    page.tsx                                   # re-exports LandingPage
    portfolio/
      page.tsx                                 # re-exports PortfolioPage
      loading.tsx
      error.tsx

  features/
    landing/
      ui/
        LandingPage.tsx
        components/
          Navbar.tsx
          Hero.tsx

    investment-evolution/
      domain/
        InvestmentPoint.ts                     # type
        TimeRange.ts                           # type ('1M' | '3M' | '6M' | '1A' | 'MAX')
      application/
        InvestmentEvolutionService.ts          # clase
        InvestmentEvolutionRepository.ts       # interface (port)
        TimeRangeFilter.ts                     # clase
        InvestmentMetrics.ts                   # clase (static methods)
      infrastructure/
        FirestoreInvestmentEvolutionRepository.ts  # clase (adapter)
        FirestoreInvestmentPointMapper.ts      # clase (mapper)
      ui/
        PortfolioPage.tsx
        components/
          PortfolioHeader.tsx
          PortfolioChart.tsx
          TimeRangeSelector.tsx
          LiveIndicator.tsx
          PortfolioSkeleton.tsx
        hooks/
          useInvestmentEvolution.ts
          useTimeRange.ts

  shared/
    infrastructure/firebase/
      FirebaseClient.ts                        # clase singleton
    ui/
      components/
        Navbar.tsx                             # componente compartido entre landing y dashboard
        UserAvatar.tsx                         # componente — usa UserInitials
        UserMenu.tsx                           # dropdown/sheet
      hooks/
        useUserMenu.ts                         # estado abierto/cerrado + click outside
      format/
        CurrencyFormatter.ts                   # clase
        PercentFormatter.ts                    # clase
        DateFormatter.ts                       # clase
      identity/
        UserInitials.ts                        # clase (static: fromName)
```

### 7.3 Capas y responsabilidades

| Capa             | Responsabilidad                                                     | Tipo                                                |
| ---------------- | ------------------------------------------------------------------- | --------------------------------------------------- |
| `domain`         | Tipos y entidades del dominio. Sin dependencias externas.           | `type` + clases si hay invariantes                  |
| `application`    | Casos de uso. Orquesta repositorios y políticas. Sin Firestore acá. | clases                                              |
| `infrastructure` | Adaptadores concretos (Firestore, mapeo de documentos).             | clases                                              |
| `ui`             | Componentes y hooks. Consume `application` vía el hook.             | componentes y hooks (funciones) + clases auxiliares |
| `shared`         | Lo reutilizable entre features (cliente Firebase, formatters).      | clases                                              |

### 7.4 Reglas de código

- **Clases para todo lo que no sea React**: servicios, repositorios, mappers, formatters, calculadoras.
  - **Static methods** cuando la clase no tiene estado ni dependencias (`MoneyFormatter.format(x)`).
  - **Instance methods** cuando hay dependencias inyectables o estado (`new CurrencyFormatter({ locale, currency })`).
- **Funciones sueltas SOLO** para componentes React y hooks — donde React lo obliga.
- **Un archivo por clase/componente**. El nombre del archivo coincide con el de la clase/componente.
- **JSX y hooks separados**: un componente que tiene lógica pesada expone su lógica en un hook que vive en `hooks/`, y el componente se queda solo con JSX.
- Dependency inversion: `application` depende de la **interface** `InvestmentEvolutionRepository`, no de la implementación Firestore. La implementación se inyecta.

### 7.5 Flujo de datos

```
FirebaseClient (singleton)
    └─ provee Firestore instance
        └─ FirestoreInvestmentEvolutionRepository (implementa InvestmentEvolutionRepository)
            └─ InvestmentEvolutionService.subscribe(userId, callback)
                └─ useInvestmentEvolution('user1') — hook que maneja estado React
                    └─ PortfolioPage
                        ├─ PortfolioHeader (métricas derivadas)
                        └─ PortfolioChart (puntos filtrados por rango)
```

### 7.6 Claves de las clases principales

- **`FirebaseClient`**: singleton que inicializa Firebase una sola vez. Expone `getFirestore()`. Lee la config desde `next.config` o env vars públicas (`NEXT_PUBLIC_FIREBASE_*`).

- **`FirestoreInvestmentEvolutionRepository`** (implementa `InvestmentEvolutionRepository`):
  - `subscribe(userId, onUpdate, onError): Unsubscribe`
  - Usa `onSnapshot(doc(db, 'investmentEvolutions', userId), ...)`.
  - Convierte el documento crudo en `InvestmentPoint[]` usando `FirestoreInvestmentPointMapper`.

- **`InvestmentEvolutionService`**:
  - Constructor recibe un `InvestmentEvolutionRepository` (port).
  - `subscribe(userId, onUpdate)`: delega al repo.
  - No conoce Firestore — sirve para testear con un repo fake.

- **`TimeRangeFilter`**:
  - `static filter(points: InvestmentPoint[], range: TimeRange): InvestmentPoint[]`

- **`InvestmentMetrics`** (static methods):
  - `static currentValue(points)`
  - `static variationAbsolute(points)`
  - `static variationPercent(points)`
  - `static contributions(points)`

- **`CurrencyFormatter`** (instance, configurable):
  - `new CurrencyFormatter({ locale: 'es-CL', currency: 'CLP' })`
  - `.format(value)` / `.formatCompact(value)` (ej. "$3,3M")

- **`UserInitials`** (static methods):
  - `static fromName(name: string): string` — "user1" → "U" · "Matías Oliva" → "MO" · fallback "?" para strings vacíos.

### 7.7 Manejo de errores

- `FirestoreInvestmentEvolutionRepository` captura errores de `onSnapshot` y los propaga vía `onError`.
- `useInvestmentEvolution` expone `{ points, status: 'loading' | 'ready' | 'error', error }`.
- `PortfolioPage` renderiza el estado correspondiente.
- La ruta tiene `error.tsx` como boundary de último recurso.

## 8. UX y visual

### 8.0 Design tokens (paleta Racional)

Paleta extraída de `racional.cl`. Look black-and-white minimalista con acentos pastel.

| Token                    | HEX                   | Uso                                          |
| ------------------------ | --------------------- | -------------------------------------------- |
| `--color-bg`             | `#FFFFFF`             | Fondo global                                 |
| `--color-fg`             | `#0A0A0A`             | Texto principal, botón primary filled        |
| `--color-fg-muted`       | `#6B7280`             | Texto secundario, subtítulos                 |
| `--color-border`         | `#E5E7EB`             | Bordes, dividers, outline de botón secondary |
| `--color-primary`        | `#0A0A0A`             | Botón primary (fondo), avatar                |
| `--color-primary-fg`     | `#FFFFFF`             | Texto sobre primary                          |
| `--color-accent-mint`    | `#CDEBDC`             | Botón/badge acento positivo suave (fondo)    |
| `--color-accent-mint-fg` | `#0A0A0A`             | Texto sobre mint                             |
| `--color-accent-yellow`  | `#FFD84D`             | Highlights, badges destacados                |
| `--color-success`        | `#10B981`             | Variación positiva en gráfico y métricas     |
| `--color-danger`         | `#EF4444`             | Variación negativa en gráfico y métricas     |
| `--color-chart-line`     | `#0A0A0A`             | Línea principal del gráfico                  |
| `--color-chart-area`     | `rgba(10,10,10,0.08)` | Fill del área bajo la línea                  |

Los tokens se exponen como CSS variables en `globals.css` y se consumen desde Tailwind v4 vía `@theme`.

### 8.1 Tipografía

- **Sans primaria**: Geist Sans (viene con el scaffold de Next, fuente oficial de Vercel). Cubre headings y body.
- **Mono**: Geist Mono para valores numéricos tabulares (valor del portafolio, aportes) — mejora lectura de dígitos.
- Jerarquía: headings grandes y pesados (700), body 400-500, numérico grande en mono 500-600.

### 8.2 Landing

- Navbar fija 72px, fondo blanco, sombra muy sutil al scroll (`shadow-sm`).
- **Izquierda**: logo "Racional" en tipografía pesada, negro, con punto final (detalle de marca).
- **Centro**: links decorativos (Productos · Aprende · Nosotros) — estáticos, sin navegación real.
- **Derecha**: dos botones (replicando racional.cl):
  - **"Ingresar"** — secondary outline (fondo blanco, borde `--color-border`, texto `--color-fg`). Redirige a `/portfolio`.
  - **"Crear cuenta"** — primary filled (fondo `--color-fg`, texto `--color-primary-fg`). Decorativo — abre alert "No disponible en la demo".
- Hero centrado:
  - Titular grande en `--color-fg` (hasta 3 líneas): "La forma más fácil de ahorrar e invertir" (o variante).
  - Subtítulo en `--color-fg-muted`.
  - Dos CTAs en fila:
    - Secondary mint: "Obtener Stocks gratis" (decorativo).
    - Primary filled: "Comenzar" → redirige a `/portfolio`.

### 8.3 Dashboard `/portfolio`

La navbar cambia cuando estás "logueado": desaparecen los botones "Ingresar" y "Crear cuenta", aparece un **avatar circular** a la derecha con las iniciales.

Layout desktop:

```
┌────────────────────────────────────────────────────────────┐
│ Racional   Productos · Aprende · Nosotros           ( U )  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Tu portafolio                                ● live       │
│  $3.377.856         +$177.856  (+9,12%)                    │
│  Aportes: $3.200.000     Actualizado 22/12/2019            │
│                                                            │
│  ┌─ [1M][3M][6M][1A][MAX] ──────────────────────────────┐  │
│  │                                                      │  │
│  │             [ GRÁFICO ]                              │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

- Header: métricas grandes, variación con color (`--color-success` positivo, `--color-danger` negativo).
- Indicador `● live` con pulse animado cuando hay snapshot nuevo (duración ~600ms).
- Gráfico ocupa el ancho disponible, altura fija ~400px desktop / ~300px mobile.
- Mobile: header apilado verticalmente, selector de rango scrolleable horizontal.

### 8.4 Avatar de usuario (navbar con sesión)

- **Círculo sólido** de 36px (desktop) / 32px (mobile), fondo `--color-primary` (negro), texto `--color-primary-fg` (blanco).
- **Iniciales derivadas del nombre** vía una clase `UserInitials`:
  - 1 palabra → primera letra (`user1` → `"U"`).
  - 2+ palabras → primera letra de las dos primeras palabras (`"Matías Oliva"` → `"MO"`).
- **Click** abre un dropdown alineado a la derecha (280px desktop, fullwidth mobile) con:
  - Nombre del usuario (`user1`) en bold.
  - Subtítulo muted: `"Sesión demo"`.
  - Divider.
  - Item **"Cerrar sesión"** → redirige a `/` (mock, sin auth real).
- En mobile el dropdown es un sheet desde abajo.
- Accesibilidad: el avatar es un `<button>` con `aria-label="Menú de usuario"`, dropdown con `role="menu"` y navegación por teclado (Enter para abrir, Escape para cerrar, arrows para navegar ítems).

### 8.3 Microinteracciones

- Hover en punto del gráfico: crosshair + tooltip elegante.
- Cambio de rango: transición suave del dominio (no redraw brusco).
- Snapshot nuevo: pulso sutil en el indicador live + fade-in del punto nuevo.

## 9. Criterios de aceptación

1. **CA-1**: Abrir `/` muestra la landing con navbar y hero.
2. **CA-2**: Click en "Ingresar" navega a `/portfolio`.
3. **CA-3**: `/portfolio` muestra header con valor actual, variación y aportes correctos según el dataset de Firestore.
4. **CA-4**: Modificar el documento en Firestore console refleja el cambio en `< 1s` sin recargar.
5. **CA-5**: El gráfico muestra una línea/área continua para los 356 puntos en `MAX`.
6. **CA-6**: Cambiar el rango de tiempo actualiza header y gráfico consistentemente.
7. **CA-7**: Hover en el gráfico muestra tooltip con fecha y valor.
8. **CA-8**: En mobile (360px), la página es usable y no hay overflow horizontal.
9. **CA-9**: Si se pierde la conexión a Firestore, se muestra estado de error sin romper la página.
10. **CA-10**: El navbar de `/portfolio` muestra un avatar circular con la inicial `"U"` (de `user1`). Click abre dropdown con "Cerrar sesión" que redirige a `/`.
11. **CA-11**: La paleta visual respeta los tokens de la sección 8.0 (black-and-white + mint + yellow) y se ve consistente con `racional.cl`.
12. **CA-12**: `pnpm lint` y `pnpm type-check` pasan limpios antes de considerar la feature terminada.

## 10. Decisiones abiertas / asunciones

- **A-1**: La config de Firebase del enunciado se guardará en env vars `NEXT_PUBLIC_FIREBASE_*` para permitir distintos ambientes en el futuro, aunque para esta demo los valores son fijos.
- **A-2**: El histórico es de 2019 — para la demo en vivo de "tiempo real" se modificará el documento manualmente desde Firestore console agregando puntos al array.
- **A-3**: La clase `InvestmentEvolutionService` tiene solo un método hoy (`subscribe`), pero queda preparada para crecer (agregar ranges custom, agregación, comparación contra benchmarks).

## 11. Riesgos

| Riesgo                                           | Mitigación                                                                                                      |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Firestore rules no permiten lectura pública      | Verificar antes de la demo. Si no, coordinar con product owner.                                                 |
| lightweight-charts no juega bien con SSR         | El componente del gráfico va con `'use client'` y se monta en efecto.                                           |
| Snapshot vacío inicial crashea métricas          | `InvestmentMetrics` devuelve `null` / valores neutros cuando el array está vacío; el UI renderiza estado empty. |
| Memory leak si el hook no limpia el `onSnapshot` | El hook retorna la función de cleanup desde `useEffect`. Cubierto por el contrato del repo.                     |

## 12. Glosario

- **Screaming Architecture**: principio de estructura en el que el top-level del código revela el negocio (features), no la tecnología (controllers, services).
- **Port/Adapter**: port es la interface que define qué necesita la capa de aplicación; adapter es la implementación concreta (Firestore, en este caso).
- **onSnapshot**: API de Firestore para suscribirse a cambios en un documento/colección.
