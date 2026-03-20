import type { Contact, Deal, DealStage, Task, Activity, Appointment, AppointmentStatus, Reminder, ReminderChannel, ReminderStatus, ReminderTrigger, WebhookConfig } from "./types";
import { getSeedDataForTenant } from "./mock-data";
import { tenantStore } from "./tenant.svelte";

let nextId = 100;
function genId(prefix: string): string {
  return `${prefix}${nextId++}`;
}

function formatCurrency(n: number): string {
  return `€${n.toLocaleString("es-ES")}`;
}

function requireTenantId(): string {
  const tenant = tenantStore.current;
  if (!tenant) throw new Error("No active tenant");
  return tenant.id;
}

// --- Tenant-scoped localStorage helpers ---

function storageKey(tenantId: string, store: string): string {
  return `studiocrm_${tenantId}_${store}`;
}

function loadFromStorage<T>(tenantId: string, store: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey(tenantId, store));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage<T>(tenantId: string, store: string, data: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(tenantId, store), JSON.stringify(data));
}

// --- State ---

let contacts = $state<Contact[]>([]);
let deals = $state<Deal[]>([]);
let tasks = $state<Task[]>([]);
let activities = $state<Activity[]>([]);
let appointments = $state<Appointment[]>([]);
let reminders = $state<Reminder[]>([]);
let webhooks = $state<WebhookConfig[]>([]);
let currentTenantId = $state<string | null>(null);

/** Load data for a tenant (from localStorage or seed data) */
export function loadTenantData(tenantId: string): void {
  if (currentTenantId === tenantId) return;
  currentTenantId = tenantId;

  const seed = getSeedDataForTenant(tenantId);
  contacts = loadFromStorage<Contact[]>(tenantId, "contacts") ?? [...seed.contacts];
  deals = loadFromStorage<Deal[]>(tenantId, "deals") ?? [...seed.deals];
  tasks = loadFromStorage<Task[]>(tenantId, "tasks") ?? [...seed.tasks];
  activities = loadFromStorage<Activity[]>(tenantId, "activities") ?? [...seed.activities];
  appointments = loadFromStorage<Appointment[]>(tenantId, "appointments") ?? [...seed.appointments];
  reminders = loadFromStorage<Reminder[]>(tenantId, "reminders") ?? [...seed.reminders];
  webhooks = loadFromStorage<WebhookConfig[]>(tenantId, "webhooks") ?? [...seed.webhooks];
}

/** Clear all in-memory data (on logout) */
export function clearStoreData(): void {
  currentTenantId = null;
  contacts = [];
  deals = [];
  tasks = [];
  activities = [];
  appointments = [];
  reminders = [];
  webhooks = [];
}

function persistContacts() {
  if (currentTenantId) saveToStorage(currentTenantId, "contacts", contacts);
}
function persistDeals() {
  if (currentTenantId) saveToStorage(currentTenantId, "deals", deals);
}
function persistTasks() {
  if (currentTenantId) saveToStorage(currentTenantId, "tasks", tasks);
}
function persistActivities() {
  if (currentTenantId) saveToStorage(currentTenantId, "activities", activities);
}
function persistAppointments() {
  if (currentTenantId) saveToStorage(currentTenantId, "appointments", appointments);
}
function persistReminders() {
  if (currentTenantId) saveToStorage(currentTenantId, "reminders", reminders);
}
function persistWebhooks() {
  if (currentTenantId) saveToStorage(currentTenantId, "webhooks", webhooks);
}

// --- Contacts ---

export const contactStore = {
  get list() { return contacts; },
  get count() { return contacts.length; },

  add(data: Omit<Contact, "id" | "initials" | "tenantId">) {
    const tenantId = requireTenantId();
    const initials = data.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const contact: Contact = { ...data, id: genId("c"), initials, tenantId };
    contacts = [contact, ...contacts];
    persistContacts();
    return contact;
  },

  update(id: string, data: Partial<Omit<Contact, "id" | "tenantId">>) {
    contacts = contacts.map(c => c.id === id ? { ...c, ...data } : c);
    persistContacts();
  },

  remove(id: string) {
    contacts = contacts.filter(c => c.id !== id);
    persistContacts();
  },

  find(id: string) {
    return contacts.find(c => c.id === id);
  },
};

// --- Deals ---

const stageOrder: DealStage[] = ["prospeccion", "calificacion", "propuesta", "negociacion", "cierre"];
const stageLabels: Record<DealStage, string> = {
  prospeccion: "Prospeccion",
  calificacion: "Calificacion",
  propuesta: "Propuesta",
  negociacion: "Negociacion",
  cierre: "Cierre",
};

export const dealStore = {
  get list() { return deals; },

  get stages() {
    return stageOrder.map(stage => {
      const stageDeals = deals.filter(d => d.stage === stage);
      const total = stageDeals.reduce((sum, d) => sum + d.value, 0);
      return {
        key: stage,
        name: stageLabels[stage],
        deals: stageDeals,
        total: formatCurrency(total),
        count: stageDeals.length,
      };
    });
  },

  get pipeline() {
    const maxCount = Math.max(...stageOrder.map(s => deals.filter(d => d.stage === s).length), 1);
    return stageOrder.map(stage => {
      const stageDeals = deals.filter(d => d.stage === stage);
      const total = stageDeals.reduce((sum, d) => sum + d.value, 0);
      return {
        name: stageLabels[stage],
        count: stageDeals.length,
        value: formatCurrency(total),
        percent: Math.round((stageDeals.length / maxCount) * 100),
      };
    });
  },

  get activeCount() { return deals.length; },

  get monthlyRevenue() {
    const closed = deals.filter(d => d.stage === "cierre");
    return formatCurrency(closed.reduce((sum, d) => sum + d.value, 0));
  },

  add(data: Omit<Deal, "id" | "tenantId">) {
    const tenantId = requireTenantId();
    const deal: Deal = { ...data, id: genId("d"), tenantId };
    deals = [deal, ...deals];
    persistDeals();
    return deal;
  },

  update(id: string, data: Partial<Omit<Deal, "id" | "tenantId">>) {
    deals = deals.map(d => d.id === id ? { ...d, ...data } : d);
    persistDeals();
  },

  move(id: string, stage: DealStage) {
    deals = deals.map(d => d.id === id ? { ...d, stage } : d);
    persistDeals();
  },

  remove(id: string) {
    deals = deals.filter(d => d.id !== id);
    persistDeals();
  },
};

// --- Tasks ---

export const taskStore = {
  get list() { return tasks; },
  get pending() { return tasks.filter(t => !t.done); },

  get dashboardTasks() {
    return tasks.filter(t => !t.done).slice(0, 4).map(t => ({
      id: t.id,
      title: t.title,
      contact: t.contact,
      due: t.due,
      urgency: t.urgency === "alta" ? "high" : t.urgency === "media" ? "medium" : "low",
    }));
  },

  add(data: Omit<Task, "id" | "tenantId">) {
    const tenantId = requireTenantId();
    const task: Task = { ...data, id: genId("t"), tenantId };
    tasks = [task, ...tasks];
    persistTasks();
    return task;
  },

  update(id: string, data: Partial<Omit<Task, "id" | "tenantId">>) {
    tasks = tasks.map(t => t.id === id ? { ...t, ...data } : t);
    persistTasks();
  },

  toggle(id: string) {
    tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    persistTasks();
  },

  remove(id: string) {
    tasks = tasks.filter(t => t.id !== id);
    persistTasks();
  },
};

// --- Activities ---

export const activityStore = {
  get list() { return activities; },

  add(data: Omit<Activity, "id" | "tenantId">) {
    const tenantId = requireTenantId();
    const activity: Activity = { ...data, id: genId("a"), tenantId };
    activities = [activity, ...activities];
    persistActivities();
    return activity;
  },
};

// --- Appointments ---

const statusLabels: Record<AppointmentStatus, string> = {
  programada: "Programada",
  confirmada: "Confirmada",
  completada: "Completada",
  cancelada: "Cancelada",
};

export const appointmentStore = {
  get list() { return appointments; },
  get count() { return appointments.length; },

  get upcoming() {
    const today = new Date().toISOString().slice(0, 10);
    return appointments
      .filter(a => a.date >= today && a.status !== "cancelada" && a.status !== "completada")
      .sort((a, b) => a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date));
  },

  get todayCount() {
    const today = new Date().toISOString().slice(0, 10);
    return appointments.filter(a => a.date === today && a.status !== "cancelada").length;
  },

  getByDate(date: string) {
    return appointments
      .filter(a => a.date === date)
      .sort((a, b) => a.time.localeCompare(b.time));
  },

  statusLabel(status: AppointmentStatus): string {
    return statusLabels[status];
  },

  add(data: Omit<Appointment, "id" | "tenantId">) {
    const tenantId = requireTenantId();
    const appointment: Appointment = { ...data, id: genId("ap"), tenantId };
    appointments = [appointment, ...appointments];
    persistAppointments();
    return appointment;
  },

  update(id: string, data: Partial<Omit<Appointment, "id" | "tenantId">>) {
    appointments = appointments.map(a => a.id === id ? { ...a, ...data } : a);
    persistAppointments();
  },

  updateStatus(id: string, status: AppointmentStatus) {
    appointments = appointments.map(a => a.id === id ? { ...a, status } : a);
    persistAppointments();
  },

  remove(id: string) {
    appointments = appointments.filter(a => a.id !== id);
    persistAppointments();
  },

  find(id: string) {
    return appointments.find(a => a.id === id);
  },
};

// --- Reminders ---

const triggerLabels: Record<ReminderTrigger, string> = {
  appointment_24h: "24h antes de cita",
  appointment_1h: "1h antes de cita",
  deal_followup: "Seguimiento de deal",
  task_due: "Tarea por vencer",
  custom: "Personalizado",
};

const reminderStatusLabels: Record<ReminderStatus, string> = {
  activo: "Activo",
  enviado: "Enviado",
  fallido: "Fallido",
  cancelado: "Cancelado",
};

export const reminderStore = {
  get list() { return reminders; },
  get count() { return reminders.length; },

  get active() {
    return reminders.filter(r => r.status === "activo");
  },

  get sent() {
    return reminders.filter(r => r.status === "enviado");
  },

  triggerLabel(trigger: ReminderTrigger): string {
    return triggerLabels[trigger];
  },

  statusLabel(status: ReminderStatus): string {
    return reminderStatusLabels[status];
  },

  add(data: Omit<Reminder, "id" | "tenantId" | "createdAt">) {
    const tenantId = requireTenantId();
    const reminder: Reminder = { ...data, id: genId("rm"), tenantId, createdAt: new Date().toISOString() };
    reminders = [reminder, ...reminders];
    persistReminders();
    return reminder;
  },

  update(id: string, data: Partial<Omit<Reminder, "id" | "tenantId">>) {
    reminders = reminders.map(r => r.id === id ? { ...r, ...data } : r);
    persistReminders();
  },

  updateStatus(id: string, status: ReminderStatus) {
    reminders = reminders.map(r => r.id === id ? { ...r, status } : r);
    persistReminders();
  },

  remove(id: string) {
    reminders = reminders.filter(r => r.id !== id);
    persistReminders();
  },

  find(id: string) {
    return reminders.find(r => r.id === id);
  },
};

// --- Webhook Configs ---

export const webhookStore = {
  get list() { return webhooks; },

  get activeByChannel(): Record<ReminderChannel, WebhookConfig | undefined> {
    return {
      email: webhooks.find(w => w.channel === "email" && w.active),
      whatsapp: webhooks.find(w => w.channel === "whatsapp" && w.active),
    };
  },

  add(data: Omit<WebhookConfig, "id" | "tenantId">) {
    const tenantId = requireTenantId();
    const config: WebhookConfig = { ...data, id: genId("wh"), tenantId };
    webhooks = [config, ...webhooks];
    persistWebhooks();
    return config;
  },

  update(id: string, data: Partial<Omit<WebhookConfig, "id" | "tenantId">>) {
    webhooks = webhooks.map(w => w.id === id ? { ...w, ...data } : w);
    persistWebhooks();
  },

  toggle(id: string) {
    webhooks = webhooks.map(w => w.id === id ? { ...w, active: !w.active } : w);
    persistWebhooks();
  },

  remove(id: string) {
    webhooks = webhooks.filter(w => w.id !== id);
    persistWebhooks();
  },
};

// --- Dashboard KPIs (derived) ---

export const kpiStore = {
  get items() {
    return [
      { label: "Contactos totales", value: contacts.length.toLocaleString("es-ES"), trend: 12 },
      { label: "Deals activos", value: String(deals.length), trend: 8 },
      { label: "Ingresos del mes", value: dealStore.monthlyRevenue, trend: 15 },
      { label: "Tasa de conversion", value: "24%", trend: -3 },
    ];
  },
};
