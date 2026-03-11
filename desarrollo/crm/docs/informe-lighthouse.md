# Informe Lighthouse — Web Negocio

> Plantilla para el informe de auditoría técnica requerido por Kit Digital.
> Completar con los valores reales obtenidos tras el despliegue en producción.

---

## Datos del proyecto

| Campo              | Valor                              |
|--------------------|------------------------------------|
| URL auditada       | `https://[DOMINIO]`                |
| Fecha de auditoría | [FECHA]                            |
| Versión del sitio  | [TAG_GIT o número de versión]      |
| Herramienta        | Google Lighthouse v12 (Chrome DevTools / PageSpeed Insights) |
| Dispositivo        | Mobile + Desktop                   |

---

## Umbrales mínimos Kit Digital

| Categoría     | Mínimo requerido | Obtenido (Mobile) | Obtenido (Desktop) | ¿Cumple? |
|---------------|:-----------------:|:-----------------:|:------------------:|:--------:|
| Performance   | ≥ 80             | —                 | —                  | —        |
| Accessibility | ≥ 90             | —                 | —                  | —        |
| Best Practices| ≥ 90             | —                 | —                  | —        |
| SEO           | ≥ 90             | —                 | —                  | —        |

> Criterio de aprobación: todas las categorías deben superar el umbral mínimo en **ambos dispositivos**.

---

## Cómo ejecutar la auditoría

### Opción A — PageSpeed Insights (recomendado para captura de pantalla oficial)
1. Ve a [pagespeed.web.dev](https://pagespeed.web.dev).
2. Introduce la URL del sitio en producción.
3. Haz clic en **"Analyze"**.
4. Adjunta capturas de pantalla de los resultados Mobile y Desktop.

### Opción B — Chrome DevTools
1. Abre Chrome en modo incógnito.
2. Ve a la URL del sitio.
3. Abre DevTools (F12) → pestaña **Lighthouse**.
4. Selecciona: ☑ Performance ☑ Accessibility ☑ Best practices ☑ SEO.
5. Genera el informe para **Mobile** y para **Desktop** por separado.
6. Exporta cada informe como HTML o JSON y adjúntalo a este documento.

---

## Resultados obtenidos

### Mobile
```
Performance:    [__] / 100
Accessibility:  [__] / 100
Best Practices: [__] / 100
SEO:            [__] / 100
```

> Adjuntar captura: `lighthouse-mobile.png`

### Desktop
```
Performance:    [__] / 100
Accessibility:  [__] / 100
Best Practices: [__] / 100
SEO:            [__] / 100
```

> Adjuntar captura: `lighthouse-desktop.png`

---

## Métricas Core Web Vitals (Mobile)

| Métrica | Valor obtenido | Umbral "Good" | Estado |
|---------|:--------------:|:-------------:|:------:|
| LCP (Largest Contentful Paint) | — | ≤ 2,5 s | — |
| INP (Interaction to Next Paint) | — | ≤ 200 ms | — |
| CLS (Cumulative Layout Shift)   | — | ≤ 0,1   | — |

---

## Observaciones y acciones correctivas

*(Rellenar si alguna puntuación no alcanza el umbral. Indicar la acción tomada y la fecha de re-auditoría.)*

| Problema detectado | Categoría | Prioridad | Acción tomada | Fecha corrección |
|--------------------|-----------|-----------|---------------|-----------------|
| —                  | —         | —         | —             | —               |

---

## Firma del técnico responsable

| Campo         | Valor           |
|---------------|-----------------|
| Nombre        | [NOMBRE_TECNICO] |
| Empresa       | [NOMBRE_AGENCIA] |
| Fecha         | [FECHA]          |
| Firma digital | —                |
