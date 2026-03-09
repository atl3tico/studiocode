# Codebase Structure

**Analysis Date:** 2026-03-08

## Directory Layout

```
studio-code/
├── clientes/             # Active client projects
├── desarrollo/           # Base templates for cloning
│   ├── landing-base/     # Base for simple landing pages
│   ├── tienda-base/      # Base for e-commerce (SvelteKit + Medusa)
│   └── web-base/         # Base for corporate webs (Astro + CMS)
├── infraestructura/      # Infrastructure, Coolify, DNS config
├── leads/                # Lead tracking
├── legal/                # Legal templates, contracts
├── marketing/            # Agency marketing materials
├── operaciones/          # Internal processes, guides
├── proyectos/            # Internal agency projects
├── scripts/              # Automation scripts (e.g., new-client-landing.sh)
└── ventas/               # Proposals, budgets
```

## Directory Purposes

**`clientes/`:**
- Purpose: Contains all active client projects.
- Contains: Individual cloned repositories/directories per client.
- Key files: `clientes/<name>/CLAUDE.md` (project-specific instructions).

**`desarrollo/`:**
- Purpose: Holds the "golden paths" or templates for new projects.
- Contains: Full project structures waiting to be copied.
- Key files: `desarrollo/web-base/CLAUDE.md`, `desarrollo/tienda-base/CLAUDE.md`.

**Web Base Project Structure (e.g., `clientes/restaurante-web`):**
- `src/components/`: Reusable Astro/UI components.
- `src/layouts/`: HTML structure layouts.
- `src/pages/`: Astro routing entry points.
- `src/lib/`: Utilities, CMS clients, shared logic.
- `src/styles/`: Global CSS and Tailwind configurations.
- `schema/` & `studio/`: Sanity CMS schemas and studio config.

## Key File Locations

**Entry Points:**
- Astro: `src/pages/index.astro` (Homepage route)
- SvelteKit (Tienda): `frontend/src/routes/+page.svelte`
- Medusa (Tienda): `backend/src/api/index.ts`

**Configuration:**
- Workspace: `CLAUDE.md` (Root)
- Project instructions: `clientes/<name>/CLAUDE.md`
- Astro: `astro.config.mjs`, `tailwind.config.mjs` (or inline v4 CSS)
- Dependencies: `package.json` in each project root.

**Core Logic:**
- CMS Integration: `src/lib/cms.ts`

## Naming Conventions

**Files:**
- Components: PascalCase `ComponentName.astro` or `.tsx`
- Layouts: PascalCase `Layout.astro`
- Utilities/Lib: kebab-case or camelCase `cms.ts`

**Directories:**
- Client projects: kebab-case `nombre-cliente`
- Base templates: kebab-case `tipo-base`
- Feature directories: lowercase `components`, `layouts`

## Where to Add New Code

**New Client Project:**
- Run `cp -r desarrollo/<base> clientes/<new-client-name>` or use `scripts/new-client-landing.sh`.

**New Web Feature (Astro):**
- Primary code: `src/pages/<route>.astro`
- New UI Component: `src/components/<Name>.astro`
- Content Schema: `schema/<type>.ts`

**Utilities:**
- Shared helpers: `src/lib/`

## Special Directories

**`.agents/` & `.claude/`:**
- Purpose: Contains Claude Code custom agents, prompts, and workflows.
- Generated: No (Custom authored).
- Committed: Yes.

---

*Structure analysis: 2026-03-08*