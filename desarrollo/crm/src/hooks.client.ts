import type { HandleClientError } from '@sveltejs/kit';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';

// ── Sentry (client) ───────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Sentry: any = null;

async function initSentry() {
	if (!PUBLIC_SENTRY_DSN || Sentry) return;
	try {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore — optional peer dependency
		Sentry = await import('@sentry/sveltekit');
		Sentry.init({
			dsn: PUBLIC_SENTRY_DSN,
			tracesSampleRate: 0.1,
			environment: import.meta.env.MODE ?? 'development',
			// No enviar errores de extensiones del navegador
			ignoreErrors: [/chrome-extension/, /extensions\//]
		});
	} catch {
		// Sentry no disponible: continúa sin él
	}
}

void initSentry();

// ── Error handler ─────────────────────────────────────────────────────────────

export const handleError: HandleClientError = async ({ error, status }) => {
	if (status === 404) return { message: 'Página no encontrada.' };

	const id = crypto.randomUUID();
	console.error(`[${id}] Client error:`, error);

	if (Sentry) {
		Sentry.captureException(error, { extra: { errorId: id } });
	}

	return { message: 'Ha ocurrido un error inesperado.', errorId: id };
};
