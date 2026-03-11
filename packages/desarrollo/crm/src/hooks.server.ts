import { sequence } from '@sveltejs/kit/hooks';
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { SENTRY_DSN } from '$env/static/private';

// ── Sentry (server) ──────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Sentry: any = null;

async function initSentry() {
	if (!SENTRY_DSN || Sentry) return;
	try {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore — optional peer dependency
		Sentry = await import('@sentry/sveltekit');
		Sentry.init({
			dsn: SENTRY_DSN,
			tracesSampleRate: 0.2,
			environment: process.env.NODE_ENV ?? 'development'
		});
	} catch {
		// Sentry no instalado: continúa sin él
	}
}

void initSentry();

// ── Rate limiting ─────────────────────────────────────────────────────────────

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minuto
const RATE_LIMIT_MAX = 5; // peticiones máximas por ventana

interface RateEntry {
	count: number;
	resetAt: number;
}

const rateLimitStore = new Map<string, RateEntry>();

/** Extrae la IP más fiable posible de la request. */
function getClientIp(request: Request): string {
	return (
		request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
		request.headers.get('x-real-ip') ??
		'unknown'
	);
}

const API_RATE_LIMITED_PATHS = ['/api/lead', '/api/cita'];

function checkRateLimit(ip: string): { limited: boolean; retryAfter: number } {
	const now = Date.now();
	const entry = rateLimitStore.get(ip);

	if (!entry || now >= entry.resetAt) {
		rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
		return { limited: false, retryAfter: 0 };
	}

	entry.count++;
	if (entry.count > RATE_LIMIT_MAX) {
		const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
		return { limited: true, retryAfter };
	}

	return { limited: false, retryAfter: 0 };
}

// Limpiar entradas expiradas cada 5 minutos
setInterval(
	() => {
		const now = Date.now();
		for (const [key, entry] of rateLimitStore) {
			if (now >= entry.resetAt) rateLimitStore.delete(key);
		}
	},
	5 * 60_000
);

// ── Security headers ──────────────────────────────────────────────────────────

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? '').split(',').filter(Boolean);

/**
 * CSP restrictiva adecuada para SvelteKit + Tailwind + Plausible.
 * Ajustar los dominios de 'script-src' si se usa otro CDN o analytics.
 */
const CSP =
	[
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline' https://plausible.io",
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: https:",
		"font-src 'self'",
		"connect-src 'self' https://plausible.io https://*.sentry.io",
		"frame-ancestors 'none'",
		"base-uri 'self'",
		"form-action 'self'"
	].join('; ') + ';';

const securityHeaders: Record<string, string> = {
	'Content-Security-Policy': CSP,
	'X-Frame-Options': 'DENY',
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
	'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};

// ── Handles ───────────────────────────────────────────────────────────────────

const handleSecurity: Handle = async ({ event, resolve }) => {
	const { request, url } = event;

	// CORS para rutas /api/*
	const origin = request.headers.get('origin') ?? '';
	const isApiRoute = url.pathname.startsWith('/api/');

	if (isApiRoute && request.method === 'OPTIONS') {
		const corsHeaders: Record<string, string> = {
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			'Access-Control-Max-Age': '86400'
		};
		if (ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.length === 0) {
			corsHeaders['Access-Control-Allow-Origin'] = origin || '*';
		}
		return new Response(null, { status: 204, headers: corsHeaders });
	}

	// Rate limiting para endpoints críticos
	if (API_RATE_LIMITED_PATHS.some((p) => url.pathname.startsWith(p))) {
		const ip = getClientIp(request);
		const { limited, retryAfter } = checkRateLimit(ip);

		if (limited) {
			return new Response(
				JSON.stringify({ success: false, error: 'Demasiadas peticiones. Inténtalo más tarde.' }),
				{
					status: 429,
					headers: {
						'Content-Type': 'application/json',
						'Retry-After': String(retryAfter)
					}
				}
			);
		}
	}

	const response = await resolve(event);

	// Cabeceras de seguridad en todas las respuestas
	for (const [key, value] of Object.entries(securityHeaders)) {
		response.headers.set(key, value);
	}

	// CORS en respuestas API normales
	if (isApiRoute && (ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.length === 0)) {
		response.headers.set('Access-Control-Allow-Origin', origin || '*');
	}

	return response;
};

export const handle: Handle = sequence(handleSecurity);

// ── Error handler ─────────────────────────────────────────────────────────────

export const handleError: HandleServerError = async ({ error, event }) => {
	const id = crypto.randomUUID();
	console.error(`[${id}] Unhandled server error at ${event.url.pathname}:`, error);

	if (Sentry) {
		Sentry.captureException(error, { extra: { errorId: id, path: event.url.pathname } });
	}

	return {
		message: 'Ha ocurrido un error inesperado.',
		errorId: id
	};
};
