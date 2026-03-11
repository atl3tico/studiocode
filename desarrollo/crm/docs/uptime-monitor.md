# Uptime Monitor — Guía de Configuración

## Endpoint de Health Check

La aplicación expone un endpoint dedicado para monitorización:

```
GET /api/health
```

Respuesta exitosa (200):
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:00:00.000Z",
  "version": "0.1.0"
}
```

---

## Opción A — UptimeRobot (gratuito)

1. Crear cuenta en [uptimerobot.com](https://uptimerobot.com)
2. **New Monitor** → tipo: **HTTP(s)**
3. Configuración:
   - **URL**: `https://tudominio.com/api/health`
   - **Monitoring Interval**: 5 minutos
   - **Monitor Timeout**: 30 segundos
   - **HTTP Method**: GET
   - **Keyword monitoring**: activar, buscar `"status":"ok"`
4. Alertas: configurar email y/o Slack/Telegram

---

## Opción B — BetterUptime (recomendado para clientes Kit Digital)

1. Crear cuenta en [betterstack.com/better-uptime](https://betterstack.com/better-uptime)
2. **New Monitor** → tipo: **HTTP**
3. Configuración:
   - **URL**: `https://tudominio.com/api/health`
   - **Check frequency**: 3 minutos
   - **Recovery period**: 2 checks
   - **Confirmation period**: 1 check
4. Crear una **Status Page** pública para transparencia con el cliente:
   - Añadir el monitor a la status page
   - URL: `https://status.tudominio.com`
5. **On-call** escalation: email principal → email backup → SMS

---

## Variables de entorno requeridas

No se necesitan variables adicionales para el health check.
El monitor externo sólo necesita acceso HTTP/HTTPS al dominio.

---

## SLA recomendado para Kit Digital

| Métrica       | Objetivo |
|---------------|----------|
| Disponibilidad | ≥ 99.5% mensual |
| Tiempo de respuesta p95 | < 2 s |
| Tiempo de resolución incidencia crítica | < 4 h |

---

## Integración con Sentry (alertas de errores)

Además del uptime monitor, Sentry proporciona alertas de errores en tiempo real.
Configurar en Sentry Dashboard → **Alerts** → **Create Alert Rule**:

- Evento: `error.count > 5 en 5 minutos`
- Acción: Email + Slack
