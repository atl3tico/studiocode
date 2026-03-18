import type { Contact, Deal, Task, Activity } from "./types";

export const seedContacts: Contact[] = [
  { id: "c1", name: "Pedro Martinez", initials: "PM", company: "TechCorp SL", email: "pedro@techcorp.es", status: "activo" },
  { id: "c2", name: "Laura Fernandez", initials: "LF", company: "CreativeHub", email: "laura@creativehub.es", status: "activo" },
  { id: "c3", name: "Miguel Torres", initials: "MT", company: "Innovatech SA", email: "miguel@innovatech.es", status: "prospecto" },
  { id: "c4", name: "Carmen Diaz", initials: "CD", company: "DataFlow Inc", email: "carmen@dataflow.es", status: "activo" },
  { id: "c5", name: "Roberto Gomez", initials: "RG", company: "WebSolutions", email: "roberto@websolutions.es", status: "inactivo" },
  { id: "c6", name: "Isabel Moreno", initials: "IM", company: "DigitalFirst", email: "isabel@digitalfirst.es", status: "prospecto" },
];

export const seedDeals: Deal[] = [
  { id: "d1", title: "Rediseno Web", company: "CreativeHub", value: 5000, owner: "Maria Garcia", ownerInitials: "MG", stage: "prospeccion" },
  { id: "d2", title: "SEO Audit", company: "DigitalFirst", value: 3000, owner: "Juan Lopez", ownerInitials: "JL", stage: "prospeccion" },
  { id: "d3", title: "Campana Ads", company: "WebSolutions", value: 10000, owner: "Ana Sanchez", ownerInitials: "AS", stage: "prospeccion" },
  { id: "d4", title: "App Movil MVP", company: "Innovatech SA", value: 12000, owner: "Carlos Ruiz", ownerInitials: "CR", stage: "calificacion" },
  { id: "d5", title: "Email Marketing", company: "DataFlow Inc", value: 3500, owner: "Maria Garcia", ownerInitials: "MG", stage: "calificacion" },
  { id: "d6", title: "Consultoria Q1", company: "TechCorp SL", value: 8500, owner: "Juan Lopez", ownerInitials: "JL", stage: "propuesta" },
  { id: "d7", title: "Soporte Anual", company: "DataFlow Inc", value: 6000, owner: "Ana Sanchez", ownerInitials: "AS", stage: "negociacion" },
];

export const seedTasks: Task[] = [
  { id: "t1", title: "Llamar a Pedro Martinez", contact: "TechCorp SL", type: "Llamada", due: "Hoy", urgency: "alta", done: false },
  { id: "t2", title: "Enviar propuesta Website Redesign", contact: "CreativeHub", type: "Email", due: "Hoy", urgency: "alta", done: false },
  { id: "t3", title: "Reunion demo con Innovatech", contact: "Innovatech SA", type: "Reunion", due: "Manana", urgency: "media", done: false },
  { id: "t4", title: "Seguimiento factura Q4", contact: "DataFlow Inc", type: "Seguimiento", due: "Jueves", urgency: "baja", done: false },
  { id: "t5", title: "Actualizar datos de contacto", contact: "WebSolutions", type: "Admin", due: "Viernes", urgency: "baja", done: false },
  { id: "t6", title: "Enviar contrato firmado", contact: "DigitalFirst", type: "Email", due: "Completado", urgency: "baja", done: true },
  { id: "t7", title: "Preparar informe mensual", contact: "Interno", type: "Admin", due: "Completado", urgency: "baja", done: true },
];

export const seedActivities: Activity[] = [
  { id: "a1", avatar: "MG", text: "Maria Garcia creo un nuevo deal: Website Redesign", time: "Hace 2 horas" },
  { id: "a2", avatar: "JL", text: "Juan Lopez movio 'App Movil' a Negociacion", time: "Hace 4 horas" },
  { id: "a3", avatar: "AS", text: "Ana Sanchez agrego un contacto: Pedro Martinez", time: "Hace 5 horas" },
  { id: "a4", avatar: "CR", text: "Carlos Ruiz cerro el deal 'Consultoria Q1' por €8,500", time: "Ayer" },
];
