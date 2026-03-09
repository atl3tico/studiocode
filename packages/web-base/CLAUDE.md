# CLAUDE.md — Web Negocio + CRM (SaaS Base)

> Stack de referencia para la oferta "Web Negocio + CRM". 
> Proporciona una plataforma de alto rendimiento que integra gestión de leads, citas y automatización de marketing.

## Stack tecnológico

- **Framework:** SvelteKit 5 (SSR + Hydration)
- **UI:** Tailwind CSS v4 + Shadcn Svelte
- **Gestión de Leads/CRM:** 
  - Integración vía `ofetch` con CRM externo (Pipedrive/HubSpot).
  - Webhooks para captura de datos en tiempo real.
- **Gestión de Citas:** 
  - Embebido nativo de Cal.com (API Key vía `.env`).
- **Deploy:** Coolify (Node.js adapter) + GitHub Pages (static previews).

---

## Estructura del repositorio

```
packages/web-base/
├── src/
│   ├── components/        ← Shadcn Svelte UI
│   ├── routes/
│   │   ├── api/lead.ts    ← Endpoint de captura de leads
│   │   └── +page.svelte   ← Landing con formulario + Cal.com
│   ├── lib/
│   │   ├── crm.ts         ← Cliente de API para CRM
│   │   ├── events.ts      ← Tracking de conversión (UTM/Referer)
│   │   └── cal-embed.ts   ← Lógica de integración Cal.com
│   └── styles/
│       └── global.css
├── .env.local             ← CRM_API_KEY, CAL_EMBED_URL
└── astro.config.mjs
```

---

## Funcionalidades principales

1. **Captura inteligente**: El formulario (`LeadForm`) captura `utm_source` y `referer` automáticamente y los envía al CRM junto con el contacto.
2. **Reserva automática**: Embebido de Cal.com con reserva que dispara confirmación por email.
3. **Automatización**: Los leads se registran en el CRM y disparan una secuencia de emails bonitos vía Resend/Brevo.

---

## Comandos para Agentes (GSD)

Invoca a los agentes con estas tareas:

- **Estructura CRM:** `claude 'Implementa src/lib/crm.ts para Pipedrive usando ofetch'`
- **Formulario Leads:** `claude 'Crea LeadForm.svelte con validación Zod y POST a /api/lead'`
- **Tracking:** `claude 'Implementa src/lib/events.ts para capturar UTMs y guardarlos en cookie'`
- **Despliegue:** `claude 'Verifica config de GitHub Actions para el deploy'`

---

## Checklist de lanzamiento (Web Negocio)

- [ ] API Key del CRM configurada en Coolify.
- [ ] Cal.com configurado y embebido con ID de usuario.
- [ ] Email de confirmación de lead configurado en Resend.
- [ ] Analytics/Tracking de leads operativo.
