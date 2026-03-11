/**
 * cal.ts — Módulo de citas: tipos, CRUD Supabase y generación iCalendar.
 *
 * Tabla requerida en Supabase:
 *   CREATE TABLE citas (
 *     id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *     created_at  timestamptz DEFAULT now(),
 *     lead_id     uuid REFERENCES leads(id) ON DELETE SET NULL,
 *     name        text NOT NULL,
 *     email       text NOT NULL,
 *     phone       text,
 *     date        date NOT NULL,           -- YYYY-MM-DD
 *     time_start  time NOT NULL,           -- HH:MM
 *     time_end    time NOT NULL,           -- HH:MM
 *     service     text DEFAULT 'consulta',
 *     notes       text,
 *     status      text DEFAULT 'pending',  -- pending | confirmed | cancelled
 *     ical_uid    text UNIQUE
 *   );
 */

import { createClient } from '@supabase/supabase-js';
import {
	SUPABASE_SERVICE_ROLE_KEY,
	PUBLIC_SUPABASE_URL
} from '$env/static/private';

// ── Types ────────────────────────────────────────────────────────────────────

export type CitaStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Cita {
	id: string;
	created_at: string;
	lead_id?: string | null;
	name: string;
	email: string;
	phone?: string | null;
	date: string;        // YYYY-MM-DD
	time_start: string;  // HH:MM
	time_end: string;    // HH:MM
	service: string;
	notes?: string | null;
	status: CitaStatus;
	ical_uid: string;
}

export interface CreateCitaInput {
	name: string;
	email: string;
	phone?: string;
	date: string;
	time_start: string;
	time_end?: string;
	service?: string;
	notes?: string;
	lead_id?: string;
}

export interface CitaFilters {
	status?: CitaStatus;
	date_from?: string;
	date_to?: string;
	limit?: number;
	offset?: number;
}

// ── Supabase client ──────────────────────────────────────────────────────────

function getAdminClient() {
	return createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
		auth: { persistSession: false }
	});
}

// ── iCalendar generation ─────────────────────────────────────────────────────

/**
 * Genera un UID único para iCal basado en el ID de la cita.
 */
export function generateIcalUid(citaId: string, domain = 'tudominio.com'): string {
	return `${citaId}@${domain}`;
}

/**
 * Convierte fecha + hora a formato iCal (YYYYMMDDTHHMMSS).
 */
function toIcalDate(date: string, time: string): string {
	return `${date.replace(/-/g, '')}T${time.replace(/:/g, '')}00`;
}

/**
 * Genera el contenido de un archivo .ics para una cita.
 */
export function generateIcalContent(cita: Cita, siteName = 'Tu Negocio'): string {
	const now = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15);
	const dtstart = toIcalDate(cita.date, cita.time_start);
	const dtend = toIcalDate(cita.date, cita.time_end);

	const lines = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		`PRODID:-//${siteName}//Web Negocio//ES`,
		'CALSCALE:GREGORIAN',
		'METHOD:REQUEST',
		'BEGIN:VEVENT',
		`UID:${cita.ical_uid}`,
		`DTSTAMP:${now}Z`,
		`DTSTART:${dtstart}`,
		`DTEND:${dtend}`,
		`SUMMARY:Cita - ${cita.service} - ${siteName}`,
		`DESCRIPTION:Cita con ${cita.name}\\nServicio: ${cita.service}${cita.notes ? `\\nNotas: ${cita.notes}` : ''}`,
		`ORGANIZER;CN=${siteName}:mailto:noreply@tudominio.com`,
		`ATTENDEE;CN=${cita.name};RSVP=TRUE:mailto:${cita.email}`,
		'STATUS:CONFIRMED',
		'SEQUENCE:0',
		'BEGIN:VALARM',
		'TRIGGER:-PT24H',
		'ACTION:EMAIL',
		`DESCRIPTION:Recordatorio: Cita mañana a las ${cita.time_start}`,
		'SUMMARY:Recordatorio de cita',
		'END:VALARM',
		'END:VEVENT',
		'END:VCALENDAR'
	];

	return lines.join('\r\n');
}

// ── CRUD ─────────────────────────────────────────────────────────────────────

/**
 * Crea una nueva cita.
 */
export async function createCita(input: CreateCitaInput): Promise<Cita> {
	const supabase = getAdminClient();

	// Por defecto la cita dura 1 hora si no se especifica time_end
	let timeEnd = input.time_end;
	if (!timeEnd) {
		const [h, m] = input.time_start.split(':').map(Number);
		const endH = (h + 1) % 24;
		timeEnd = `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
	}

	const tempId = crypto.randomUUID();
	const icalUid = generateIcalUid(tempId);

	const { data, error } = await supabase
		.from('citas')
		.insert({
			lead_id: input.lead_id ?? null,
			name: input.name.trim(),
			email: input.email.trim().toLowerCase(),
			phone: input.phone?.trim() ?? null,
			date: input.date,
			time_start: input.time_start,
			time_end: timeEnd,
			service: input.service ?? 'consulta',
			notes: input.notes?.trim() ?? null,
			status: 'pending',
			ical_uid: icalUid
		})
		.select()
		.single();

	if (error) throw new Error(`CAL createCita: ${error.message}`);
	return data as Cita;
}

/**
 * Devuelve una cita por ID.
 */
export async function getCitaById(id: string): Promise<Cita | null> {
	const supabase = getAdminClient();
	const { data, error } = await supabase
		.from('citas')
		.select('*')
		.eq('id', id)
		.maybeSingle();

	if (error) throw new Error(`CAL getCitaById: ${error.message}`);
	return data as Cita | null;
}

/**
 * Lista citas con filtros opcionales.
 */
export async function listCitas(filters: CitaFilters = {}): Promise<Cita[]> {
	const supabase = getAdminClient();
	const { status, date_from, date_to, limit = 50, offset = 0 } = filters;

	let query = supabase
		.from('citas')
		.select('*')
		.order('date', { ascending: true })
		.order('time_start', { ascending: true })
		.range(offset, offset + limit - 1);

	if (status) query = query.eq('status', status);
	if (date_from) query = query.gte('date', date_from);
	if (date_to) query = query.lte('date', date_to);

	const { data, error } = await query;
	if (error) throw new Error(`CAL listCitas: ${error.message}`);
	return (data ?? []) as Cita[];
}

/**
 * Actualiza el estado de una cita.
 */
export async function updateCitaStatus(id: string, status: CitaStatus): Promise<Cita> {
	const supabase = getAdminClient();
	const { data, error } = await supabase
		.from('citas')
		.update({ status })
		.eq('id', id)
		.select()
		.single();

	if (error) throw new Error(`CAL updateCitaStatus: ${error.message}`);
	return data as Cita;
}

/**
 * Devuelve los slots ya ocupados para una fecha (para validar disponibilidad).
 */
export async function getOccupiedSlots(date: string): Promise<Array<{ time_start: string; time_end: string }>> {
	const supabase = getAdminClient();
	const { data, error } = await supabase
		.from('citas')
		.select('time_start, time_end')
		.eq('date', date)
		.neq('status', 'cancelled');

	if (error) throw new Error(`CAL getOccupiedSlots: ${error.message}`);
	return data ?? [];
}
