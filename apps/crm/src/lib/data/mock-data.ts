import type { Contact, Deal, Task, Activity, Appointment, Reminder, WebhookConfig } from "./types";

// --- TechCorp (t1) seed data ---

const techcorpContacts: Contact[] = [
  { id: "c1", tenantId: "t1", name: "Pedro Martinez", initials: "PM", company: "TechCorp SL", email: "pedro@techcorp.es", status: "activo" },
  { id: "c2", tenantId: "t1", name: "Laura Fernandez", initials: "LF", company: "CreativeHub", email: "laura@creativehub.es", status: "activo" },
  { id: "c3", tenantId: "t1", name: "Miguel Torres", initials: "MT", company: "Innovatech SA", email: "miguel@innovatech.es", status: "prospecto" },
  { id: "c4", tenantId: "t1", name: "Carmen Diaz", initials: "CD", company: "DataFlow Inc", email: "carmen@dataflow.es", status: "activo" },
  { id: "c5", tenantId: "t1", name: "Roberto Gomez", initials: "RG", company: "WebSolutions", email: "roberto@websolutions.es", status: "inactivo" },
  { id: "c6", tenantId: "t1", name: "Isabel Moreno", initials: "IM", company: "DigitalFirst", email: "isabel@digitalfirst.es", status: "prospecto" },
];

const techcorpDeals: Deal[] = [
  { id: "d1", tenantId: "t1", title: "Rediseno Web", company: "CreativeHub", value: 5000, owner: "Maria Garcia", ownerInitials: "MG", stage: "prospeccion" },
  { id: "d2", tenantId: "t1", title: "SEO Audit", company: "DigitalFirst", value: 3000, owner: "Juan Lopez", ownerInitials: "JL", stage: "prospeccion" },
  { id: "d3", tenantId: "t1", title: "Campana Ads", company: "WebSolutions", value: 10000, owner: "Ana Sanchez", ownerInitials: "AS", stage: "prospeccion" },
  { id: "d4", tenantId: "t1", title: "App Movil MVP", company: "Innovatech SA", value: 12000, owner: "Carlos Ruiz", ownerInitials: "CR", stage: "calificacion" },
  { id: "d5", tenantId: "t1", title: "Email Marketing", company: "DataFlow Inc", value: 3500, owner: "Maria Garcia", ownerInitials: "MG", stage: "calificacion" },
  { id: "d6", tenantId: "t1", title: "Consultoria Q1", company: "TechCorp SL", value: 8500, owner: "Juan Lopez", ownerInitials: "JL", stage: "propuesta" },
  { id: "d7", tenantId: "t1", title: "Soporte Anual", company: "DataFlow Inc", value: 6000, owner: "Ana Sanchez", ownerInitials: "AS", stage: "negociacion" },
];

const techcorpTasks: Task[] = [
  { id: "t1-t1", tenantId: "t1", title: "Llamar a Pedro Martinez", contact: "TechCorp SL", type: "Llamada", due: "Hoy", urgency: "alta", done: false },
  { id: "t1-t2", tenantId: "t1", title: "Enviar propuesta Website Redesign", contact: "CreativeHub", type: "Email", due: "Hoy", urgency: "alta", done: false },
  { id: "t1-t3", tenantId: "t1", title: "Reunion demo con Innovatech", contact: "Innovatech SA", type: "Reunion", due: "Manana", urgency: "media", done: false },
  { id: "t1-t4", tenantId: "t1", title: "Seguimiento factura Q4", contact: "DataFlow Inc", type: "Seguimiento", due: "Jueves", urgency: "baja", done: false },
  { id: "t1-t5", tenantId: "t1", title: "Actualizar datos de contacto", contact: "WebSolutions", type: "Admin", due: "Viernes", urgency: "baja", done: false },
  { id: "t1-t6", tenantId: "t1", title: "Enviar contrato firmado", contact: "DigitalFirst", type: "Email", due: "Completado", urgency: "baja", done: true },
  { id: "t1-t7", tenantId: "t1", title: "Preparar informe mensual", contact: "Interno", type: "Admin", due: "Completado", urgency: "baja", done: true },
];

const techcorpActivities: Activity[] = [
  { id: "a1", tenantId: "t1", avatar: "MG", text: "Maria Garcia creo un nuevo deal: Website Redesign", time: "Hace 2 horas" },
  { id: "a2", tenantId: "t1", avatar: "JL", text: "Juan Lopez movio 'App Movil' a Negociacion", time: "Hace 4 horas" },
  { id: "a3", tenantId: "t1", avatar: "AS", text: "Ana Sanchez agrego un contacto: Pedro Martinez", time: "Hace 5 horas" },
  { id: "a4", tenantId: "t1", avatar: "CR", text: "Carlos Ruiz cerro el deal 'Consultoria Q1' por €8,500", time: "Ayer" },
];

// --- CreativeHub (t2) seed data ---

const creativehubContacts: Contact[] = [
  { id: "c10", tenantId: "t2", name: "Sofia Reyes", initials: "SR", company: "BrandVision", email: "sofia@brandvision.es", status: "activo" },
  { id: "c11", tenantId: "t2", name: "Diego Navarro", initials: "DN", company: "MediaPro", email: "diego@mediapro.es", status: "activo" },
  { id: "c12", tenantId: "t2", name: "Elena Ruiz", initials: "ER", company: "PixelArt Studio", email: "elena@pixelart.es", status: "prospecto" },
];

const creativehubDeals: Deal[] = [
  { id: "d10", tenantId: "t2", title: "Branding Completo", company: "BrandVision", value: 8000, owner: "Sofia Reyes", ownerInitials: "SR", stage: "propuesta" },
  { id: "d11", tenantId: "t2", title: "Video Corporativo", company: "MediaPro", value: 15000, owner: "Diego Navarro", ownerInitials: "DN", stage: "negociacion" },
  { id: "d12", tenantId: "t2", title: "Diseno UI/UX", company: "PixelArt Studio", value: 6500, owner: "Elena Ruiz", ownerInitials: "ER", stage: "calificacion" },
];

const creativehubTasks: Task[] = [
  { id: "t2-t1", tenantId: "t2", title: "Revisar maquetas BrandVision", contact: "BrandVision", type: "Reunion", due: "Hoy", urgency: "alta", done: false },
  { id: "t2-t2", tenantId: "t2", title: "Enviar presupuesto video", contact: "MediaPro", type: "Email", due: "Manana", urgency: "media", done: false },
];

const creativehubActivities: Activity[] = [
  { id: "a10", tenantId: "t2", avatar: "SR", text: "Sofia Reyes creo propuesta para BrandVision", time: "Hace 1 hora" },
  { id: "a11", tenantId: "t2", avatar: "DN", text: "Diego Navarro avanzo Video Corporativo a negociacion", time: "Hace 3 horas" },
];

// --- StartupLab (t3) seed data ---

const startuplabContacts: Contact[] = [
  { id: "c20", tenantId: "t3", name: "Alejandro Vega", initials: "AV", company: "NeoApps", email: "alejandro@neoapps.es", status: "activo" },
  { id: "c21", tenantId: "t3", name: "Patricia Luna", initials: "PL", company: "CloudBase", email: "patricia@cloudbase.es", status: "prospecto" },
];

const startuplabDeals: Deal[] = [
  { id: "d20", tenantId: "t3", title: "MVP Development", company: "NeoApps", value: 20000, owner: "Alejandro Vega", ownerInitials: "AV", stage: "prospeccion" },
];

const startuplabTasks: Task[] = [
  { id: "t3-t1", tenantId: "t3", title: "Discovery call NeoApps", contact: "NeoApps", type: "Llamada", due: "Hoy", urgency: "alta", done: false },
];

const startuplabActivities: Activity[] = [
  { id: "a20", tenantId: "t3", avatar: "AV", text: "Alejandro Vega registrado como nuevo contacto", time: "Hace 1 hora" },
];

// --- Appointment seed data ---

const techcorpAppointments: Appointment[] = [
  { id: "ap1", tenantId: "t1", title: "Demo de producto", contactName: "Pedro Martinez", contactEmail: "pedro@techcorp.es", date: "2026-03-20", time: "10:00", duration: 30, status: "confirmada", source: "calcom", notes: "Presentar nueva version del CRM", assignee: "Maria Garcia", assigneeInitials: "MG" },
  { id: "ap2", tenantId: "t1", title: "Revision de propuesta", contactName: "Laura Fernandez", contactEmail: "laura@creativehub.es", date: "2026-03-20", time: "14:00", duration: 45, status: "programada", source: "manual", notes: "Revisar presupuesto rediseno web", assignee: "Juan Lopez", assigneeInitials: "JL" },
  { id: "ap3", tenantId: "t1", title: "Onboarding cliente", contactName: "Carmen Diaz", contactEmail: "carmen@dataflow.es", date: "2026-03-21", time: "09:30", duration: 60, status: "programada", source: "calendly", notes: "Configuracion inicial de la cuenta", assignee: "Ana Sanchez", assigneeInitials: "AS" },
  { id: "ap4", tenantId: "t1", title: "Seguimiento trimestral", contactName: "Miguel Torres", contactEmail: "miguel@innovatech.es", date: "2026-03-22", time: "11:00", duration: 30, status: "programada", source: "calcom", notes: "", assignee: "Carlos Ruiz", assigneeInitials: "CR" },
  { id: "ap5", tenantId: "t1", title: "Capacitacion equipo", contactName: "Isabel Moreno", contactEmail: "isabel@digitalfirst.es", date: "2026-03-19", time: "16:00", duration: 90, status: "completada", source: "manual", notes: "Sesion de formacion completada", assignee: "Maria Garcia", assigneeInitials: "MG" },
  { id: "ap6", tenantId: "t1", title: "Negociacion contrato", contactName: "Roberto Gomez", contactEmail: "roberto@websolutions.es", date: "2026-03-18", time: "10:00", duration: 60, status: "cancelada", source: "calendly", notes: "Cliente solicito cancelar", assignee: "Juan Lopez", assigneeInitials: "JL" },
];

const creativehubAppointments: Appointment[] = [
  { id: "ap10", tenantId: "t2", title: "Kickoff branding", contactName: "Sofia Reyes", contactEmail: "sofia@brandvision.es", date: "2026-03-20", time: "11:00", duration: 60, status: "confirmada", source: "calcom", notes: "Inicio del proyecto de branding", assignee: "Sofia Reyes", assigneeInitials: "SR" },
  { id: "ap11", tenantId: "t2", title: "Review video", contactName: "Diego Navarro", contactEmail: "diego@mediapro.es", date: "2026-03-21", time: "15:00", duration: 45, status: "programada", source: "manual", notes: "Revision del primer corte", assignee: "Diego Navarro", assigneeInitials: "DN" },
];

const startuplabAppointments: Appointment[] = [
  { id: "ap20", tenantId: "t3", title: "Discovery call", contactName: "Alejandro Vega", contactEmail: "alejandro@neoapps.es", date: "2026-03-20", time: "09:00", duration: 30, status: "confirmada", source: "calendly", notes: "Primera toma de contacto", assignee: "Alejandro Vega", assigneeInitials: "AV" },
];

// --- Reminder & webhook seed data ---

const techcorpWebhooks: WebhookConfig[] = [
  { id: "wh1", tenantId: "t1", name: "Email via SendGrid", channel: "email", url: "https://hooks.studiocrm.com/sendgrid/t1", active: true, secret: "whsec_t1_email_xxx" },
  { id: "wh2", tenantId: "t1", name: "WhatsApp via Twilio", channel: "whatsapp", url: "https://hooks.studiocrm.com/twilio/t1", active: true, secret: "whsec_t1_wa_xxx" },
];

const techcorpReminders: Reminder[] = [
  { id: "rm1", tenantId: "t1", title: "Recordatorio cita: Demo de producto", channel: "email", trigger: "appointment_24h", recipientName: "Pedro Martinez", recipientContact: "pedro@techcorp.es", message: "Tienes una cita manana a las 10:00 - Demo de producto", scheduledAt: "2026-03-19T10:00:00", status: "enviado", webhookUrl: "https://hooks.studiocrm.com/sendgrid/t1", relatedEntityId: "ap1", relatedEntityType: "appointment", createdAt: "2026-03-18T10:00:00" },
  { id: "rm2", tenantId: "t1", title: "Recordatorio cita: Revision de propuesta", channel: "whatsapp", trigger: "appointment_1h", recipientName: "Laura Fernandez", recipientContact: "+34612345678", message: "Tu cita es en 1 hora - Revision de propuesta", scheduledAt: "2026-03-20T13:00:00", status: "activo", webhookUrl: "https://hooks.studiocrm.com/twilio/t1", relatedEntityId: "ap2", relatedEntityType: "appointment", createdAt: "2026-03-19T14:00:00" },
  { id: "rm3", tenantId: "t1", title: "Seguimiento deal: App Movil MVP", channel: "email", trigger: "deal_followup", recipientName: "Miguel Torres", recipientContact: "miguel@innovatech.es", message: "Seguimiento pendiente para el deal App Movil MVP", scheduledAt: "2026-03-21T09:00:00", status: "activo", webhookUrl: "https://hooks.studiocrm.com/sendgrid/t1", relatedEntityId: "d4", relatedEntityType: "deal", createdAt: "2026-03-19T09:00:00" },
  { id: "rm4", tenantId: "t1", title: "Tarea vencida: Llamar a Pedro", channel: "whatsapp", trigger: "task_due", recipientName: "Carlos Demo", recipientContact: "+34698765432", message: "La tarea 'Llamar a Pedro Martinez' vence hoy", scheduledAt: "2026-03-20T08:00:00", status: "enviado", webhookUrl: "https://hooks.studiocrm.com/twilio/t1", relatedEntityId: "t1-t1", relatedEntityType: "task", createdAt: "2026-03-19T20:00:00" },
  { id: "rm5", tenantId: "t1", title: "Recordatorio cita cancelada", channel: "email", trigger: "appointment_24h", recipientName: "Roberto Gomez", recipientContact: "roberto@websolutions.es", message: "Recordatorio de cita", scheduledAt: "2026-03-17T10:00:00", status: "cancelado", webhookUrl: "https://hooks.studiocrm.com/sendgrid/t1", relatedEntityId: "ap6", relatedEntityType: "appointment", createdAt: "2026-03-16T10:00:00" },
];

const creativehubWebhooks: WebhookConfig[] = [
  { id: "wh10", tenantId: "t2", name: "Email via Mailgun", channel: "email", url: "https://hooks.studiocrm.com/mailgun/t2", active: true, secret: "whsec_t2_email_xxx" },
];

const creativehubReminders: Reminder[] = [
  { id: "rm10", tenantId: "t2", title: "Recordatorio kickoff branding", channel: "email", trigger: "appointment_24h", recipientName: "Sofia Reyes", recipientContact: "sofia@brandvision.es", message: "Manana tienes el kickoff de branding a las 11:00", scheduledAt: "2026-03-19T11:00:00", status: "enviado", webhookUrl: "https://hooks.studiocrm.com/mailgun/t2", relatedEntityId: "ap10", relatedEntityType: "appointment", createdAt: "2026-03-18T11:00:00" },
];

const startuplabWebhooks: WebhookConfig[] = [];
const startuplabReminders: Reminder[] = [];

// --- Seed data indexed by tenant ID ---

export type TenantSeedData = {
  contacts: Contact[];
  deals: Deal[];
  tasks: Task[];
  activities: Activity[];
  appointments: Appointment[];
  reminders: Reminder[];
  webhooks: WebhookConfig[];
};

const seedByTenant: Record<string, TenantSeedData> = {
  t1: { contacts: techcorpContacts, deals: techcorpDeals, tasks: techcorpTasks, activities: techcorpActivities, appointments: techcorpAppointments, reminders: techcorpReminders, webhooks: techcorpWebhooks },
  t2: { contacts: creativehubContacts, deals: creativehubDeals, tasks: creativehubTasks, activities: creativehubActivities, appointments: creativehubAppointments, reminders: creativehubReminders, webhooks: creativehubWebhooks },
  t3: { contacts: startuplabContacts, deals: startuplabDeals, tasks: startuplabTasks, activities: startuplabActivities, appointments: startuplabAppointments, reminders: startuplabReminders, webhooks: startuplabWebhooks },
};

/** Get seed data for a tenant. Returns empty arrays for unknown tenants. */
export function getSeedDataForTenant(tenantId: string): TenantSeedData {
  return seedByTenant[tenantId] ?? { contacts: [], deals: [], tasks: [], activities: [], appointments: [], reminders: [], webhooks: [] };
}
