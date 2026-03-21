/// <reference types="@sveltejs/kit" />

declare namespace App {
  interface Locals {
    /** Tenant slug resolved from subdomain or x-tenant-slug header */
    tenantSlug: string | null;
  }
  interface PageData {}
  interface Platform {}
}
