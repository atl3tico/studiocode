# Web Negocio — Proyecto Base (Kit Digital)

## Visión
Plantilla de "Web Negocio + CRM" reutilizable para clientes PYME.
Elegible como solución **Kit Digital** (Segmento I, II y III).

## Modelo de Negocio
- **Ingresos**: Pago único por desarrollo + Suscripción mensual (gestión de leads/citas).
- **Precio orientativo**: 3.000–6.000€ desarrollo + 49–149€/mes.

## Stack Técnico
- **Frontend**: SvelteKit + Tailwind CSS
- **Backend/CRM**: API REST interna + integración opcional Medusa / HubSpot / Notion
- **DB**: Supabase (PostgreSQL) o PocketBase (self-hosted)
- **Despliegue**: Vercel / Fly.io
- **Auth**: Lucia Auth o Supabase Auth

## Requisitos Kit Digital (Solución "Presencia Avanzada")
- [ ] Dominio propio incluido (12 meses mínimo)
- [ ] Hosting gestionado (12 meses mínimo)
- [ ] Diseño responsive y accesible (WCAG 2.1 AA)
- [ ] SEO on-page básico (meta tags, sitemap, robots.txt)
- [ ] Panel de gestión de leads / formularios de contacto
- [ ] Integración con herramienta de citas (iCalendar / Calendly API)
- [ ] RGPD: política de privacidad, aviso legal, cookies
- [ ] Análitica básica (Plausible / GA4)

## Milestones Planificados
| # | Milestone | Estado |
|---|-----------|--------|
| 1 | Scaffolding base SvelteKit + Tailwind | ✅ Completado |
| 2 | Sistema de captura y gestión de leads | ✅ Completado |
| 3 | Módulo de citas (iCal + recordatorios) | ✅ Completado |
| 4 | Dashboard CRM básico (admin panel) | ✅ Completado |
| 5 | Kit Digital: documentación y checklist | ✅ Completado |
| 6 | Deploy, dominio, SSL, monitorización | ✅ Completado |

## Arquitectura de Carpetas (objetivo)
```
web-negocio/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte       # Shell principal
│   │   ├── +page.svelte         # Home / Landing
│   │   ├── api/
│   │   │   ├── lead/+server.ts  # Endpoint captura leads
│   │   │   └── cita/+server.ts  # Endpoint reserva citas
│   │   └── admin/               # CRM Dashboard (protegido)
│   ├── lib/
│   │   ├── crm.ts               # Lógica CRM / Medusa
│   │   ├── email.ts             # Plantillas y envío (Resend)
│   │   ├── cal.ts               # iCalendar utils
│   │   └── auth.ts              # Auth (Lucia / Supabase)
│   ├── components/
│   │   ├── ui/                  # Primitivos (Button, Input…)
│   │   ├── forms/               # LeadForm, ContactForm
│   │   └── admin/               # Tablas CRM, Calendarios
│   └── stores/
│       └── leads.ts             # Estado global leads
├── docs/
│   ├── kit-digital-checklist.md
│   └── arquitectura.md
├── tests/
└── .planning/
    ├── research/
    └── phases/
```

## Equipo
- **Max**: Coordinación y decisiones de arquitectura.
- **PM**: Fases y tareas (canal #progreso-web).
- **Dev**: Implementación SvelteKit.
- **Growth Hacker**: Copy y formularios de conversión.
