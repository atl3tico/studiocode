# Checklist Kit Digital — Web Negocio

> Referencia: Bases reguladoras Kit Digital (BOE 2022 y actualizaciones 2024).
> Solución aplicable: **Sitio Web y Presencia en Internet** + **Gestión de Clientes**.
>
> Leyenda: ✅ Implementado | ⚙️ Requiere config en despliegue | ❌ Pendiente

## Segmentos elegibles
| Segmento | Empleados | Ayuda máxima |
|----------|-----------|--------------|
| I        | 10–50     | 12.000€      |
| II       | 3–9       | 6.000€       |
| III      | 0–2       | 2.000€       |

## Requisitos obligatorios

- ⚙️ **Dominio propio** registrado a nombre del beneficiario (mínimo 12 meses).
  - Pendiente: contratar dominio y apuntar DNS al hosting.
- ⚙️ **Hosting** con disponibilidad ≥ 99% (mínimo 12 meses).
  - Pendiente: desplegar en Vercel / Fly.io con SLA documentado.
- ✅ **Diseño responsive** (móvil, tablet, escritorio).
  - Implementado con Tailwind CSS v4; breakpoints `sm`, `md`, `lg`, `xl`.
- ⚙️ **Accesibilidad** WCAG 2.1 nivel AA.
  - Base implementada (semántica HTML, contraste). Validar con axe-core en despliegue.
- ✅ **SEO básico**: title, meta description, H1 único.
  - `+layout.svelte` incluye `<svelte:head>` con title y description.
  - ⚙️ `sitemap.xml` y `robots.txt`: generar en build o añadir ruta estática.
- ⚙️ **RGPD**: Política de privacidad, Aviso legal, banner cookies (IAB TCF v2.2).
  - Pendiente: añadir páginas `/privacidad`, `/aviso-legal` y componente `CookieBanner`.
- ✅ **Formulario de contacto / captura de leads** con confirmación por email.
  - `POST /api/lead` → Supabase → email vía Resend. Validación Zod.
- ⚙️ **Analítica**: integración GA4 o Plausible con consentimiento.
  - Pendiente: añadir snippet Plausible/GA4 condicionado al consentimiento de cookies.
- ✅ **Panel de gestión** accesible para el cliente (documentado).
  - `/admin` protegido con sesión HMAC httpOnly. Tablas de leads y citas.

## Requisitos opcionales (diferenciadores)

- ✅ **Sistema de citas online** con confirmación .ics y recordatorio T-24h (VALARM en iCal).
- ✅ **Integración CRM** (pipeline de leads: `new → contacted → qualified → lost → won`).
- ❌ Facturación / presupuestos automatizados.
- ❌ Chat en tiempo real.

## Documentación entregable al cliente

- ✅ Manual de usuario del panel CRM → `docs/manual-usuario.md`
- ⚙️ Credenciales de acceso → entregar por canal seguro (1Password / Bitwarden).
- ⚙️ Certificado de despliegue (URL + SSL verificado) → generar tras go-live.
- ⚙️ Informe Lighthouse final (≥ 80 en Performance, Accessibility, SEO) → `docs/informe-lighthouse.md`
- ✅ Contrato de prestación de servicios → `docs/contrato-prestacion-servicios.md`
