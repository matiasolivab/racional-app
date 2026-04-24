# Skill Registry — racional

Generated: 2026-04-23
Active backend: engram

This registry is pre-resolved context for sub-agents. The orchestrator injects the relevant compact-rule sections into each sub-agent prompt. Sub-agents do NOT read this file directly.

## Project Conventions (auto-resolved)

### From `AGENTS.md` / `CLAUDE.md`

**⚠️ Next.js 16 is NOT the Next.js in your training data.**
Before writing any Next-specific code (routing, middleware, caching, server actions, metadata, etc.), consult `node_modules/next/dist/docs/` in this repo for the actual current APIs and conventions. Do NOT rely on memorized App Router patterns from older versions. Heed deprecation notices.

### Commit conventions

- Conventional commits only (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, etc.) — enforced by commitlint via husky `commit-msg` hook.
- NEVER add `Co-Authored-By` or AI attribution lines.
- Never skip hooks (no `--no-verify`, no `--no-gpg-sign`). If a hook fails, fix the root cause.

### Quality gates (MUST pass before declaring done)

- `pnpm lint` — eslint with sonarjs, unicorn, security, promise, import, no-secrets, typescript-eslint type-checked.
- `pnpm type-check` — tsc strict + `noUncheckedIndexedAccess` + `noImplicitOverride`.
- Both are enforced at `pre-push`. Never push without them green.
- PRD CA-12 is explicit: feature is NOT done until both pass clean.

### Code style (auto-fixed by prettier on commit)

- 120 print width, single quotes, trailing comma `all`, 2-space indent, LF, `arrowParens: always`.
- husky `pre-commit` runs lint-staged (prettier --write + eslint --fix on staged files).

### Filename casing (enforced by `unicorn/filename-case`)

- **PascalCase** for classes and React components: `LandingPage.tsx`, `InvestmentMetrics.ts`, `FirebaseClient.ts`.
- **kebab-case** for hooks and non-class utilities: `use-investment-evolution.ts`.
- Nothing else is allowed.

### Naming conventions (enforced by `@typescript-eslint/naming-convention`)

- Classes: `PascalCase`.
- Methods: `camelCase`.
- Class properties: `camelCase` or `UPPER_CASE`, leading underscore allowed.

### Import order (enforced)

Groups in order, newline between: `builtin` → `external` → `internal` → `parent` → `sibling` → `index`. Alphabetized ascending, case-insensitive. `import/no-cycle` and `import/no-duplicates` are errors.

### Path aliases (enforced convention)

Per-feature aliases in `tsconfig.json`:

- `@investment-evolution/*` → `src/features/investment-evolution/*`
- `@landing/*` → `src/features/landing/*`
- `@shared/*` → `src/shared/*`
- `@/*` → `src/*` (fallback, rarely needed)

**Rules when writing imports**:

- Same-directory siblings: stay relative (`./Foo`, `./components/Bar`).
- Cross-layer within the same feature (ui → domain, application → domain, etc.): use the feature alias (`@investment-evolution/domain/InvestmentPoint`).
- Cross-feature or to shared: use the corresponding alias (`@shared/ui/format/CurrencyFormatter`).
- Do NOT use `../` or `../../` that traverse layers — always use the alias.
- Do NOT use the long `@/features/investment-evolution/...` form — use `@investment-evolution/...`.

This aligns the tool config with the screaming architecture: alias name = feature name.

### Architecture (PRD §7 — Screaming Architecture)

- `src/app/` = Next's routing rail ONLY (layouts, metadata, routing). Every `page.tsx` is a one-line re-export of a feature UI component.
- `src/features/<feature>/{domain,application,infrastructure,ui}/` — all business logic here.
- `src/shared/{infrastructure,ui}/` — cross-feature reusable code.
- **Classes for everything non-React** (services, repos, mappers, formatters, calculators). Static methods when stateless, instance when deps/state.
- **Functions ONLY where React forces it** (components, hooks).
- **One class/component per file.** File name = class/component name.
- **JSX and logic separated**: components with non-trivial logic expose their logic in a sibling hook.
- **Dependency inversion**: `application` depends on an interface (port) in its own layer; `infrastructure` provides the adapter and is injected.

### Testing

- **Strict TDD: DISABLED** for `investment-evolution` feature (PRD §3 excludes it; PO decision; user-confirmed).
- No test runner installed (no vitest/jest/etc.). No `test` script.
- Verify phase substitutes tests with `pnpm lint` + `pnpm type-check` + manual browser validation.
- Do NOT introduce test infrastructure in this change.

### Secrets & env

- Firebase public config lives in `NEXT_PUBLIC_FIREBASE_*` (frontend is client-visible — that's fine, security lives in Firestore rules).
- `eslint-plugin-no-secrets` is active with tolerance 4.5 — avoid high-entropy literals in code.

## User Skills (triggered by context)

Skills live at `~/.claude/skills/`. These are NOT auto-loaded — the orchestrator matches them to each delegation by file/task context and injects the relevant ones.

| Skill            | Trigger                                                                          | Location                                   |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------ |
| `branch-pr`      | Creating a PR, opening a pull request, preparing changes for review              | `~/.claude/skills/branch-pr/SKILL.md`      |
| `issue-creation` | Creating a GitHub issue, reporting a bug, requesting a feature                   | `~/.claude/skills/issue-creation/SKILL.md` |
| `judgment-day`   | User says "judgment day", "juzgar", "dual review", "review adversarial"          | `~/.claude/skills/judgment-day/SKILL.md`   |
| `skill-creator`  | Creating a new AI skill or documenting patterns for AI                           | `~/.claude/skills/skill-creator/SKILL.md`  |
| `go-testing`     | Writing Go tests, teatest, Go coverage — **NOT APPLICABLE** (project is TS/Next) | `~/.claude/skills/go-testing/SKILL.md`     |

## Compact Rules for Injection

Sub-agent prompts receive the relevant subset of these under `## Project Standards (auto-resolved)`:

### For any code-writing delegation

- Conventional commits; no AI attribution.
- One class/component per file; PascalCase for classes/components, kebab-case for hooks and utils.
- Classes for non-React logic; static vs instance per state/dep presence.
- **Explicit `public` / `private` on every class method (incl. constructor, static, getters).** No implicit public. See engram `racional/code-style-method-visibility`.
- **Comments only when necessary; explain WHY not WHAT.** Delete any comment that paraphrases the code. Delete JSDoc blocks that restate signatures. Keep comments only for hidden constraints, non-obvious invariants, framework-forced exceptions. See engram `racional/code-style-comments`.
- Depend on interfaces in application layer, not concrete adapters.
- Prettier settings (120 width, single quotes, trailing comma all) — auto-applied, don't fight it.
- Import order enforced — builtin → external → internal → parent → sibling → index, newline between.
- Consult `node_modules/next/dist/docs/` before using Next-specific APIs.
- No tests to write; feature is green when `pnpm lint` + `pnpm type-check` pass.

### For PR / issue creation delegations

- Follow `branch-pr` / `issue-creation` skill workflows.
- Never push without pre-push hooks green locally first.
