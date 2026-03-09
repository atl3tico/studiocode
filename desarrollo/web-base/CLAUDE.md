# CLAUDE.md — Web Base (Astro)

> Stack para webs corporativas, landings y sitios de contenido sin tienda online.
> Si el proyecto necesita e-commerce, usar tienda-base (SvelteKit + Medusa) en su lugar.
> Los agentes listados corresponden a los ficheros en `~/.claude/agents/`.

---

## Cuándo usar este stack

- Web corporativa, landing page, portfolio, blog, sitio de contenido
- El cliente NO necesita carrito de compra ni checkout
- Prioridad: rendimiento, SEO, facilidad de edición de contenido por el cliente

## Cuándo NO usar este stack

- El cliente necesita vender productos → usar `tienda-base`
- La web tiene lógica de usuario compleja (login, dashboards) → evaluar SvelteKit o Next.js

---

## Stack tecnológico

- **Framework:** Astro 5 + TypeScript
- **Estilos:** Tailwind CSS v4
- **CMS:** ver sección "Elegir CMS" más abajo
- **Deploy:** Coolify → adaptador Node o static según el CMS

---

## Elegir CMS

Decidir al inicio del proyecto según estos criterios:

| CMS | Cuándo elegirlo | Complejidad | Coste |
|---|---|---|---|
| **Sanity** | Contenido estructurado complejo, cliente técnico, relaciones entre documentos | Media | Free tier generoso |
| **Storyblok** | Cliente no técnico, edición visual en contexto (live preview), webs de marketing | Baja | Free tier limitado |
| **Contentful** | Equipo ya lo usa, contenido multiidioma, integraciones enterprise | Media-Alta | Caro en escala |

**Recomendación por defecto:** Sanity para proyectos nuevos. Storyblok si el cliente va a editar contenido con frecuencia y no es técnico.

---

## Estructura del repositorio

```
web-base/
├── src/
│   ├── components/        ← componentes Astro reutilizables
│   ├── layouts/           ← Layout.astro, BaseHead.astro
│   ├── pages/             ← rutas del sitio
│   │   ├── index.astro
│   │   ├── [slug].astro   ← páginas dinámicas desde CMS
│   │   └── blog/
│   │       └── [slug].astro
│   ├── lib/
│   │   └── cms.ts         ← cliente CMS (Sanity / Storyblok / Contentful)
│   └── styles/
│       └── global.css     ← imports Tailwind
├── public/                ← assets estáticos
├── astro.config.mjs
├── tsconfig.json
└── .env.local
```

---

## Variables de entorno

### Con Sanity

```bash
PUBLIC_SANITY_PROJECT_ID=...
PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=...          # solo para drafts/preview en server-side
```

### Con Storyblok

```bash
PUBLIC_STORYBLOK_TOKEN=...    # token de preview o public según entorno
STORYBLOK_WEBHOOK_SECRET=...  # para revalidación
```

### Con Contentful

```bash
PUBLIC_CONTENTFUL_SPACE_ID=...
PUBLIC_CONTENTFUL_ACCESS_TOKEN=...
CONTENTFUL_PREVIEW_TOKEN=...
```

> ⚠️ En producción las variables van en el panel de Coolify. Nunca en el código ni en git.

---

## Comandos esenciales

### Desarrollo

```bash
npm run dev          # servidor local en :4321
npm run build        # build estático o SSR
npm run preview      # previsualizar el build
```

### Verificar que el build está OK

```bash
npm run build && npm run preview
```

### Lighthouse en local

```bash
npx unlighthouse --site http://localhost:4321
# Abre reporte en http://localhost:5678
```

---

## Configuración Astro recomendada

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://cliente.com',   // OBLIGATORIO para sitemap y OG
  integrations: [
    tailwind(),
    sitemap(),
  ],
  // Static por defecto. Cambiar a 'server' si se necesita SSR para preview de borradores
  output: 'static',
})
```

---

## Patrones importantes

### Cargar contenido desde CMS

```ts
// src/lib/cms.ts — ejemplo con Sanity
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  useCdn: import.meta.env.PROD,   // CDN en prod, directo en dev
  apiVersion: '2024-01-01',
})

export async function getPages() {
  return client.fetch(`*[_type == "page"]{ title, slug, seo }`)
}
```

### Rutas dinámicas desde CMS

```astro
---
// src/pages/[slug].astro
import { getPages } from '../lib/cms'

export async function getStaticPaths() {
  const pages = await getPages()
  return pages.map(page => ({
    params: { slug: page.slug.current },
    props: { page }
  }))
}

const { page } = Astro.props
---
```

### SEO mínimo obligatorio

```astro
---
// src/layouts/BaseHead.astro — incluir en TODOS los layouts
const { title, description, image } = Astro.props
---
<title>{title}</title>
<meta name="description" content={description} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={image ?? '/og-default.jpg'} />
<meta property="og:type" content="website" />
<link rel="canonical" href={Astro.url} />
```

---

## Deploy en Coolify

### Static (recomendado — rebuild automático via webhook del CMS)

```
Coolify servicio: nombre-cliente-web
├── Build command:  npm run build
├── Output dir:     dist/
└── Tipo:           Static Site
```

Configurar webhook en el CMS para re-deploy automático al publicar:
- **Sanity:** Manage → API → Webhooks → URL de deploy de Coolify
- **Storyblok:** Settings → Webhooks → story_published
- **Contentful:** Settings → Webhooks → Entry published

### SSR (si el cliente necesita preview de borradores)

```
Coolify servicio: nombre-cliente-web
├── Build command:  npm run build
├── Start command:  node ./dist/server/entry.mjs
└── Tipo:           Node.js
```

Cambiar `output: 'server'` en `astro.config.mjs` y añadir `@astrojs/node`.

---

## Nuevo cliente — flujo de trabajo

```bash
# 1. Clonar la base
git clone https://github.com/agencia/web-base nombre-cliente-web
cd nombre-cliente-web

# 2. Instalar dependencias
npm install

# 3. Configurar CMS elegido (ejemplo Sanity)
npm create sanity@latest -- --project nuevo --dataset production
# Copiar projectId al .env.local

# 4. Push al repo del cliente
git remote set-url origin https://github.com/agencia/nombre-cliente-web
git checkout -b feat/initial-setup
git add . && git commit -m "feat: initial web scaffold from web-base"
git push origin feat/initial-setup

# 5. Configurar en Coolify + variables de entorno + webhook CMS
```

---

## Agentes

| Tarea | Agente | Fichero en ~/.claude/agents/ |
|---|---|---|
| Componentes Astro, layouts, rutas, rendimiento | Frontend Developer | `engineering-frontend-developer` |
| Diseño visual, sistema de diseño Tailwind | UI Designer | `design-ui-designer` |
| Identidad visual, paleta, tipografía | Brand Guardian | `design-brand-guardian` |
| Integración CMS, cliente API, queries | Backend Architect | `engineering-backend-architect` |
| Deploy Coolify, webhooks, variables de entorno | DevOps Automator | `engineering-devops-automator` |
| Copy páginas, textos | Content Creator | `marketing-content-creator` |
| SEO técnico, meta tags, sitemap, Core Web Vitals | Growth Hacker | `marketing-growth-hacker` |
| QA visual, verificación páginas | Evidence Collector | `testing-evidence-collector` |
| Certificación calidad, go/no-go producción | Reality Checker | `testing-reality-checker` |
| Arquitectura, decisiones técnicas, este doc | Senior Developer | `engineering-senior-developer` |

---

## Checklist antes de entregar al cliente

### Funcional
- [ ] Todas las rutas cargan sin errores 404
- [ ] Formularios de contacto enviando correctamente (si aplica)
- [ ] Contenido editable desde el CMS sin necesidad de deploy manual
- [ ] Webhook CMS → Coolify re-deploy automático verificado

### Técnico
- [ ] Variables de entorno en Coolify (no en código)
- [ ] SSL activo
- [ ] `site` configurado en `astro.config.mjs` con la URL real de producción
- [ ] Sitemap accesible en `/sitemap-index.xml`
- [ ] Robots.txt configurado

### Rendimiento y SEO
- [ ] Lighthouse > 90 en mobile
- [ ] Meta tags y OG en todas las páginas
- [ ] Imágenes usando `<Image />` de Astro (optimización automática)
- [ ] Sin JS innecesario en el cliente (revisar Astro islands)
- [ ] Google Search Console configurado y sitemap enviado

### Legal
- [ ] Aviso legal
- [ ] Política de privacidad
- [ ] Política de cookies + consentimiento RGPD

---

---

## CRM — Variables de entorno requeridas

```bash
# Webhook destino (Pipedrive / HubSpot / Make / n8n / etc.)
CRM_WEBHOOK_URL=https://hooks.example.com/leads

# Proveedor: 'pipedrive' | 'hubspot' | 'generic'  (default: generic)
CRM_PROVIDER=generic

# API key enviada como Bearer en el header Authorization (opcional)
CRM_API_KEY=sk-...

# Datos del negocio para los eventos iCalendar
BUSINESS_NAME=Mi Negocio
CONTACT_EMAIL=hola@minegocio.com

# Directorio donde se guardan los backups de leads (default: ./data)
# En Coolify: montar volumen persistente en este path
DATA_DIR=/data/leads
```

> ⚠️ Nunca en el código ni en git. Variables de producción en Coolify → Environment.

---

## Probar el endpoint `/api/lead` con curl

### Arrancar el servidor en local

```bash
npm run dev   # http://localhost:4321
```

### Lead básico

```bash
curl -s -X POST http://localhost:4321/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana García",
    "email": "ana@example.com",
    "phone": "612345678",
    "message": "Quiero información sobre vuestros servicios de fontanería."
  }' | jq .
```

### Lead con cita + attribution UTM

```bash
curl -s -X POST http://localhost:4321/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan López",
    "email": "juan@example.com",
    "phone": "698765432",
    "company": "Reformas JL",
    "message": "Me interesa el presupuesto para instalación completa.",
    "appointment": "2026-04-15T10:00:00+02:00",
    "source": "google",
    "medium": "cpc",
    "campaign": "fontaneros-madrid"
  }' | jq .
```

**Respuesta esperada (éxito):**

```json
{
  "ok": true,
  "data": {
    "id": "uuid-generado",
    "ics": "BEGIN:VCALENDAR...",
    "crm": null
  }
}
```

Si `CRM_WEBHOOK_URL` está configurado, `crm` tendrá `{ "sent": true, "provider": "generic" }`.

### Probar validación (debe devolver 422)

```bash
curl -s -X POST http://localhost:4321/api/lead \
  -H "Content-Type: application/json" \
  -d '{"name": "X", "email": "no-es-email", "message": "corto"}' | jq .
```

### Ver backup de leads

```bash
cat data/leads.jsonl | jq .
```

---

## Tracking UTM

El middleware `src/middleware.ts` detecta `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` y `gclid` en cualquier URL y los persiste en la cookie `_utm` (30 días, SameSite=Lax).

`LeadForm.astro` lee esa cookie automáticamente al enviar y añade los campos de attribution al payload del lead.

**Prueba manual:**

```
http://localhost:4321/?utm_source=facebook&utm_medium=social&utm_campaign=verano
```

Abre DevTools → Application → Cookies → busca `_utm`.

---

> Mantenido por el agente `engineering-senior-developer`. Actualizar cada vez que cambie el stack.
> Última revisión: 2026-03-08
