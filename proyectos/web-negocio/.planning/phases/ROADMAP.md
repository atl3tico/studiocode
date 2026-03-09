# Roadmap — Web Negocio Base

## Milestone 1: Scaffolding Base
**Goal**: Proyecto SvelteKit funcional con Tailwind, estructura de rutas y deploy básico.

### Fase 1.1 — Init & Config
- [ ] `npx sv create` con TypeScript + Tailwind
- [ ] Configurar ESLint + Prettier
- [ ] `.env.example` con todas las variables necesarias
- [ ] Adaptar `svelte.config.js` para Vercel o Fly.io

### Fase 1.2 — Layout & Landing
- [ ] Layout principal con nav, footer y SEO meta tags
- [ ] Página home con secciones: Hero, Servicios, Contacto
- [ ] Componentes UI base: Button, Input, Card
- [ ] Integración Tailwind + tipografía custom

### Fase 1.3 — Deploy inicial
- [ ] Repo GitHub creado (privado)
- [ ] CI/CD con GitHub Actions → Vercel
- [ ] Dominio configurado con SSL
- [ ] Lighthouse check: Performance ≥ 80

---

## Milestone 2: Captura de Leads
**Goal**: Formulario + API + almacenamiento + notificación.

### Fase 2.1 — API Lead
- [ ] Crear `src/routes/api/lead/+server.ts`
- [ ] Validación con Zod
- [ ] Conexión Supabase/PocketBase
- [ ] Email de confirmación (Resend)

### Fase 2.2 — Frontend LeadForm
- [ ] Componente `LeadForm.svelte` accesible
- [ ] Estados: idle / loading / success / error
- [ ] RGPD: checkbox política de privacidad

---

## Milestone 3: Módulo de Citas
**Goal**: Reserva de citas con confirmación iCal y recordatorios.

### Fase 3.1 — Slot picker & API
- [ ] `src/lib/cal.ts`: generación .ics
- [ ] `src/routes/api/cita/+server.ts`
- [ ] Almacenamiento slots + citas en DB

### Fase 3.2 — Recordatorios automáticos
- [ ] Cron job T-24h (Vercel cron / Fly cron)
- [ ] Email recordatorio con opción de cancelación

---

## Milestone 4: CRM Dashboard (admin)
**Goal**: Panel protegido para ver, gestionar y exportar leads y citas.

### Fase 4.1 — Auth
- [ ] Lucia Auth v3: login/logout admin
- [ ] Protección de rutas `/admin/*`

### Fase 4.2 — Panel leads
- [ ] Tabla de leads con filtro y búsqueda
- [ ] Estados: Nuevo / Contactado / Cerrado / Perdido
- [ ] Exportar CSV

### Fase 4.3 — Panel citas
- [ ] Vista calendario (mes/semana)
- [ ] Cancelar / reagendar cita

---

## Milestone 5: Kit Digital & Documentación
**Goal**: Todo documentado y auditable para la justificación Kit Digital.

- [ ] Checklist Kit Digital completo y firmado
- [ ] Manual de usuario (Notion / PDF)
- [ ] Informe Lighthouse final
- [ ] Plantilla contrato prestación de servicios

---

## Milestone 6: Hardening & Monitoring
- [ ] CSP, rate-limiting, CORS
- [ ] Sentry integrado
- [ ] Uptime monitor (BetterUptime / UptimeRobot)
- [ ] Plausible analytics activo con consentimiento
