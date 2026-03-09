# STATE.md - StudioCode Agency

## Estado General
- **Mapeo de Base**: Completado (`/desarrollo/web-base/` y arquitectura mapeada).
- **Ecosistema de Agentes**: Configurado (Max, PM, Scout, Grant, Finance, Growth).
- **Reportes Activos**: Canales Discord conectados.
- **Rendimiento Base (studiocode.es)**: 65/100 (Necesita mejora en LCP y carga de JS).

## Proyectos Activos
- **web-negocio** (`proyectos/web-negocio/`): Init completado (2026-03-09). Stack: SvelteKit + Tailwind + Supabase + Resend. 6 milestones planificados. Elegible Kit Digital.

## Backlog de Trabajo

### Prioridad Alta (Sprints Inmediatos)
- [ ] **Optimización SEO/Performance**: Aplicar mejoras de Lighthouse a `web-base`.
    - Implementar componentes `Astro.Image` optimizados.
    - Implementar carga *lazy* para scripts de terceros.
- [ ] **CRM Integration (Fase 1 Web Negocio)**:
    - Crear `src/lib/crm.ts` para integración API CRM.
    - Crear `src/pages/api/lead.ts` (endpoint de captura).
- [ ] **Prospección Scout**: Arrancar búsqueda diaria de "gremios" en Corredor del Henares.

### Prioridad Media
- [ ] **Automatización de Propuestas**: Integrar `growth-hacker` con los leads capturados.
- [ ] **Sistema de Citas (iCalendar)**: Sincronización en `tienda-base`.

### Pendiente / Ideas
- [ ] Automatización de reportes financieros mensuales.
- [ ] Sincronización con Zapier para leads multicanal.
