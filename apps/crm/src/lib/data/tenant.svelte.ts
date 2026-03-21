import type { Tenant, TenantMembership } from "./types";

// --- Mock tenants ---

const MOCK_TENANTS: Tenant[] = [
  {
    id: "t1",
    name: "TechCorp Solutions",
    slug: "techcorp",
    plan: "enterprise",
    settings: { locale: "es-ES", currency: "EUR", timezone: "Europe/Madrid" },
  },
  {
    id: "t2",
    name: "CreativeHub Agency",
    slug: "creativehub",
    plan: "pro",
    settings: { locale: "es-ES", currency: "EUR", timezone: "Europe/Madrid" },
  },
  {
    id: "t3",
    name: "StartupLab",
    slug: "startuplab",
    plan: "free",
    settings: { locale: "es-ES", currency: "EUR", timezone: "Europe/Madrid" },
  },
];

// User-tenant memberships (users can belong to multiple tenants)
const MOCK_MEMBERSHIPS: TenantMembership[] = [
  // Carlos (admin) belongs to all tenants
  { tenantId: "t1", userId: "u1", role: "owner" },
  { tenantId: "t2", userId: "u1", role: "admin" },
  { tenantId: "t3", userId: "u1", role: "admin" },
  // Ana (vendedor) belongs to TechCorp and CreativeHub
  { tenantId: "t1", userId: "u2", role: "vendedor" },
  { tenantId: "t2", userId: "u2", role: "vendedor" },
  // Luis (soporte) belongs to TechCorp only
  { tenantId: "t1", userId: "u3", role: "soporte" },
];

const STORAGE_KEY = "studiocrm_tenant";

function loadTenantSession(): Tenant | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

let currentTenant = $state<Tenant | null>(loadTenantSession());

export const tenantStore = {
  get current() {
    return currentTenant;
  },

  get isSet() {
    return currentTenant !== null;
  },

  get allTenants() {
    return MOCK_TENANTS;
  },

  /** Get tenants a user has access to */
  getTenantsForUser(userId: string): Array<Tenant & { role: TenantMembership["role"] }> {
    return MOCK_MEMBERSHIPS
      .filter((m) => m.userId === userId)
      .map((m) => {
        const tenant = MOCK_TENANTS.find((t) => t.id === m.tenantId);
        if (!tenant) return null;
        return { ...tenant, role: m.role };
      })
      .filter((t): t is NonNullable<typeof t> => t !== null);
  },

  /** Get user's role in current tenant */
  getUserRole(userId: string): TenantMembership["role"] | null {
    if (!currentTenant) return null;
    const membership = MOCK_MEMBERSHIPS.find(
      (m) => m.tenantId === currentTenant!.id && m.userId === userId,
    );
    return membership?.role ?? null;
  },

  /** Resolve tenant by slug */
  findBySlug(slug: string): Tenant | undefined {
    return MOCK_TENANTS.find((t) => t.slug === slug);
  },

  /** Check if user has access to a tenant */
  hasAccess(userId: string, tenantId: string): boolean {
    return MOCK_MEMBERSHIPS.some(
      (m) => m.userId === userId && m.tenantId === tenantId,
    );
  },

  /** Set active tenant */
  setTenant(tenant: Tenant) {
    currentTenant = tenant;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tenant));
  },

  /** Clear tenant (on logout or switch) */
  clear() {
    currentTenant = null;
    localStorage.removeItem(STORAGE_KEY);
  },
};
