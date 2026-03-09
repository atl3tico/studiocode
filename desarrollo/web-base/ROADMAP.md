# Roadmap: Web Negocio + CRM (SaaS)
# Objetivo: Sistema de captura de leads y gestión de citas (iCalendar + Recordatorios).

## Fase 1: Core de Gestión de Leads y Citas
- Configuración de base Astro + Zod (validación).
- Componente `LeadForm`: Captura de datos con validación estricta.
- Endpoint de API: Procesador de leads (integración con CRM / Webhooks).
- Integración iCalendar: Generación de .ics dinámicos para citas.

## Fase 2: Automatización y Recordatorios
- Sistema de Webhooks para envío de emails automáticos (Resend / Brevo).
- Panel de control básico (Dashboard): Visión general de próximos eventos/citas.
- Sincronización bidireccional básica (Google Calendar).

## Fase 3: SEO Local y Conversión
- Optimización de Core Web Vitals (Lighthouse > 90).
- Estrategia de SEO Local (Local Business Schema).
- Automatización de despliegue en GitHub Pages.

## Definición de Hecho (Milestone Complete)
- La web recibe un lead -> entra en CRM -> dispara email de confirmación -> añade cita a iCalendar -> todo en < 2 segundos.
