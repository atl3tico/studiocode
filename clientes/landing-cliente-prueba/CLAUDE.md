# CLAUDE.md — Landing Base (Astro + Tailwind)

> Stack para landing pages individuales, alta conversión, una sola página o navegación sencilla.
> Basada en la estructura de `web-base`, optimizada para velocidad de carga y SEO local/conversión.

---

## Cuándo usar este stack

- Landing pages para campañas de marketing (PPC, redes sociales)
- Formularios de captura de leads
- Sitios de una sola página (One-page)
- Proyectos donde la velocidad de desarrollo debe ser mínima

## Stack tecnológico

- **Framework:** Astro 5
- **Estilos:** Tailwind CSS v4
- **Formularios:** Integración con servicios externos (ej. Formspree o Hook)
- **Deploy:** Coolify (Static Site)

---

## Estructura del repositorio

```
landing-base/
├── src/
│   ├── components/        ← secciones de la landing (Hero, Features, Pricing, Form)
│   ├── layouts/           ← Layout.astro
│   ├── pages/
│   │   └── index.astro    ← página única
│   └── styles/
│       └── global.css
├── public/                ← optimización de assets
├── astro.config.mjs
└── .env.local
```

---

## Comandos esenciales

```bash
npm run dev          # local :4321
npm run build        # build estático
npm run preview      # previsualizar
```

---

## checklist de lanzamiento

- [ ] Meta tags, Open Graph (imagen creada específicamente para la campaña)
- [ ] Analytics (Pixel de Meta / GA4) configurado con consentimiento cookies
- [ ] Todos los enlaces de CTA funcionan
- [ ] Email del formulario de contacto configurado y probado
- [ ] Optimización de imágenes (WebP)
- [ ] Sitemap incluido

---

> Mantenido por `engineering-senior-developer`.
> Última revisión: 2026-03-06
