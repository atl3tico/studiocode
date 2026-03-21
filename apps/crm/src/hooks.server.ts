import type { Handle } from "@sveltejs/kit";

/**
 * Known tenant slugs for validation.
 * In production this would be a DB lookup or cache.
 */
const VALID_SLUGS = new Set(["techcorp", "creativehub", "startuplab"]);

/** Base domain used to extract subdomain (configurable via env). */
const BASE_DOMAIN = process.env.CRM_BASE_DOMAIN ?? "crm.studiocode.com";

/**
 * Extract tenant slug from the request.
 * Priority: 1) x-tenant-slug header (set by Edge Middleware)
 *           2) subdomain parsing from Host header
 */
function resolveTenantSlug(request: Request): string | null {
  // Edge Middleware sets this header after subdomain extraction
  const headerSlug = request.headers.get("x-tenant-slug");
  if (headerSlug && VALID_SLUGS.has(headerSlug)) {
    return headerSlug;
  }

  // Fallback: parse subdomain from Host header
  const host = request.headers.get("host");
  if (!host) return null;

  // Strip port for local dev (e.g. techcorp.localhost:5173)
  const hostname = host.split(":")[0];

  // Check for subdomain pattern: {slug}.{base_domain}
  if (hostname.endsWith(`.${BASE_DOMAIN}`)) {
    const slug = hostname.slice(0, -(BASE_DOMAIN.length + 1));
    if (slug && !slug.includes(".") && VALID_SLUGS.has(slug)) {
      return slug;
    }
  }

  // Local dev: {slug}.localhost
  if (hostname.endsWith(".localhost")) {
    const slug = hostname.slice(0, -".localhost".length);
    if (slug && !slug.includes(".") && VALID_SLUGS.has(slug)) {
      return slug;
    }
  }

  return null;
}

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.tenantSlug = resolveTenantSlug(event.request);
  return resolve(event);
};
