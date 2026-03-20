import { next } from "@vercel/functions";

/**
 * Vercel Edge Middleware for multi-tenant subdomain routing.
 *
 * Extracts tenant slug from subdomain pattern:
 *   {slug}.crm.studiocode.com → sets x-tenant-slug header
 *
 * Runs at the edge before the SvelteKit server, providing
 * low-latency tenant resolution without a round-trip to origin.
 */

const BASE_DOMAIN = process.env.CRM_BASE_DOMAIN ?? "crm.studiocode.com";

/** Known tenant slugs — kept in sync with hooks.server.ts */
const VALID_SLUGS = new Set(["techcorp", "creativehub", "startuplab"]);

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _vercel (Vercel internals)
     * - Static files with extensions (.js, .css, .png, etc.)
     */
    "/((?!_vercel|.*\\.).*)",
  ],
};

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const hostname = url.hostname;

  let slug: string | null = null;

  // Extract slug from subdomain: {slug}.crm.studiocode.com
  if (hostname.endsWith(`.${BASE_DOMAIN}`)) {
    const candidate = hostname.slice(0, -(BASE_DOMAIN.length + 1));
    if (candidate && !candidate.includes(".") && VALID_SLUGS.has(candidate)) {
      slug = candidate;
    }
  }

  // Local dev fallback: {slug}.localhost
  if (!slug && hostname.endsWith(".localhost")) {
    const candidate = hostname.slice(0, -".localhost".length);
    if (candidate && !candidate.includes(".") && VALID_SLUGS.has(candidate)) {
      slug = candidate;
    }
  }

  // Subdomain detected but not a valid tenant — return 404
  if (!slug && hostname !== BASE_DOMAIN && hostname !== "localhost") {
    const isSubdomain =
      hostname.endsWith(`.${BASE_DOMAIN}`) ||
      hostname.endsWith(".localhost");
    if (isSubdomain) {
      return new Response("Tenant not found", { status: 404 });
    }
  }

  if (slug) {
    // Forward tenant slug to SvelteKit via request header
    return next({
      headers: {
        "x-tenant-slug": slug,
      },
    });
  }

  // No subdomain — continue without tenant header (marketing site)
  return next();
}
