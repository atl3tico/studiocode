export interface Contact {
  id: string;
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
  title: string;
  contact: string;
  type: string;
  due: string;
  urgency: TaskUrgency;
  done: boolean;
}

export interface Activity {
  id: string;
  avatar: string;
  text: string;
  time: string;
}
