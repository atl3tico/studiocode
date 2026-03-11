# Arquitectura — Web Negocio Base

## Principios de diseño
1. **Simplicidad**: mínimo de dependencias externas; todo lo gestionable por el cliente.
2. **Rendimiento**: SSR + hydración selectiva (SvelteKit islands-friendly).
3. **Vendor-neutral**: adaptadores para Supabase, PocketBase o Medusa según cliente.
4. **Seguridad por defecto**: CSRF, rate-limiting en API routes, auth con JWT httpOnly.

## Flujo de datos — Captura de Lead

```
Visitante → LeadForm (SvelteKit) → POST /api/lead
   → Validación Zod
   → INSERT leads (Supabase/PocketBase)
   → Email confirmación (Resend)
   → Notificación admin (Discord Webhook / email)
   → Respuesta 201 JSON
```

## Flujo de datos — Reserva de Cita

```
Cliente → CalWidget → POST /api/cita
   → Verificar disponibilidad (slot libre en DB)
   → INSERT citas (DB)
   → Generar .ics (iCalendar)
   → Email con .ics adjunto (cliente + negocio)
   → Recordatorio T-24h (cron job)
```

## Seguridad
- **Auth admin**: Lucia Auth v3 con sesiones httpOnly.
- **API Routes**: middleware de autenticación + rate-limit (upstash/ratelimit).
- **Env secrets**: `.env` nunca commiteado; usar secrets del hosting.
- **CSP**: Content-Security-Policy header en `hooks.server.ts`.

## Observabilidad
- **Errores**: Sentry (free tier).
- **Logs**: consola + Fly.io / Vercel logs.
- **Analítica**: Plausible (self-hosted o cloud €9/mes).

## Decisiones de infraestructura por cliente
| Tipo cliente | DB | Hosting | Auth |
|--------------|----|---------|------|
| Pequeño (0-2) | PocketBase (self) | Fly.io | Lucia |
| Mediano (3-9) | Supabase free | Vercel | Supabase Auth |
| Grande (10-50)| Supabase Pro | Vercel/Fly | Supabase Auth |
