import { json, type RequestHandler } from '@sveltejs/kit';

/**
 * GET /api/health — Health check endpoint para uptime monitors.
 * Retorna 200 + JSON con estado y timestamp.
 */
export const GET: RequestHandler = () => {
	return json({
		status: 'ok',
		timestamp: new Date().toISOString(),
		version: process.env.npm_package_version ?? 'unknown'
	});
};
