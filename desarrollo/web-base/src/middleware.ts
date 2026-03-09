/**
 * Middleware de tracking UTM
 *
 * En cada request:
 *  - Si la URL contiene parámetros utm_* o gclid, los persiste en la cookie `_utm`
 *  - La cookie dura 30 días y es accesible desde JS (no httpOnly) para que
 *    LeadForm.astro la lea y la incluya en el payload de /api/lead
 */
import { defineMiddleware } from 'astro:middleware'

const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'] as const

const COOKIE_NAME = '_utm'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 días

export const onRequest = defineMiddleware((context, next) => {
  const url = context.url
  const params = url.searchParams

  // Comprobar si hay parámetros UTM en la URL actual
  const hasUtm = UTM_PARAMS.some((p) => params.has(p))

  if (hasUtm) {
    // Construir objeto de attribution
    const utm: Record<string, string> = {}
    if (params.get('utm_source')) utm.source = params.get('utm_source')!
    if (params.get('utm_medium')) utm.medium = params.get('utm_medium')!
    if (params.get('utm_campaign')) utm.campaign = params.get('utm_campaign')!
    if (params.get('utm_term')) utm.term = params.get('utm_term')!
    if (params.get('utm_content')) utm.content = params.get('utm_content')!
    if (params.get('gclid')) utm.gclid = params.get('gclid')!
    utm.landed_at = new Date().toISOString()

    const cookieValue = encodeURIComponent(JSON.stringify(utm))

    // Adjuntar la cookie en la respuesta
    context.locals.utmCookie = `${COOKIE_NAME}=${cookieValue}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`
  }

  return next().then((response) => {
    const cookie = (context.locals as Record<string, string>).utmCookie
    if (cookie) {
      response.headers.append('Set-Cookie', cookie)
    }
    return response
  })
})
