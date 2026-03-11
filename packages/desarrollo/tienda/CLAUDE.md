# CLAUDE.md — Tienda Base

> Referencia de arquitectura y comandos para Claude Code.
> Leer antes de tocar código, hacer deploy o ejecutar cualquier tarea.
> Los agentes listados corresponden a los ficheros en `~/.claude/agents/`.

---

## Stack tecnológico

- **Frontend:** SvelteKit + Tailwind CSS → puerto `5173` (dev)
- **Backend:** Medusa.js v2 → puerto `9000` API / `7001` Admin (dev)
- **Base de datos:** PostgreSQL 16 → puerto `5432`
- **Caché/eventos:** Redis 7 → puerto `6379`
- **Almacenamiento:** S3/MinIO → puerto `9002` (dev) / S3 (prod)
- **Pagos:** Stripe (API externa)
- **Emails:** Resend (API externa)
- **Deploy:** Coolify (self-hosted)

---

## Estructura del repositorio

```
tienda-base/
├── frontend/          ← SvelteKit app
├── backend/           ← Medusa.js v2
├── emails/            ← Plantillas React Email
├── infra/
│   ├── docker-compose.dev.yml   ← incluye MinIO, Redis, PostgreSQL
│   └── coolify/                 ← plantillas de deploy
└── scripts/
    ├── seed.js
    └── new-client.sh <nombre-cliente> <dominio.com>
                      # Crea estructura de directorios del cliente,
                      # copia la base, inicializa git y genera .env.local
                      # Falla si el cliente ya existe en clientes/
```

### Servicios docker-compose.dev.yml

```
tienda_frontend    :5173   ← SvelteKit dev server
tienda_medusa      :9000   ← Medusa API
                   :7001   ← Medusa Admin panel
tienda_postgres    :5432   ← PostgreSQL 16
tienda_redis       :6379   ← Redis 7
tienda_minio       :9002   ← MinIO (S3 local)
                   :9003   ← MinIO Console UI
tienda_mailpit     :8025   ← Mailpit (emails dev)
```

### Frontend — rutas principales

```
frontend/src/routes/
├── +layout.svelte                   ← navbar, footer, cart drawer
├── +page.svelte                     ← home
├── catalogo/+page.svelte            ← listado productos con filtros
├── productos/[handle]/+page.svelte  ← producto individual
├── carrito/+page.svelte
├── checkout/+page.svelte            ← datos envío + Stripe
├── checkout/confirmacion/+page.svelte
└── cuenta/                          ← área cliente, pedidos, login
```

### Frontend — stores

```
frontend/src/lib/stores/
├── cart.js       ← items, totales, añadir/eliminar
├── customer.js   ← sesión cliente autenticado
└── region.js     ← región/moneda activa
```

### Backend — módulos y workflows

```
backend/src/modules/
├── email/      ← Resend
├── file/       ← S3/MinIO
└── payment/    ← Stripe

backend/src/workflows/
├── order-placed.ts       ← trigger: order confirmado → email + reducir stock
├── order-shipped.ts      ← trigger: order enviado → email notificación
└── customer-created.ts   ← trigger: registro cliente → email bienvenida
```

### Emails — plantillas y triggers

| Workflow | Plantilla | Asunto |
|---|---|---|
| `order-placed.ts` | `order-confirmation.tsx` | Tu pedido #XXX está confirmado |
| `order-shipped.ts` | `shipping-notification.tsx` | Tu pedido está en camino |
| `customer-created.ts` | `welcome.tsx` | Bienvenido/a a {tienda} |
| — (manual) | `password-reset.tsx` | Recupera tu contraseña |

---

## Variables de entorno

### Frontend (.env)

```bash
PUBLIC_MEDUSA_URL=https://api.cliente.com
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
PUBLIC_STORE_NAME=Nombre Tienda
```

### Backend (.env)

```bash
DATABASE_URL=postgres://user:pass@host:5432/db
REDIS_URL=redis://host:6379
JWT_SECRET=...
COOKIE_SECRET=...

STRIPE_SECRET_KEY=sk_live_...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=pedidos@cliente.com

S3_FILE_URL=https://bucket.s3.region.amazonaws.com
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_REGION=eu-west-1
S3_BUCKET=nombre-bucket

STORE_CORS=https://cliente.com
ADMIN_CORS=https://admin.cliente.com
AUTH_CORS=https://cliente.com,https://admin.cliente.com
```

> ⚠️ En producción las variables van en el panel de Coolify. Nunca en el código ni en git.
> `.env.production` solo existe localmente como referencia y está en `.gitignore`.

---

## Comandos esenciales

### Arrancar el stack completo

```bash
docker-compose -f infra/docker-compose.dev.yml up
```

### Desarrollo con hot reload

```bash
# Frontend
cd frontend && npm run dev

# Backend
cd backend && npx medusa develop
```

### Base de datos

```bash
# Migraciones
cd backend && npx medusa db:migrate

# Seed de datos de ejemplo
cd backend && node scripts/seed.js

# Conectar directamente a PostgreSQL
docker exec -it tienda_postgres psql -U medusa -d medusa_db
```

### Redis

```bash
# Conectar a Redis CLI
docker exec -it tienda_redis redis-cli

# Comandos útiles dentro de redis-cli
PING                  # → PONG si está OK
INFO memory           # uso de memoria
KEYS *                # ver todas las claves (solo en dev)
FLUSHALL              # limpiar caché completo (solo en dev)
```

### MinIO (S3 local)

```bash
# Acceder a la consola web de MinIO
open http://localhost:9003
# Credenciales por defecto: minioadmin / minioadmin

# Verificar que el bucket existe
docker exec -it tienda_minio mc ls local/
```

### Admin panel de Medusa

```bash
# Dev
open http://localhost:7001

# Producción: expuesto como servicio separado en Coolify
# URL: https://admin.cliente.com
```

### Tests

```bash
# E2E con Playwright
cd frontend && npx playwright test

# Tests unitarios frontend
cd frontend && npx vitest run

# Tests unitarios backend
cd backend && npx jest
```

### Emails

```bash
# Preview de plantillas React Email (servidor local)
cd emails && npx react-email dev --port 3001
open http://localhost:3001

# Mailpit — emails enviados en dev (captura automática)
open http://localhost:8025
```

### Stripe

```bash
# Webhook en local (requiere Stripe CLI)
stripe listen --forward-to localhost:9000/hooks/payment/stripe

# Eventos a configurar en Stripe Dashboard (producción):
# - payment_intent.succeeded
# - payment_intent.payment_failed
# - charge.refunded
# URL webhook prod: https://api.cliente.com/hooks/payment/stripe
# Añadir STRIPE_WEBHOOK_SECRET en Coolify tras crear el endpoint
```

### Verificar que el stack está OK

```bash
curl http://localhost:9000/health   # → {"status":"ok"}
curl http://localhost:5173          # → HTML
curl http://localhost:7001          # → Admin panel HTML
```

### Comandos de emergencia

```bash
# Reiniciar stack
docker-compose -f infra/docker-compose.dev.yml restart

# Ver logs
docker logs tienda_medusa -f
docker logs tienda_frontend -f
docker logs tienda_redis -f
docker logs tienda_minio -f

# Reset completo (borra volúmenes)
docker-compose -f infra/docker-compose.dev.yml down -v
docker-compose -f infra/docker-compose.dev.yml up --build
```

---

## Deploy — nuevo cliente

```bash
# 1. Crear proyecto desde la base
bash scripts/new-client.sh nombre-cliente dominio.com

# 2. Push al repo del cliente
cd clientes/nombre-cliente
git init && git remote add origin https://github.com/agencia/nombre-cliente
git checkout -b feat/initial-setup
git add . && git commit -m "feat: initial store scaffold from tienda-base"
git push origin feat/initial-setup

# 3. En Coolify: crear proyecto → importar desde GitHub → añadir variables → deploy
```

### Estructura Coolify por cliente

```
Coolify proyecto: nombre-cliente
├── frontend     ← SvelteKit (Node server) → https://cliente.com
├── backend      ← Medusa.js API           → https://api.cliente.com
├── admin        ← Medusa Admin panel      → https://admin.cliente.com
└── postgres     ← PostgreSQL 16
     (Redis compartido entre clientes o por proyecto según volumen)
```

### Webhook Stripe en producción

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://api.cliente.com/hooks/payment/stripe`
3. Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
4. Copiar Signing Secret → añadir como `STRIPE_WEBHOOK_SECRET` en Coolify

---

## Agentes

Los agentes disponibles están en `~/.claude/agents/`. Invocar con:
> *"Use the [nombre-agente] agent to [tarea]"*

| Tarea | Agente | Fichero en ~/.claude/agents/ |
|---|---|---|
| Frontend SvelteKit, UI, stores, rendimiento | Frontend Developer | `engineering-frontend-developer` |
| Diseño visual, componentes, sistema de diseño | UI Designer | `design-ui-designer` |
| Backend Medusa, API, workflows, Stripe | Backend Architect | `engineering-backend-architect` |
| Infraestructura, Coolify, Docker, Redis, MinIO | DevOps Automator | `engineering-devops-automator` |
| Copy de emails, textos, plantillas React Email | Content Creator | `marketing-content-creator` |
| QA visual, verificación UI, documentar bugs | Evidence Collector | `testing-evidence-collector` |
| Certificación calidad, go/no-go producción | Reality Checker | `testing-reality-checker` |
| Tests E2E Playwright, Vitest, Jest | Reality Checker / Evidence Collector | `testing-*` |
| Gestión del proyecto, coordinación, sprints | Project Shepherd | `project-management-project-shepherd` |
| Priorización de backlog y features | Sprint Prioritizer | `product-sprint-prioritizer` |
| Arquitectura, decisiones técnicas, este doc | Senior Developer | `engineering-senior-developer` |

---

## Checklist antes de entregar al cliente

### Funcional
- [ ] Catálogo cargando desde Medusa
- [ ] Página de producto con galería
- [ ] Añadir al carrito funciona
- [ ] Checkout completo con Stripe (test mode)
- [ ] Email de confirmación llega (verificar en Mailpit / Resend logs)
- [ ] Área cliente: login, registro, historial de pedidos
- [ ] Panel admin Medusa accesible en `https://admin.cliente.com`

### Técnico
- [ ] Variables de entorno en Coolify (no en código)
- [ ] SSL activo en frontend, api y admin
- [ ] Webhook Stripe configurado con los 3 eventos y Signing Secret
- [ ] Bucket S3 real en producción (no MinIO)
- [ ] Backup automático PostgreSQL activado en Coolify
- [ ] `npx medusa db:migrate` ejecutado en producción
- [ ] Redis accesible desde el backend en producción

### Rendimiento y SEO
- [ ] Meta tags por página
- [ ] Open Graph para productos
- [ ] Lighthouse score > 85 en mobile
- [ ] Imágenes en WebP con lazy loading
- [ ] Sitemap generado

### Legal
- [ ] Aviso legal
- [ ] Política de privacidad
- [ ] Política de cookies + consentimiento RGPD
- [ ] Condiciones de venta

---

> Mantenido por el agente `engineering-senior-developer`. Actualizar cada vez que cambie el stack.
> Última revisión: 2026-03-06
