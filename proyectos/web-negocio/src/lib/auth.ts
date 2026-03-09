/**
 * auth.ts — Autenticación simple para el panel admin.
 *
 * Usa una cookie de sesión firmada con un secreto de entorno.
 * Para producción real, migrar a Lucia Auth o Supabase Auth.
 *
 * Variable de entorno requerida:
 *   ADMIN_PASSWORD — contraseña del panel
 *   ADMIN_SECRET   — secreto para firmar el token (min 32 chars)
 */

import { ADMIN_PASSWORD, ADMIN_SECRET } from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';

const COOKIE_NAME = 'admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 horas

/**
 * Genera un token de sesión simple (HMAC-like con crypto.subtle).
 */
async function signToken(payload: string): Promise<string> {
	const encoder = new TextEncoder();
	const keyData = encoder.encode(ADMIN_SECRET);
	const data = encoder.encode(payload);

	const key = await crypto.subtle.importKey(
		'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
	);
	const signature = await crypto.subtle.sign('HMAC', key, data);
	const sigHex = Array.from(new Uint8Array(signature))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');

	return `${payload}.${sigHex}`;
}

/**
 * Verifica que el token de sesión sea válido.
 */
async function verifyToken(token: string): Promise<boolean> {
	const [payload] = token.split('.');
	if (!payload) return false;
	const expected = await signToken(payload);
	return token === expected;
}

/**
 * Comprueba si la contraseña es correcta y establece la cookie.
 */
export async function login(password: string, cookies: Cookies): Promise<boolean> {
	if (password !== ADMIN_PASSWORD) return false;

	const payload = `admin:${Date.now()}`;
	const token = await signToken(payload);

	cookies.set(COOKIE_NAME, token, {
		path: '/admin',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: COOKIE_MAX_AGE
	});

	return true;
}

/**
 * Cierra la sesión eliminando la cookie.
 */
export function logout(cookies: Cookies): void {
	cookies.delete(COOKIE_NAME, { path: '/admin' });
}

/**
 * Comprueba si la petición tiene sesión admin válida.
 */
export async function isAuthenticated(cookies: Cookies): Promise<boolean> {
	const token = cookies.get(COOKIE_NAME);
	if (!token) return false;
	try {
		return await verifyToken(token);
	} catch {
		return false;
	}
}
