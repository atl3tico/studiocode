# Coding Conventions

**Analysis Date:** 2026-03-08

## Naming Patterns

**Files:**
- Astro Components & Layouts: `PascalCase.astro` (e.g., `src/components/Hero.astro`)
- Astro Pages: `kebab-case.astro` or `index.astro` (e.g., `src/pages/aviso-legal.astro`)
- TypeScript Libs: `camelCase.ts` or `kebab-case.ts` (e.g., `src/lib/cms.ts`)

**Functions:**
- Use `camelCase` for all function names (e.g., `getRestaurantMenu`).

**Variables:**
- Use `camelCase` for variable instances.
- Environment variables use `UPPER_SNAKE_CASE` with `PUBLIC_` prefix if exposed to client.

**Types:**
- Use `PascalCase` for Interfaces and Types (e.g., `interface Category`, `interface Dish`).

## Code Style

**Formatting:**
- Built-in Astro formatting. Prettier/ESLint are not explicitly configured but standard code uses 2-space indentation.

**Linting:**
- Strict TypeScript type-checking is enforced via `"extends": "astro/tsconfigs/strict"` in `tsconfig.json`.

## Import Organization

**Order:**
1. External packages/libraries (e.g., `import { createClient } from '@sanity/client';`)
2. Layouts (e.g., `import BaseLayout from '../layouts/BaseLayout.astro';`)
3. Components (e.g., `import Nav from '../components/Nav.astro';`)
4. Local utilities/libs (e.g., `import { getRestaurantMenu } from '../lib/cms';`)

**Path Aliases:**
- Currently using relative paths (`../components/Name.astro`).
- Component imports frequently use space-alignment for readability:
  ```typescript
  import Nav      from '../components/Nav.astro';
  import Hero     from '../components/Hero.astro';
  ```

## Error Handling

**Patterns:**
- Try/Catch blocks are used for external data fetching (e.g., `src/lib/cms.ts`).
- Fallback returns: On error, gracefully catch, log, and return an empty state instead of crashing (e.g., `return {}` or `return []`).

## Logging

**Framework:** `console` (No external logging framework configured)

**Patterns:**
- Use `console.error` explicitly within catch blocks for tracking fetch/API issues.
- Keep standard console logs out of production code.

## Comments

**When to Comment:**
- Use block comments (`/** ... */`) to document the purpose of core library functions and exported configurations.
- Use inline comments (`//`) to explain specific logic inside functions (e.g., grouping loops).

**JSDoc/TSDoc:**
- Basic descriptions used above function signatures, explaining what the function queries, expands, and returns.

## Function Design

**Size:** Small, focused functions. Data fetching handles querying and parsing/grouping within the same execution block.

**Parameters:** Prefer object destructuring for complex props or explicit typing.

**Return Values:** Always explicitly type return promises (e.g., `Promise<Record<string, Dish[]>>`).

## Module Design

**Exports:**
- Named exports are preferred for utilities (`export const sanityClient = ...`, `export async function getRestaurantMenu()`).
- Default exports are implicitly used by Astro pages and components.

**Barrel Files:** Not actively used; direct imports to files are standard.

---

*Convention analysis: 2026-03-08*