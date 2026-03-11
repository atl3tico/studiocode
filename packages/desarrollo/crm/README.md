# web-negocio — Base Template

> Plantilla StudioCode para proyectos "Web Negocio + CRM".
> Stack: SvelteKit + Tailwind + Supabase/PocketBase + Resend.
> Elegible para Kit Digital (Segmentos I, II, III).

## Inicio rápido (para desarrollo)

```bash
# 1. Clonar / copiar esta base
cp -r proyectos/web-negocio mi-cliente

# 2. Instalar dependencias
cd mi-cliente && npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales reales

# 4. Arrancar en desarrollo
npm run dev
```

## Documentación
- [PROJECT.md](./PROJECT.md) — Visión, modelo de negocio, milestones.
- [docs/arquitectura.md](./docs/arquitectura.md) — Decisiones técnicas.
- [docs/kit-digital-checklist.md](./docs/kit-digital-checklist.md) — Requisitos Kit Digital.
- [.planning/phases/ROADMAP.md](./.planning/phases/ROADMAP.md) — Roadmap completo por fases.

## Variables de entorno necesarias

```env
# DB
DATABASE_URL=

# Auth
AUTH_SECRET=

# Email (Resend)
RESEND_API_KEY=
RESEND_FROM=noreply@tudominio.com

# Notificaciones
DISCORD_WEBHOOK_URL=

# Analytics
PLAUSIBLE_DOMAIN=
```
