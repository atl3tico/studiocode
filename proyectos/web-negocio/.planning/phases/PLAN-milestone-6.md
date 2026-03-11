# PLAN — Milestone 6: Hardening & Monitoring

## Goal
Securizar la aplicación con cabeceras HTTP correctas, rate-limiting en APIs, integración de Sentry para monitorización de errores, Plausible para analytics con consentimiento RGPD, y guía de uptime monitoring.

## Tasks

### 6.1 — Security Headers (CSP, CORS, HSTS)
- [x] Crear `src/hooks.server.ts` con handle hook
- [x] Content-Security-Policy restrictiva (whitelist de dominios necesarios)
- [x] X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS
- [x] CORS sólo para orígenes autorizados en `/api/*`

### 6.2 — Rate Limiting
- [x] Rate limiter en memoria (Map + sliding window) para `/api/lead` y `/api/cita`
- [x] Límite: 5 req/min por IP, responde 429 con Retry-After
- [x] Extracción robusta de IP (x-forwarded-for → x-real-ip → remoteAddress)

### 6.3 — Sentry
- [x] `src/hooks.server.ts`: Sentry.init() server-side + handleErrorWithSentry
- [x] `src/hooks.client.ts`: Sentry.init() client-side + handleErrorWithSentry
- [x] Variables env: `SENTRY_DSN`, `PUBLIC_SENTRY_DSN`

### 6.4 — Plausible Analytics + Cookie Consent
- [x] Script Plausible en `+layout.svelte` (carga sólo con consentimiento)
- [x] Componente `CookieBanner.svelte`: acepta / rechaza analytics
- [x] Consentimiento persistido en localStorage

### 6.5 — Uptime Monitor
- [x] Crear `docs/uptime-monitor.md` con instrucciones UptimeRobot / BetterUptime
- [x] Endpoint de health check `src/routes/api/health/+server.ts`

### 6.6 — Actualizar estado del proyecto
- [x] `.env.example` con todas las variables nuevas
- [x] `PROJECT.md`: marcar M6 como completado

## Verification
- `src/hooks.server.ts` emite cabeceras CSP, CORS y HSTS en todas las respuestas
- `/api/lead` devuelve 429 tras 5 req/min desde la misma IP
- Sentry captura errores sin exponer DSN en cliente (usa PUBLIC_SENTRY_DSN)
- Layout sólo carga Plausible tras aceptar cookies
- `/api/health` devuelve 200 JSON
