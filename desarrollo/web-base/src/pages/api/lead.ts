/**
 * POST /api/lead
 *
 * Flujo:
 *  1. Parsea y valida el body con Zod
 *  2. Guarda backup local (data/leads.jsonl) — siempre
 *  3. Intenta enviar al CRM configurado — best-effort
 *  4. Si hay appointment, genera .ics y lo incluye en la respuesta
 */
import type { APIRoute } from 'astro'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { getCrmConfig, sendLeadToCrm } from '../../lib/crm'
import { backupLead } from '../../lib/backup'
import { generateICS } from '../../lib/ical'
import type { Lead, ApiResponse } from '../../lib/types'

export const prerender = false

// ─── Schema ───────────────────────────────────────────────────────────────────

const LeadInputSchema = z.object({
  name: z.string().min(2, 'Nombre obligatorio (mínimo 2 caracteres)'),
  email: z.string().email('Email no válido'),
  phone: z.string().min(9, 'Teléfono no válido').optional(),
  company: z.string().max(120).optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  appointment: z.string().datetime({ offset: true }).optional(),
  // Attribution — inyectados por el frontend desde la cookie de UTM
  source: z.string().max(80).optional(),
  medium: z.string().max(80).optional(),
  campaign: z.string().max(80).optional(),
  referrer: z.string().max(500).optional(),
})

type LeadInput = z.infer<typeof LeadInputSchema>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildLead(input: LeadInput): Lead {
  return {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    ...input,
  }
}

function json(body: ApiResponse, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export const POST: APIRoute = async ({ request }) => {
  // 1. Parse body
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return json({ ok: false, error: 'Body JSON inválido' }, 400)
  }

  // 2. Validate
  const parsed = LeadInputSchema.safeParse(raw)
  if (!parsed.success) {
    return json(
      { ok: false, error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
      422
    )
  }

  const lead = buildLead(parsed.data)

  // 3. Backup local — siempre primero, antes de cualquier llamada externa
  backupLead(lead)

  // 4. CRM — best-effort (no bloquea la respuesta si falla)
  const crmConfig = getCrmConfig()
  let crmResult = null
  if (crmConfig) {
    crmResult = await sendLeadToCrm(lead, crmConfig)
    if (!crmResult.ok) {
      console.error('[api/lead] CRM error:', crmResult)
    }
  }

  // 5. iCalendar si hay cita
  let ics: string | null = null
  if (lead.appointment) {
    const dtstart = new Date(lead.appointment)
    const dtend = new Date(dtstart.getTime() + 60 * 60 * 1000)
    ics = generateICS({
      uid: lead.id,
      summary: `Cita con ${lead.name}`,
      description: lead.message,
      dtstart,
      dtend,
      organizerName: import.meta.env.BUSINESS_NAME ?? 'Tu Negocio',
      organizerEmail: import.meta.env.CONTACT_EMAIL ?? 'hola@example.com',
      attendeeEmail: lead.email,
    })
  }

  return json({
    ok: true,
    data: {
      id: lead.id,
      ics,
      crm: crmResult ? { sent: crmResult.ok, provider: crmResult.provider } : null,
    },
  })
}
