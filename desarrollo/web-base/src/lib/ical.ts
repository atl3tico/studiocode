/**
 * Generación de archivos iCalendar (.ics) para citas
 */

export interface CalendarEvent {
  uid: string
  summary: string
  description?: string
  location?: string
  dtstart: Date
  dtend: Date
  organizerName: string
  organizerEmail: string
  attendeeEmail?: string
}

function formatDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

function escapeIcal(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

export function generateICS(event: CalendarEvent): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Web Negocio CRM//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${event.uid}`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(event.dtstart)}`,
    `DTEND:${formatDate(event.dtend)}`,
    `SUMMARY:${escapeIcal(event.summary)}`,
    event.description ? `DESCRIPTION:${escapeIcal(event.description)}` : null,
    event.location ? `LOCATION:${escapeIcal(event.location)}` : null,
    `ORGANIZER;CN=${escapeIcal(event.organizerName)}:mailto:${event.organizerEmail}`,
    event.attendeeEmail ? `ATTENDEE;ROLE=REQ-PARTICIPANT;RSVP=TRUE:mailto:${event.attendeeEmail}` : null,
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return lines.filter(Boolean).join('\r\n')
}
