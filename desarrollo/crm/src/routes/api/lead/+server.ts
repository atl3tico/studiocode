/**
 * POST /api/lead — Captura un nuevo lead desde cualquier formulario.
 *
 * Body JSON esperado:
 *   { name, email, phone?, message?, source? }
 *
 * Respuestas:
 *   201  { success: true, id }
 *   400  { success: false, error }
 *   409  { success: false, error }   (email duplicado)
 *   500  { success: false, error }
 */

import { json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import { createLead, leadExistsByEmail } from '$lib/crm';
import { sendLeadNotification } from '$lib/email';

// ── Validation schema ────────────────────────────────────────────────────────

const LeadSchema = z.object({
	name: z.string().min(2, 'El nombre es demasiado corto').max(100),
	email: z.string().email('Email no válido').max(200),
	phone: z.string().max(20).optional(),
	message: z.string().max(1000).optional(),
	source: z.string().max(50).optional().default('web')
});

// ── Handler ──────────────────────────────────────────────────────────────────

export const POST: RequestHandler = async ({ request }) => {
	// 1. Parse body
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ success: false, error: 'Cuerpo de la petición inválido.' }, { status: 400 });
	}

	// 2. Validate
	const parsed = LeadSchema.safeParse(body);
	if (!parsed.success) {
		const firstError = parsed.error.errors[0]?.message ?? 'Datos inválidos.';
		return json({ success: false, error: firstError }, { status: 400 });
	}

	const input = parsed.data;

	// 3. Deduplication — evitar leads duplicados por email
	try {
		const exists = await leadExistsByEmail(input.email);
		if (exists) {
			return json(
				{ success: false, error: 'Ya existe un registro con ese email.' },
				{ status: 409 }
			);
		}
	} catch (err) {
		console.error('[lead] dedup check failed:', err);
		// No bloqueamos el flujo si falla la comprobación
	}

	// 4. Persist
	let lead;
	try {
		lead = await createLead(input);
	} catch (err) {
		console.error('[lead] createLead failed:', err);
		return json(
			{ success: false, error: 'No se pudo guardar tu solicitud. Inténtalo de nuevo.' },
			{ status: 500 }
		);
	}

	// 5. Notify admin (fire & forget — no bloqueamos la respuesta)
	sendLeadNotification(lead).catch((err) =>
		console.error('[lead] notification failed:', err)
	);

	return json({ success: true, id: lead.id }, { status: 201 });
};
