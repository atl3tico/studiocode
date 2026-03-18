import type { Contact, Deal, DealStage, Task, Activity } from "./types";
import { seedContacts, seedDeals, seedTasks, seedActivities } from "./mock-data";

let nextId = 100;
function genId(prefix: string): string {
  return `${prefix}${nextId++}`;
}

function formatCurrency(n: number): string {
  return `€${n.toLocaleString("es-ES")}`;
}

// --- Contacts ---

let contacts = $state<Contact[]>([...seedContacts]);

export const contactStore = {
  get list() { return contacts; },
  get count() { return contacts.length; },

  add(data: Omit<Contact, "id" | "initials">) {
    const initials = data.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const contact: Contact = { ...data, id: genId("c"), initials };
    contacts = [contact, ...contacts];
    return contact;
  },

  update(id: string, data: Partial<Omit<Contact, "id">>) {
    contacts = contacts.map(c => c.id === id ? { ...c, ...data } : c);
  },

  remove(id: string) {
    contacts = contacts.filter(c => c.id !== id);
  },

  find(id: string) {
    return contacts.find(c => c.id === id);
  },
};

// --- Deals ---

let deals = $state<Deal[]>([...seedDeals]);

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

  add(data: Omit<Deal, "id">) {
    const deal: Deal = { ...data, id: genId("d") };
    deals = [deal, ...deals];
    return deal;
  },

  update(id: string, data: Partial<Omit<Deal, "id">>) {
    deals = deals.map(d => d.id === id ? { ...d, ...data } : d);
  },

  move(id: string, stage: DealStage) {
    deals = deals.map(d => d.id === id ? { ...d, stage } : d);
  },

  remove(id: string) {
    deals = deals.filter(d => d.id !== id);
  },
};

// --- Tasks ---

let tasks = $state<Task[]>([...seedTasks]);

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

  add(data: Omit<Task, "id">) {
    const task: Task = { ...data, id: genId("t") };
    tasks = [task, ...tasks];
    return task;
  },

  update(id: string, data: Partial<Omit<Task, "id">>) {
    tasks = tasks.map(t => t.id === id ? { ...t, ...data } : t);
  },

  toggle(id: string) {
    tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  },

  remove(id: string) {
    tasks = tasks.filter(t => t.id !== id);
  },
};

// --- Activities ---

let activities = $state<Activity[]>([...seedActivities]);

export const activityStore = {
  get list() { return activities; },

  add(data: Omit<Activity, "id">) {
    const activity: Activity = { ...data, id: genId("a") };
    activities = [activity, ...activities];
    return activity;
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
