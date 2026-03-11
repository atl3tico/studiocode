/**
 * crm.ts — Lógica central de gestión de leads y contactos.
 *
 * Usa Supabase como backend. Las variables de entorno se cargan
 * desde .env (PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).
 *
 * Tabla requerida en Supabase:
 *   CREATE TABLE leads (
 *     id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *     created_at timestamptz DEFAULT now(),
 *     name       text NOT NULL,
 *     email      text NOT NULL,
 *     phone      text,
 *     message    text,
 *     source     text DEFAULT 'web',
 *     status     text DEFAULT 'new',   -- new | contacted | qualified | lost | won
 *     metadata   jsonb
 *   );
 */

import { createClient } from '@supabase/supabase-js';
import {
	SUPABASE_SERVICE_ROLE_KEY,
	PUBLIC_SUPABASE_URL
} from '$env/static/private';

// ── Types ────────────────────────────────────────────────────────────────────

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost' | 'won';

export interface Lead {
	id: string;
	created_at: string;
	name: string;
	email: string;
	phone?: string | null;
	message?: string | null;
	source: string;
	status: LeadStatus;
	metadata?: Record<string, unknown> | null;
}

export interface CreateLeadInput {
	name: string;
	email: string;
	phone?: string;
	message?: string;
	source?: string;
	metadata?: Record<string, unknown>;
}

export interface UpdateLeadInput {
	name?: string;
	phone?: string;
	message?: string;
	status?: LeadStatus;
	metadata?: Record<string, unknown>;
}

export interface LeadFilters {
	status?: LeadStatus;
	source?: string;
	limit?: number;
	offset?: number;
}

// ── Client (server-side only, uses service role) ─────────────────────────────

function getAdminClient() {
	return createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
		auth: { persistSession: false }
	});
}

// ── CRUD ─────────────────────────────────────────────────────────────────────

/**
 * Crea un nuevo lead. Devuelve el lead creado o lanza un error.
 */
export async function createLead(input: CreateLeadInput): Promise<Lead> {
	const supabase = getAdminClient();

	const { data, error } = await supabase
		.from('leads')
		.insert({
			name: input.name.trim(),
			email: input.email.trim().toLowerCase(),
			phone: input.phone?.trim() ?? null,
			message: input.message?.trim() ?? null,
			source: input.source ?? 'web',
			metadata: input.metadata ?? null
		})
		.select()
		.single();

	if (error) throw new Error(`CRM createLead: ${error.message}`);
	return data as Lead;
}

/**
 * Devuelve un lead por ID.
 */
export async function getLeadById(id: string): Promise<Lead | null> {
	const supabase = getAdminClient();

	const { data, error } = await supabase
		.from('leads')
		.select('*')
		.eq('id', id)
		.maybeSingle();

	if (error) throw new Error(`CRM getLeadById: ${error.message}`);
	return data as Lead | null;
}

/**
 * Lista leads con filtros opcionales.
 */
export async function listLeads(filters: LeadFilters = {}): Promise<Lead[]> {
	const supabase = getAdminClient();
	const { status, source, limit = 50, offset = 0 } = filters;

	let query = supabase
		.from('leads')
		.select('*')
		.order('created_at', { ascending: false })
		.range(offset, offset + limit - 1);

	if (status) query = query.eq('status', status);
	if (source) query = query.eq('source', source);

	const { data, error } = await query;
	if (error) throw new Error(`CRM listLeads: ${error.message}`);
	return (data ?? []) as Lead[];
}

/**
 * Actualiza campos de un lead existente.
 */
export async function updateLead(id: string, input: UpdateLeadInput): Promise<Lead> {
	const supabase = getAdminClient();

	const { data, error } = await supabase
		.from('leads')
		.update(input)
		.eq('id', id)
		.select()
		.single();

	if (error) throw new Error(`CRM updateLead: ${error.message}`);
	return data as Lead;
}

/**
 * Cambia el estado de un lead (pipeline básico).
 */
export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
	return updateLead(id, { status });
}

/**
 * Comprueba si ya existe un lead con ese email (deduplicación).
 */
export async function leadExistsByEmail(email: string): Promise<boolean> {
	const supabase = getAdminClient();

	const { count, error } = await supabase
		.from('leads')
		.select('id', { count: 'exact', head: true })
		.eq('email', email.trim().toLowerCase());

	if (error) throw new Error(`CRM leadExistsByEmail: ${error.message}`);
	return (count ?? 0) > 0;
}
