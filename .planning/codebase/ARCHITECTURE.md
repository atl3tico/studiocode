# Architecture

**Analysis Date:** 2026-03-08

## Pattern Overview

**Overall:** Monolithic Agency Workspace (Monorepo) + Specialized Project Templates

**Key Characteristics:**
- The workspace acts as a central hub (`studio-code`) containing operational documents, base project templates, and initialized client projects.
- New client projects are instantiated by duplicating a base template (`desarrollo/*-base` -> `clientes/<client-name>`).
- Projects are self-contained once created, adhering to the architecture dictated by their respective base templates.
- Strict isolation: `clientes/` directories are separate and do not share live code with each other to prevent cross-contamination.

## Layers

**Workspace Layer:**
- Purpose: Agency operations, marketing, infrastructure, and base templates.
- Location: `/` (root)
- Contains: `operaciones/`, `marketing/`, `ventas/`, `legal/`, `infraestructura/`.
- Depends on: None.
- Used by: Agency team and Claude agents.

**Web Base Layer (Astro + Sanity CMS):**
- Purpose: Corporate websites and landing pages.
- Location: `desarrollo/web-base/` and `desarrollo/landing-base/` (cloned to `clientes/`)
- Contains: `src/components`, `src/layouts`, `src/pages`, `src/lib`.
- Depends on: Astro framework, Tailwind CSS, Sanity CMS client.
- Used by: Content-heavy client projects without e-commerce.

**Tienda Base Layer (SvelteKit + Medusa):**
- Purpose: E-commerce platforms.
- Location: `desarrollo/tienda-base/` (cloned to `clientes/`)
- Contains: `frontend/` (SvelteKit), `backend/` (Medusa), `infra/` (Docker).
- Depends on: SvelteKit, Medusa.js, PostgreSQL, Redis, Stripe, MinIO.
- Used by: E-commerce client projects.

## Data Flow

**Web Base (Astro) Flow:**

1. Route matches an Astro page in `src/pages/*.astro`.
2. Page invokes data fetching function (e.g., `getRestaurantMenu()`) from `src/lib/cms.ts`.
3. `cms.ts` uses `@sanity/client` to query the headless CMS (Sanity) via GROQ.
4. Data is mapped to TypeScript interfaces and returned to the page.
5. The Astro page passes data as props to UI components in `src/components/` and renders HTML.

**Tienda Base Flow:**

1. User interacts with SvelteKit frontend.
2. Frontend queries Medusa API (port 9000).
3. Medusa processes logic, stores data in PostgreSQL, uses Redis for caching/events.
4. Medusa integrates with Stripe for payments and Resend for emails.

## Key Abstractions

**CMS Client (`src/lib/cms.ts`):**
- Purpose: Abstracts Sanity API interactions and GROQ queries.
- Examples: `clientes/restaurante-web/src/lib/cms.ts`
- Pattern: Singleton client instance returning strongly typed promises.

**Layouts (`src/layouts/Layout.astro`):**
- Purpose: Provides the common HTML shell, meta tags, and global CSS imports.
- Examples: `clientes/restaurante-web/src/layouts/Layout.astro`
- Pattern: Astro slots and layout wrappers.

## Entry Points

**Astro Pages:**
- Location: `src/pages/*.astro`
- Triggers: User HTTP requests.
- Responsibilities: Server-side rendering, static site generation, route data fetching.

**Sanity Studio:**
- Location: `studio/` or `schema/`
- Triggers: CMS Admin HTTP requests.
- Responsibilities: Content management interface definitions.

## Error Handling

**Strategy:** Default framework-level error boundaries.

**Patterns:**
- Astro: 404/500 pages in `src/pages/`.
- Medusa: Global error handlers for API routes.

## Cross-Cutting Concerns

**Logging:** Standard `console` logging in dev; Coolify logs in prod.
**Validation:** TypeScript interfaces (e.g., `Dish`, `Category`) enforce data shape on fetch.
**Configuration:** Managed via `.env.local` files injected by Coolify during deployment.

---

*Architecture analysis: 2026-03-08*