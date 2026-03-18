import { goto } from "$app/navigation";
import { base } from "$app/paths";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: "admin" | "vendedor" | "soporte";
}

const MOCK_USERS: AuthUser[] = [
  { id: "u1", name: "Carlos Demo", email: "carlos@studiocrm.com", initials: "CD", role: "admin" },
  { id: "u2", name: "Ana Ventas", email: "ana@studiocrm.com", initials: "AV", role: "vendedor" },
  { id: "u3", name: "Luis Soporte", email: "luis@studiocrm.com", initials: "LS", role: "soporte" },
];

const STORAGE_KEY = "studiocrm_auth";

function loadSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

let currentUser = $state<AuthUser | null>(loadSession());

export const authStore = {
  get user() { return currentUser; },
  get isAuthenticated() { return currentUser !== null; },
  get mockUsers() { return MOCK_USERS; },

  login(email: string, password: string): { success: boolean; error?: string } {
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      return { success: false, error: "Usuario no encontrado" };
    }
    // Mock auth: any non-empty password works
    if (!password) {
      return { success: false, error: "Ingresa una contrasena" };
    }
    currentUser = user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return { success: true };
  },

  logout() {
    currentUser = null;
    localStorage.removeItem(STORAGE_KEY);
    goto(`${base}/login`);
  },
};
