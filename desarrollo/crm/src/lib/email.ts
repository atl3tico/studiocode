/**
 * email.ts — Envío de emails transaccionales con Resend.
 *
 * Variables de entorno requeridas:
 *   RESEND_API_KEY, EMAIL_FROM, EMAIL_NOTIFY
 */

import { Resend } from 'resend';
import { RESEND_API_KEY, EMAIL_FROM, EMAIL_NOTIFY } from '$env/static/private';
import type { Lead } from '$lib/crm';
import type { Cita } from '$lib/cal';
import { generateIcalContent } from '$lib/cal';

function getResend() {
	return new Resend(RESEND_API_KEY);
}

/**
 * Notifica al admin cuando llega un nuevo lead.
 */
export async function sendLeadNotification(lead: Lead): Promise<void> {
	const resend = getResend();

	await resend.emails.send({
		from: EMAIL_FROM,
		to: EMAIL_NOTIFY,
		subject: `🔔 Nuevo lead: ${lead.name}`,
		html: `
			<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
				<h2 style="color:#1d4ed8">Nuevo lead recibido</h2>
				<table style="width:100%;border-collapse:collapse">
					<tr><td style="padding:8px;font-weight:bold;color:#374151">Nombre</td><td style="padding:8px">${lead.name}</td></tr>
					<tr style="background:#f9fafb"><td style="padding:8px;font-weight:bold;color:#374151">Email</td><td style="padding:8px"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
					${lead.phone ? `<tr><td style="padding:8px;font-weight:bold;color:#374151">Teléfono</td><td style="padding:8px">${lead.phone}</td></tr>` : ''}
					${lead.message ? `<tr style="background:#f9fafb"><td style="padding:8px;font-weight:bold;color:#374151">Mensaje</td><td style="padding:8px">${lead.message}</td></tr>` : ''}
					<tr><td style="padding:8px;font-weight:bold;color:#374151">Fuente</td><td style="padding:8px">${lead.source}</td></tr>
					<tr style="background:#f9fafb"><td style="padding:8px;font-weight:bold;color:#374151">Fecha</td><td style="padding:8px">${new Date(lead.created_at).toLocaleString('es-ES')}</td></tr>
				</table>
				<p style="margin-top:24px">
					<a href="${process.env.PUBLIC_SITE_URL}/admin/leads/${lead.id}"
					   style="background:#2563eb;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold">
						Ver en el panel
					</a>
				</p>
			</div>
		`
	});
}

/**
 * Confirmación de cita al cliente (incluye adjunto .ics).
 */
export async function sendCitaConfirmation(cita: Cita, siteName = 'Tu Negocio'): Promise<void> {
	const resend = getResend();
	const icalContent = generateIcalContent(cita, siteName);

	await resend.emails.send({
		from: EMAIL_FROM,
		to: cita.email,
		subject: `Cita confirmada — ${cita.date} a las ${cita.time_start}`,
		html: `
			<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
				<h2 style="color:#1d4ed8">¡Tu cita está reservada, ${cita.name}!</h2>
				<table style="width:100%;border-collapse:collapse;margin-bottom:16px">
					<tr><td style="padding:8px;font-weight:bold;color:#374151">Servicio</td><td style="padding:8px">${cita.service}</td></tr>
					<tr style="background:#f9fafb"><td style="padding:8px;font-weight:bold;color:#374151">Fecha</td><td style="padding:8px">${cita.date}</td></tr>
					<tr><td style="padding:8px;font-weight:bold;color:#374151">Hora</td><td style="padding:8px">${cita.time_start} – ${cita.time_end}</td></tr>
					${cita.notes ? `<tr style="background:#f9fafb"><td style="padding:8px;font-weight:bold;color:#374151">Notas</td><td style="padding:8px">${cita.notes}</td></tr>` : ''}
				</table>
				<p>Hemos adjuntado un archivo .ics para añadir la cita a tu calendario.</p>
				<p style="color:#6b7280;font-size:14px">Para cancelar o modificar la cita, responde a este email con al menos 24 horas de antelación.</p>
			</div>
		`,
		attachments: [
			{
				filename: `cita-${cita.date}.ics`,
				content: Buffer.from(icalContent).toString('base64')
			}
		]
	});
}

/**
 * Notifica al admin de una nueva cita.
 */
export async function sendCitaNotification(cita: Cita, siteName = 'Tu Negocio'): Promise<void> {
	const resend = getResend();

	await resend.emails.send({
		from: EMAIL_FROM,
		to: EMAIL_NOTIFY,
		subject: `📅 Nueva cita: ${cita.name} — ${cita.date} ${cita.time_start}`,
		html: `
			<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
				<h2 style="color:#1d4ed8">Nueva cita reservada</h2>
				<table style="width:100%;border-collapse:collapse">
					<tr><td style="padding:8px;font-weight:bold;color:#374151">Cliente</td><td style="padding:8px">${cita.name}</td></tr>
					<tr style="background:#f9fafb"><td style="padding:8px;font-weight:bold;color:#374151">Email</td><td style="padding:8px"><a href="mailto:${cita.email}">${cita.email}</a></td></tr>
					${cita.phone ? `<tr><td style="padding:8px;font-weight:bold;color:#374151">Teléfono</td><td style="padding:8px">${cita.phone}</td></tr>` : ''}
					<tr style="background:#f9fafb"><td style="padding:8px;font-weight:bold;color:#374151">Servicio</td><td style="padding:8px">${cita.service}</td></tr>
					<tr><td style="padding:8px;font-weight:bold;color:#374151">Fecha</td><td style="padding:8px">${cita.date}</td></tr>
					<tr style="background:#f9fafb"><td style="padding:8px;font-weight:bold;color:#374151">Hora</td><td style="padding:8px">${cita.time_start} – ${cita.time_end}</td></tr>
					${cita.notes ? `<tr><td style="padding:8px;font-weight:bold;color:#374151">Notas</td><td style="padding:8px">${cita.notes}</td></tr>` : ''}
				</table>
				<p style="margin-top:24px">
					<a href="${process.env.PUBLIC_SITE_URL}/admin/citas/${cita.id}"
					   style="background:#2563eb;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold">
						Ver en el panel
					</a>
				</p>
			</div>
		`
	});
}

/**
 * Confirmación automática al lead (agradecimiento).
 */
export async function sendLeadConfirmation(lead: Lead): Promise<void> {
	const resend = getResend();

	await resend.emails.send({
		from: EMAIL_FROM,
		to: lead.email,
		subject: 'Hemos recibido tu solicitud',
		html: `
			<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
				<h2 style="color:#1d4ed8">¡Gracias, ${lead.name}!</h2>
				<p>Hemos recibido tu solicitud y nos pondremos en contacto contigo en las próximas 24 horas.</p>
				${lead.message ? `<blockquote style="border-left:3px solid #e5e7eb;padding-left:16px;color:#6b7280;font-style:italic">${lead.message}</blockquote>` : ''}
				<p style="color:#6b7280;font-size:14px">Si tienes alguna urgencia, también puedes responder directamente a este email.</p>
			</div>
		`
	});
}
