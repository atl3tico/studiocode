<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { authStore } from "$lib/data/auth.svelte";
  import { tenantStore } from "$lib/data/tenant.svelte";
  import { loadTenantData } from "$lib/data/store.svelte";
  import type { Tenant } from "$lib/data/types";

  // Guard: must be authenticated
  $effect(() => {
    if (!authStore.isAuthenticated) {
      goto(`${base}/login`);
    }
  });

  // If tenant already selected, go to CRM
  $effect(() => {
    if (tenantStore.isSet) {
      goto(`${base}/crm`);
    }
  });

  const userId = $derived(authStore.user?.id ?? "");
  const userTenants = $derived(tenantStore.getTenantsForUser(userId));

  const planLabels: Record<string, string> = {
    free: "Gratis",
    pro: "Profesional",
    enterprise: "Empresa",
  };

  const planColors: Record<string, string> = {
    free: "bg-muted text-muted-foreground",
    pro: "bg-blue-100 text-blue-800",
    enterprise: "bg-purple-100 text-purple-800",
  };

  const roleLabels: Record<string, string> = {
    owner: "Propietario",
    admin: "Administrador",
    vendedor: "Vendedor",
    soporte: "Soporte",
  };

  function selectTenant(tenant: Tenant) {
    tenantStore.setTenant(tenant);
    loadTenantData(tenant.id);
    goto(`${base}/crm`);
  }
</script>

<svelte:head>
  <title>Seleccionar organizacion - StudioCRM</title>
</svelte:head>

{#if authStore.isAuthenticated && !tenantStore.isSet}
<div class="min-h-screen flex items-center justify-center bg-background p-6">
  <div class="w-full max-w-lg">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-primary">Selecciona tu organizacion</h1>
      <p class="mt-2 text-sm text-muted-foreground">
        Hola {authStore.user?.name}, elige con que organizacion trabajar
      </p>
    </div>

    {#if userTenants.length === 0}
      <div class="rounded-lg border border-border p-8 text-center">
        <p class="text-muted-foreground">No tienes acceso a ninguna organizacion.</p>
        <button
          onclick={() => authStore.logout()}
          class="mt-4 text-sm text-primary underline hover:no-underline"
        >
          Cerrar sesion
        </button>
      </div>
    {:else}
      <div class="space-y-3">
        {#each userTenants as tenant}
          <button
            onclick={() => selectTenant(tenant)}
            class="w-full flex items-center gap-4 rounded-lg border border-border p-4 text-left hover:bg-muted/50 hover:border-primary/30 transition-colors group"
          >
            <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
              {tenant.name.charAt(0)}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-semibold truncate">{tenant.name}</span>
                <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium {planColors[tenant.plan] ?? planColors.free}">
                  {planLabels[tenant.plan] ?? tenant.plan}
                </span>
              </div>
              <div class="text-xs text-muted-foreground mt-0.5">
                {roleLabels[tenant.role] ?? tenant.role} &middot; {tenant.slug}
              </div>
            </div>
            <svg class="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        {/each}
      </div>

      <div class="mt-6 text-center">
        <button
          onclick={() => authStore.logout()}
          class="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Cambiar de cuenta
        </button>
      </div>
    {/if}
  </div>
</div>
{/if}
