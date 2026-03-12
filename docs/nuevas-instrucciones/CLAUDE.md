# CLAUDE.md — Instrucciones para el Agente

Este fichero es la guía principal para cualquier agente de IA (Claude, Copilot, etc.) que trabaje en este repositorio. Lee este fichero **completo** antes de ejecutar cualquier acción.

---

## 🗂 Estructura del repositorio

```
monorepo/
├── CLAUDE.md                  ← Este fichero (léelo siempre primero)
├── PLAN.md                    ← Estado del proyecto y tareas pendientes
├── package.json               ← Root workspace config
├── pnpm-workspace.yaml        ← Declaración de workspaces
├── turbo.json                 ← Pipeline de Turborepo
├── .gitignore
├── .github/
│   └── workflows/
│       ├── ci.yml             ← CI para PRs
│       └── deploy.yml         ← Deploy manual por app
├── apps/
│   ├── landing/               ← App Astro (landing pública)
│   ├── crm/                   ← App SvelteKit (CRM basado en CMSaasStarter)
│   └── store/                 ← App SvelteKit (ecommerce basado en sveltekit-medusa-starter)
├── packages/
│   ├── ui/                    ← Componentes Svelte/Astro compartidos
│   ├── utils/                 ← Helpers y tipos TypeScript compartidos
│   └── config/                ← Configs compartidas (tailwind, eslint, tsconfig)
├── clients/
│   └── apps/
│       ├── landing/           ← Versiones customizadas de landing por cliente
│       │   └── <nombre-cliente>/
│       ├── crm/               ← Versiones customizadas de CRM por cliente
│       │   └── <nombre-cliente>/
│       └── store/             ← Versiones customizadas de store por cliente
│           └── <nombre-cliente>/
└── scripts/
    ├── setup.sh               ← Setup inicial del monorepo
    ├── new-client.sh          ← Crea una copia de app para un cliente
    └── deploy.sh              ← Deploy manual de una app a Vercel
```

---

## ⚙️ Stack tecnológico

| App | Framework | UI | Auth | DB / Backend |
|---|---|---|---|---|
| `landing` | Astro 4 | Tailwind CSS | — | — |
| `crm` | SvelteKit 2 | Tailwind + DaisyUI | Supabase Auth | Supabase (Postgres) |
| `store` | SvelteKit 2 | Tailwind CSS | Medusa (JWT) | Medusa v2 backend |

**Tooling del monorepo:**
- Package manager: `pnpm` (workspaces)
- Build orchestration: `Turborepo`
- Deploy: `Vercel` (un proyecto por app)
- CI/CD: GitHub Actions
- TypeScript estricto en todos los paquetes

---

## 🚀 TAREA PRINCIPAL DEL AGENTE

El agente debe ejecutar las siguientes fases **en orden**. Marca cada paso en `PLAN.md` al completarlo.

---

### FASE 0 — Verificar prerequisitos

```bash
node --version      # Debe ser >= 18
pnpm --version      # Debe ser >= 8. Si no: npm install -g pnpm
gh --version        # GitHub CLI. Si no: https://cli.github.com
vercel --version    # Vercel CLI. Si no: pnpm add -g vercel
turbo --version     # Si no: pnpm add -g turbo
```

Si falta alguna herramienta, instálala antes de continuar.

---

### FASE 1 — Inicializar el monorepo

```bash
# 1. Instalar dependencias raíz
pnpm install

# 2. Verificar que turbo funciona
pnpm turbo run build --dry-run
```

---

### FASE 2 — Configurar app `landing` (Astro)

**Origen:** Astro scaffold limpio con Tailwind.

```bash
cd apps/landing

# Si la carpeta está vacía, inicializar Astro:
pnpm create astro@latest . --template minimal --typescript strict --no-install
pnpm install
pnpm add -D @astrojs/tailwind tailwindcss
```

**Estructura esperada de `apps/landing`:**
```
apps/landing/
├── src/
│   ├── components/      ← Componentes Astro reutilizables
│   ├── layouts/
│   │   └── Layout.astro ← Layout base con head, nav, footer
│   └── pages/
│       ├── index.astro  ← Homepage
│       ├── about.astro
│       └── contact.astro
├── public/
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── .env.example
```

**`package.json` de landing debe tener:**
```json
{
  "name": "@repo/landing",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

**Vercel config (`apps/landing/vercel.json`):**
```json
{
  "framework": "astro",
  "buildCommand": "cd ../.. && pnpm turbo run build --filter=@repo/landing",
  "installCommand": "cd ../.. && pnpm install",
  "outputDirectory": "dist"
}
```

---

### FASE 3 — Configurar app `crm` (SvelteKit + CMSaasStarter)

**Origen:** Clonar CMSaasStarter y adaptarlo al monorepo.

```bash
cd apps/crm

# Clonar el repo base (si la carpeta está vacía):
git clone https://github.com/CriticalMoments/CMSaasStarter.git .
rm -rf .git   # Desacoplar del repo origen

# Instalar dependencias
pnpm install
```

**Variables de entorno requeridas (crear `apps/crm/.env.example`):**
```env
# Supabase
PUBLIC_SUPABASE_URL=https://<project>.supabase.co
PUBLIC_SUPABASE_ANON_KEY=<anon-key>
PRIVATE_SUPABASE_SERVICE_ROLE=<service-role-key>

# Stripe (opcional para billing)
STRIPE_SECRET_KEY=sk_test_...
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
PUBLIC_APP_URL=http://localhost:5173
```

**`package.json` del CRM debe tener:**
```json
{
  "name": "@repo/crm",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json"
  }
}
```

**Vercel config (`apps/crm/vercel.json`):**
```json
{
  "framework": "sveltekit",
  "buildCommand": "cd ../.. && pnpm turbo run build --filter=@repo/crm",
  "installCommand": "cd ../.. && pnpm install"
}
```

**Pasos post-clonado importantes:**
1. En `apps/crm/package.json`, cambiar `"name"` a `"@repo/crm"`
2. Asegurarse de que `@sveltejs/adapter-vercel` está instalado:
   ```bash
   pnpm add -D @sveltejs/adapter-vercel
   ```
3. En `svelte.config.js`, verificar que usa `adapter-vercel`

---

### FASE 4 — Configurar app `store` (SvelteKit + Medusa)

**Origen:** Clonar sveltekit-medusa-starter.

```bash
cd apps/store

# Clonar el repo base (si la carpeta está vacía):
git clone https://github.com/pevey/sveltekit-medusa-starter.git .
rm -rf .git   # Desacoplar del repo origen

# Instalar dependencias
pnpm install
```

**Variables de entorno requeridas (crear `apps/store/.env.example`):**
```env
# Medusa Backend
PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_BACKEND_URL=http://localhost:9000

# Cloudflare Turnstile (opcional, protección bot)
PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# App
PUBLIC_STORE_URL=http://localhost:5173
```

**`package.json` del store debe tener:**
```json
{
  "name": "@repo/store",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**Vercel config (`apps/store/vercel.json`):**
```json
{
  "framework": "sveltekit",
  "buildCommand": "cd ../.. && pnpm turbo run build --filter=@repo/store",
  "installCommand": "cd ../.. && pnpm install"
}
```

**Pasos post-clonado:**
1. Cambiar `"name"` en `package.json` a `"@repo/store"`
2. Instalar adapter de Vercel:
   ```bash
   pnpm add -D @sveltejs/adapter-vercel
   ```
3. En `svelte.config.js`, cambiar adapter a `adapter-vercel`

---

### FASE 5 — Subir a GitHub

```bash
# Desde la raíz del monorepo:

# 1. Inicializar git (si no existe)
git init
git add .
git commit -m "feat: initial monorepo setup with landing, crm, store"

# 2. Crear repo en GitHub (requiere gh CLI autenticado)
gh repo create <tu-usuario>/monorepo --private --source=. --remote=origin --push

# Si ya tienes el repo creado:
# git remote add origin https://github.com/<tu-usuario>/monorepo.git
# git push -u origin main
```

> ⚠️ **Importante:** Asegúrate de que `.gitignore` excluye `.env` y `node_modules` antes del primer push.

---

### FASE 6 — Desplegar en Vercel

Cada app se despliega como un **proyecto separado** en Vercel apuntando al mismo repo.

#### 6.1 — Autenticarse en Vercel

```bash
vercel login
```

#### 6.2 — Desplegar `landing`

```bash
cd apps/landing
vercel

# Responder al wizard:
# - "Set up and deploy?" → Y
# - "Which scope?" → tu cuenta
# - "Link to existing project?" → N (nuevo proyecto)
# - "Project name?" → monorepo-landing
# - "In which directory is your code located?" → ./  (ya estamos en apps/landing)
# - Override settings? → Y
#   - Build Command: cd ../.. && pnpm turbo run build --filter=@repo/landing
#   - Output Directory: dist
#   - Install Command: cd ../.. && pnpm install

vercel --prod  # Promover a producción
```

#### 6.3 — Desplegar `crm`

```bash
cd apps/crm
vercel

# Project name: monorepo-crm
# Build Command: cd ../.. && pnpm turbo run build --filter=@repo/crm
# Output Directory: (dejar vacío, SvelteKit auto-detecta)
# Install Command: cd ../.. && pnpm install

# Añadir variables de entorno en Vercel dashboard o con CLI:
vercel env add PUBLIC_SUPABASE_URL
vercel env add PUBLIC_SUPABASE_ANON_KEY
vercel env add PRIVATE_SUPABASE_SERVICE_ROLE

vercel --prod
```

#### 6.4 — Desplegar `store`

```bash
cd apps/store
vercel

# Project name: monorepo-store
# Build Command: cd ../.. && pnpm turbo run build --filter=@repo/store
# Output Directory: (dejar vacío)
# Install Command: cd ../.. && pnpm install

vercel env add PUBLIC_MEDUSA_BACKEND_URL
vercel env add MEDUSA_BACKEND_URL

vercel --prod
```

#### 6.5 — Configurar "Ignored Build Step" en Vercel Dashboard

Para cada proyecto en Vercel → Settings → Git → **Ignored Build Step**:

- **landing:** `git diff HEAD^ HEAD --quiet apps/landing/ packages/`
- **crm:** `git diff HEAD^ HEAD --quiet apps/crm/ packages/`
- **store:** `git diff HEAD^ HEAD --quiet apps/store/ packages/`

Esto evita redespliegues innecesarios cuando solo cambia otra app.

---

### FASE 7 — Crear estructura de clientes

El directorio `clients/apps/` almacena copias customizadas de cada app para cada cliente. Cada cliente es una carpeta independiente derivada de la app base.

**Crear un nuevo cliente:**
```bash
# Uso: ./scripts/new-client.sh <app> <nombre-cliente>
# Ejemplo:
./scripts/new-client.sh landing acme-corp
./scripts/new-client.sh crm acme-corp
./scripts/new-client.sh store acme-corp
```

**Estructura resultante:**
```
clients/apps/
├── landing/
│   └── acme-corp/          ← Copia de apps/landing con branding de ACME
├── crm/
│   └── acme-corp/          ← CRM configurado para ACME (Supabase propio)
└── store/
    └── acme-corp/          ← Store con productos de ACME
```

**Cada carpeta de cliente contiene:**
- Una copia completa de la app base
- Su propio `.env.example` con variables del cliente
- Un `CLIENT.md` explicando qué está customizado
- `package.json` con `"name": "@clients/<app>-<nombre-cliente>"`

**Para desplegar un cliente en Vercel:**
```bash
cd clients/apps/landing/acme-corp
vercel
# Project name: client-acme-landing
# Build Command: cd ../../../.. && pnpm turbo run build --filter=@clients/landing-acme-corp
# Install Command: cd ../../../.. && pnpm install
vercel --prod
```

---

## 📋 Reglas generales para el agente

1. **Siempre leer `PLAN.md`** antes de empezar para ver qué está hecho y qué falta.
2. **Actualizar `PLAN.md`** marcando tareas como completadas después de cada fase.
3. **Nunca hacer commit de `.env`** con secretos reales. Solo `.env.example`.
4. **Usar `pnpm`** para todo. Nunca `npm` ni `yarn` en este repo.
5. **Nomenclatura de paquetes:** todas las apps internas usan el prefijo `@repo/`. Los clientes usan `@clients/`.
6. **Un commit por fase.** Mensajes de commit con prefijos: `feat:`, `fix:`, `chore:`, `docs:`.
7. **Antes de cada `vercel --prod`**, verificar que el build local funciona: `pnpm turbo run build --filter=@repo/<app>`.
8. **Si un clon de GitHub falla** (por red), reintentar hasta 3 veces con `--depth=1` para hacer shallow clone.
9. **Si Vercel CLI pide login**, ejecutar `vercel login` y esperar autenticación antes de continuar.
10. **Al crear clientes**, nunca modificar las apps base en `apps/`. Las customizaciones van solo en `clients/apps/`.

---

## 🔍 Comandos útiles de referencia

```bash
# Desarrollar todas las apps a la vez
pnpm dev

# Desarrollar solo una app
pnpm turbo run dev --filter=@repo/landing

# Build de todo el monorepo
pnpm build

# Build de solo una app
pnpm turbo run build --filter=@repo/crm

# Añadir dependencia a una app específica
pnpm add <paquete> --filter=@repo/store

# Añadir dependencia compartida (packages/ui)
pnpm add <paquete> --filter=@repo/ui

# Ver el grafo de dependencias de Turbo
pnpm turbo run build --graph

# Listar todos los workspaces
pnpm ls -r --depth -1

# Ver logs del último deploy en Vercel
vercel logs <deployment-url>
```

---

## ❗ Problemas comunes y soluciones

| Problema | Solución |
|---|---|
| `ERR_PNPM_WORKSPACE_PKG_NOT_FOUND` | Verificar que `pnpm-workspace.yaml` incluye el path correcto |
| Build falla en Vercel por módulos no encontrados | El `installCommand` debe hacer `cd ../..` para instalar desde la raíz |
| Supabase auth no funciona en prod | Añadir la URL de Vercel en Supabase → Authentication → URL Configuration |
| Medusa CORS error | Añadir la URL del store en `STORE_CORS` del backend Medusa |
| `turbo: command not found` en Vercel | Añadir `turbo` como devDependency en el package.json raíz |
| Puerto ocupado en `pnpm dev` | Las apps usan puertos: landing=4321, crm=5173, store=5174 |
