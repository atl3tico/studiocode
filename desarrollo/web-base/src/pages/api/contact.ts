import type { APIRoute } from 'astro'
import { parseLead } from '../../lib/leads'
import { generateICS } from '../../lib/ical'
import { randomUUID } from 'node:crypto'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'JSON inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const result = parseLead(body)
  if (!result.success) {
    return new Response(JSON.stringify({ error: 'Datos inválidos', details: result.errors }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const lead = result.data!

  // TODO: Enviar a webhook CRM (Fase 2)
  // await sendToWebhook(lead)

  // Generar .ics si hay fecha de cita
  let icsContent: string | null = null
  if (lead.appointment) {
    const dtstart = new Date(lead.appointment)
    const dtend = new Date(dtstart.getTime() + 60 * 60 * 1000) // +1h por defecto

    icsContent = generateICS({
      uid: randomUUID(),
      summary: `Cita con ${lead.name}`,
      description: lead.message,
      dtstart,
      dtend,
      organizerName: 'Tu Negocio',
      organizerEmail: import.meta.env.CONTACT_EMAIL ?? 'hola@example.com',
      attendeeEmail: lead.email,
    })
  }

  return new Response(
    JSON.stringify({
      ok: true,
      ics: icsContent,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}
