// --- Tenant types ---

export type TenantPlan = "free" | "pro" | "enterprise";

export interface TenantSettings {
  locale: string;
  currency: string;
  timezone: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: TenantPlan;
  settings: TenantSettings;
}

export type MemberRole = "owner" | "admin" | "vendedor" | "soporte";

export interface TenantMembership {
  tenantId: string;
  userId: string;
  role: MemberRole;
}

// --- Domain types ---

export interface Contact {
  id: string;
  tenantId: string;
  name: string;
  initials: string;
  company: string;
  email: string;
  status: "activo" | "prospecto" | "inactivo";
}

export type DealStage =
  | "prospeccion"
  | "calificacion"
  | "propuesta"
  | "negociacion"
  | "cierre";

export interface Deal {
  id: string;
  tenantId: string;
  title: string;
  company: string;
  value: number;
  owner: string;
  ownerInitials: string;
  stage: DealStage;
}

export type TaskUrgency = "alta" | "media" | "baja";

export interface Task {
  id: string;
  tenantId: string;
  title: string;
  contact: string;
  type: string;
  due: string;
  urgency: TaskUrgency;
  done: boolean;
}

export interface Activity {
  id: string;
  tenantId: string;
  avatar: string;
  text: string;
  time: string;
}

// --- Appointment types ---

export type AppointmentStatus = "programada" | "confirmada" | "completada" | "cancelada";
export type AppointmentSource = "manual" | "calcom" | "calendly";

export interface Appointment {
  id: string;
  tenantId: string;
  title: string;
  contactName: string;
  contactEmail: string;
  date: string; // ISO date string YYYY-MM-DD
  time: string; // HH:mm
  duration: number; // minutes
  status: AppointmentStatus;
  source: AppointmentSource;
  notes: string;
  assignee: string;
  assigneeInitials: string;
}
