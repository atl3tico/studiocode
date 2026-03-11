/**
 * POST /api/cita — Reserva una nueva cita.
 * GET  /api/cita?date=YYYY-MM-DD — Devuelve slots ocupados para una fecha.
 *
 * Body JSON (POST):
 *   { name, email, phone?, date, time_start, time_end?, service?, notes? }
 *
 * Respuestas:
 *   201  { success: true, id, ical_uid }
 *   400  { success: false, error }
 *   409  { success: false, error }   (slot ocupado)
 *   500  { success: false, error }
 */

import { json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import { createCita, getOccupiedSlots } from '$lib/cal';
import { sendCitaConfirmation, sendCitaNotification } from '$lib/email';

// ── Validation ────────────────────────────────────────────────────────────────

const CitaSchema = z.object({
	name: z.string().min(2).max(100),
	email: z.string().email().max(200),
	phone: z.string().max(20).optional(),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida (esperado YYYY-MM-DD)'),
	time_start: z.string().regex(/^\d{2}:\d{2}$/, 'Hora inválida (esperado HH:MM)'),
	time_end: z.string().regex(/^\d{2}:\d{2}$/).optional(),
	service: z.string().max(100).optional().default('consulta'),
	notes: z.string().max(500).optional()
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeToMinutes(t: string): number {
	const [h, m] = t.split(':').map(Number);
	return h * 60 + m;
}

function hasOverlap(
	startA: number, endA: number,
	startB: number, endB: number
): boolean {
	return startA < endB && endA > startB;
}

// ── GET ───────────────────────────────────────────────────────────────────────

export const GET: RequestHandler = async ({ url }) => {
	const date = url.searchParams.get('date');
	if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		return json({ success: false, error: 'Parámetro date inválido.' }, { status: 400 });
	}

	try {
		const slots = await getOccupiedSlots(date);
		return json({ success: true, slots });
	} catch (err) {
		console.error('[cita] getOccupiedSlots error:', err);
		return json({ success: false, error: 'Error al consultar disponibilidad.' }, { status: 500 });
	}
};

// ── POST ──────────────────────────────────────────────────────────────────────

export const POST: RequestHandler = async ({ request }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ success: false, error: 'Cuerpo de la petición inválido.' }, { status: 400 });
	}

	const parsed = CitaSchema.safeParse(body);
	if (!parsed.success) {
		const firstError = parsed.error.errors[0]?.message ?? 'Datos inválidos.';
		return json({ success: false, error: firstError }, { status: 400 });
	}

	const input = parsed.data;

	// Verificar que la fecha no sea pasada
	const today = new Date().toISOString().slice(0, 10);
	if (input.date < today) {
		return json({ success: false, error: 'No se pueden reservar citas en fechas pasadas.' }, { status: 400 });
	}

	// Verificar disponibilidad del slot
	try {
		const occupied = await getOccupiedSlots(input.date);
		const newStart = timeToMinutes(input.time_start);
		const defaultEnd = input.time_end ?? `${String(Math.floor(newStart / 60) + 1).padStart(2, '0')}:${String(newStart % 60).padStart(2, '0')}`;
		const newEnd = timeToMinutes(defaultEnd);

		const conflict = occupied.some(({ time_start, time_end }) =>
			hasOverlap(newStart, newEnd, timeToMinutes(time_start), timeToMinutes(time_end))
		);

		if (conflict) {
			return json(
				{ success: false, error: 'El horario seleccionado ya está ocupado. Por favor elige otro.' },
				{ status: 409 }
			);
		}
	} catch (err) {
		console.error('[cita] availability check error:', err);
	}

	// Crear cita
	let cita;
	try {
		cita = await createCita(input);
	} catch (err) {
		console.error('[cita] createCita error:', err);
		return json(
			{ success: false, error: 'No se pudo guardar la cita. Inténtalo de nuevo.' },
			{ status: 500 }
		);
	}

	// Notificaciones (fire & forget)
	Promise.all([
		sendCitaConfirmation(cita).catch((e) => console.error('[cita] confirmation email failed:', e)),
		sendCitaNotification(cita).catch((e) => console.error('[cita] admin notification failed:', e))
	]);

	return json({ success: true, id: cita.id, ical_uid: cita.ical_uid }, { status: 201 });
};
