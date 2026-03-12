# PLAN.md — Estado del Proyecto

> Actualiza este fichero marcando tareas con `[x]` al completarlas.
> Añade notas, fechas o URLs de deploy donde corresponda.

---

## Estado general

| App | Setup | GitHub | Vercel URL | Estado |
|---|---|---|---|---|
| `landing` | ⬜ | ⬜ | — | Pendiente |
| `crm` | ⬜ | ⬜ | — | Pendiente |
| `store` | ⬜ | ⬜ | — | Pendiente |

---

## FASE 0 — Prerequisitos

- [ ] Node >= 18 instalado
- [ ] pnpm >= 8 instalado
- [ ] GitHub CLI (`gh`) instalado y autenticado (`gh auth login`)
- [ ] Vercel CLI instalado y autenticado (`vercel login`)
- [ ] Turbo CLI instalado
- [ ] Git configurado con nombre y email

---

## FASE 1 — Monorepo base

- [ ] `pnpm-workspace.yaml` creado
- [ ] `turbo.json` creado con pipelines de build/dev/check
- [ ] `package.json` raíz creado con scripts globales
- [ ] `.gitignore` configurado
- [ ] `packages/config/` creado con configs de tailwind, eslint, tsconfig base
- [ ] `packages/ui/` inicializado
- [ ] `packages/utils/` inicializado
- [ ] `pnpm install` ejecutado sin errores desde la raíz

---

## FASE 2 — App: Landing (Astro)

- [ ] Astro scaffold inicializado en `apps/landing/`
- [ ] Tailwind CSS configurado
- [ ] `package.json` con name `@repo/landing`
- [ ] Layout base creado (`src/layouts/Layout.astro`)
- [ ] Páginas creadas: `index.astro`, `about.astro`, `contact.astro`
- [ ] `vercel.json` configurado
- [ ] `.env.example` creado
- [ ] Build local exitoso: `pnpm turbo run build --filter=@repo/landing`
- [ ] Dev server funciona en puerto 4321

---

## FASE 3 — App: CRM (SvelteKit + CMSaasStarter)

- [ ] CMSaasStarter clonado en `apps/crm/`
  - Repo origen: `https://github.com/CriticalMoments/CMSaasStarter`
- [ ] `.git` del repo origen eliminado
- [ ] `package.json` actualizado con name `@repo/crm`
- [ ] `@sveltejs/adapter-vercel` instalado
- [ ] `svelte.config.js` actualizado para usar `adapter-vercel`
- [ ] `.env.example` creado con todas las variables
- [ ] Variables de Supabase configuradas en `.env` local (no commitear)
- [ ] `vercel.json` configurado
- [ ] Build local exitoso: `pnpm turbo run build --filter=@repo/crm`
- [ ] Dev server funciona en puerto 5173

**URLs de servicios externos necesarios:**
- Supabase project URL: _________________
- Supabase anon key: _________________

---

## FASE 4 — App: Store (SvelteKit + Medusa)

- [ ] sveltekit-medusa-starter clonado en `apps/store/`
  - Repo origen: `https://github.com/pevey/sveltekit-medusa-starter`
- [ ] `.git` del repo origen eliminado
- [ ] `package.json` actualizado con name `@repo/store`
- [ ] `@sveltejs/adapter-vercel` instalado
- [ ] `svelte.config.js` actualizado para usar `adapter-vercel`
- [ ] `.env.example` creado con todas las variables
- [ ] `vercel.json` configurado
- [ ] Build local exitoso: `pnpm turbo run build --filter=@repo/store`
- [ ] Dev server funciona en puerto 5174

**URLs de servicios externos necesarios:**
- Medusa backend URL: _________________

> ⚠️ Nota: Para desarrollar localmente la tienda necesitas un backend Medusa corriendo.
> Instrucciones rápidas para backend local:
> ```bash
> npx create-medusa-app@latest medusa-backend --no-boilerplate
> cd medusa-backend && medusa develop
> ```

---

## FASE 5 — GitHub

- [ ] `.gitignore` excluye correctamente `.env`, `node_modules`, `.svelte-kit`, `dist`, `.turbo`
- [ ] Primer commit realizado: `feat: initial monorepo setup`
- [ ] Repositorio creado en GitHub: `gh repo create`
- [ ] Push exitoso a `main`
- [ ] GitHub Actions workflows configurados (`.github/workflows/`)
  - [ ] `ci.yml` — lint y build en cada PR
  - [ ] `deploy.yml` — deploy manual por app

**URL del repositorio:** https://github.com/___________/___________

---

## FASE 6 — Despliegues en Vercel

### 6.1 Landing
- [ ] Proyecto creado en Vercel: `monorepo-landing`
- [ ] Variables de entorno configuradas (si aplica)
- [ ] Ignored Build Step configurado
- [ ] Deploy de producción exitoso
- **URL:** _________________

### 6.2 CRM
- [ ] Proyecto creado en Vercel: `monorepo-crm`
- [ ] Variables de entorno añadidas en Vercel:
  - [ ] `PUBLIC_SUPABASE_URL`
  - [ ] `PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `PRIVATE_SUPABASE_SERVICE_ROLE`
  - [ ] `PUBLIC_APP_URL`
- [ ] Ignored Build Step configurado
- [ ] Supabase URL actualizada con dominio de Vercel
- [ ] Deploy de producción exitoso
- **URL:** _________________

### 6.3 Store
- [ ] Proyecto creado en Vercel: `monorepo-store`
- [ ] Variables de entorno añadidas en Vercel:
  - [ ] `PUBLIC_MEDUSA_BACKEND_URL`
  - [ ] `MEDUSA_BACKEND_URL`
- [ ] Ignored Build Step configurado
- [ ] CORS de Medusa backend actualizado con URL de Vercel
- [ ] Deploy de producción exitoso
- **URL:** _________________

---

## FASE 7 — Estructura de clientes

- [ ] Script `scripts/new-client.sh` funciona correctamente
- [ ] Directorio `clients/apps/` creado y en `.gitignore` parcial (excluir `.env` de clientes)
- [ ] Cliente de ejemplo creado para landing: `clients/apps/landing/demo-client/`
- [ ] Cliente de ejemplo creado para crm: `clients/apps/crm/demo-client/`
- [ ] Cliente de ejemplo creado para store: `clients/apps/store/demo-client/`

---

## Clientes registrados

| Cliente | Apps | Vercel URL | Estado |
|---|---|---|---|
| `demo-client` | landing, crm, store | — | Ejemplo |

> Añade aquí cada nuevo cliente al ejecutar `./scripts/new-client.sh`

---

## Notas del agente

> Usa esta sección para registrar decisiones, problemas encontrados o cambios de plan.

- Fecha de inicio: _______________
- Agente: Claude
- Última actualización: _______________
