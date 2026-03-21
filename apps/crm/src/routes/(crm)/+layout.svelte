<script lang="ts">
  import { page } from "$app/stores";
  import { base } from "$app/paths";
  import { goto } from "$app/navigation";
  import { authStore } from "$lib/data/auth.svelte";
  import { tenantStore } from "$lib/data/tenant.svelte";
  import { loadTenantData, clearStoreData } from "$lib/data/store.svelte";

  let { children } = $props();
  let sidebarOpen = $state(true);
  let userMenuOpen = $state(false);
  let tenantMenuOpen = $state(false);

  // Guard: redirect to login if not authenticated
  $effect(() => {
    if (!authStore.isAuthenticated) {
      goto(`${base}/login`);
    }
  });

  // Guard: redirect to tenant selector if no tenant
  $effect(() => {
    if (authStore.isAuthenticated && !tenantStore.isSet) {
      goto(`${base}/select-tenant`);
    }
  });

  // Load tenant data when tenant is set
  $effect(() => {
    if (tenantStore.current) {
      loadTenantData(tenantStore.current.id);
    }
  });

  const userId = $derived(authStore.user?.id ?? "");
  const userTenants = $derived(tenantStore.getTenantsForUser(userId));

  function switchTenant(tenant: import("$lib/data/types").Tenant) {
    tenantMenuOpen = false;
    clearStoreData();
    tenantStore.setTenant(tenant);
    loadTenantData(tenant.id);
  }

  const navItems = [
    { href: `${base}/crm`, label: "Dashboard", icon: "dashboard" },
    { href: `${base}/crm/contacts`, label: "Contactos", icon: "contacts" },
    { href: `${base}/crm/deals`, label: "Ventas", icon: "deals" },
    { href: `${base}/crm/tasks`, label: "Tareas", icon: "tasks" },
    { href: `${base}/crm/appointments`, label: "Citas", icon: "appointments" },
    { href: `${base}/crm/reminders`, label: "Recordatorios", icon: "reminders" },
    { href: `${base}/crm/settings`, label: "Configuracion", icon: "settings" },
  ];

  function isActive(href: string): boolean {
    return $page.url.pathname === href || (href !== `${base}/crm` && $page.url.pathname.startsWith(href));
  }
</script>

{#if authStore.isAuthenticated}
<div class="flex h-screen overflow-hidden bg-background">
  <!-- Sidebar -->
  <aside class="hidden md:flex w-64 flex-col border-r border-sidebar-border bg-sidebar shrink-0 {sidebarOpen ? '' : '!w-16'}">
    <div class="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
      {#if sidebarOpen}
        <a href="{base}/" class="text-lg font-bold text-sidebar-primary">StudioCRM</a>
      {/if}
      <button onclick={() => sidebarOpen = !sidebarOpen} aria-label={sidebarOpen ? 'Colapsar barra lateral' : 'Expandir barra lateral'} class="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors">
        <svg class="h-5 w-5 text-sidebar-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
    <nav class="flex-1 overflow-y-auto p-3 space-y-1">
      {#each navItems as item}
        <a
          href={item.href}
          class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
            {isActive(item.href) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'}"
        >
          <span class="shrink-0">
            {#if item.icon === "dashboard"}
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            {:else if item.icon === "contacts"}
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            {:else if item.icon === "deals"}
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {:else if item.icon === "tasks"}
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            {:else if item.icon === "appointments"}
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {:else if item.icon === "reminders"}
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            {:else if item.icon === "settings"}
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {/if}
          </span>
          {#if sidebarOpen}
            <span>{item.label}</span>
          {/if}
        </a>
      {/each}
    </nav>
    <div class="border-t border-sidebar-border p-3">
      <a href="{base}/" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
        <svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        {#if sidebarOpen}
          <span>Volver al sitio</span>
        {/if}
      </a>
    </div>
  </aside>

  <!-- Main content -->
  <div class="flex-1 flex flex-col overflow-hidden">
    <header class="flex h-16 items-center justify-between border-b border-border px-6">
      <button class="md:hidden p-1.5 rounded-md hover:bg-muted" aria-label="Menu">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <!-- Tenant switcher -->
      {#if tenantStore.current}
        <div class="relative">
          <button
            onclick={() => { tenantMenuOpen = !tenantMenuOpen; userMenuOpen = false; }}
            class="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted transition-colors"
          >
            <div class="h-7 w-7 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              {tenantStore.current.name.charAt(0)}
            </div>
            <span class="hidden sm:block text-sm font-medium truncate max-w-[160px]">{tenantStore.current.name}</span>
            <svg class="h-4 w-4 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {#if tenantMenuOpen}
            <div class="absolute left-0 mt-1 w-64 rounded-md border border-border bg-popover shadow-lg z-50">
              <div class="px-3 py-2 border-b border-border">
                <p class="text-xs font-medium text-muted-foreground">Cambiar organizacion</p>
              </div>
              {#each userTenants as tenant}
                <button
                  onclick={() => switchTenant(tenant)}
                  class="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left
                    {tenant.id === tenantStore.current?.id ? 'bg-muted/50' : ''}"
                >
                  <div class="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                    {tenant.name.charAt(0)}
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="font-medium truncate">{tenant.name}</div>
                    <div class="text-xs text-muted-foreground">{tenant.slug}</div>
                  </div>
                  {#if tenant.id === tenantStore.current?.id}
                    <svg class="h-4 w-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  {/if}
                </button>
              {/each}
            </div>
          {/if}
        </div>
      {/if}

      <div class="flex-1"></div>
      {#if authStore.user}
        <div class="relative">
          <button
            onclick={() => userMenuOpen = !userMenuOpen}
            class="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted transition-colors"
          >
            <div class="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-secondary-foreground">
              {authStore.user.initials}
            </div>
            <span class="hidden sm:block text-sm font-medium">{authStore.user.name}</span>
          </button>

          {#if userMenuOpen}
            <div
              class="absolute right-0 mt-1 w-56 rounded-md border border-border bg-popover shadow-lg z-50"
              role="menu"
            >
              <div class="px-4 py-3 border-b border-border">
                <p class="text-sm font-medium">{authStore.user.name}</p>
                <p class="text-xs text-muted-foreground">{authStore.user.email}</p>
                <p class="text-xs text-muted-foreground capitalize">{authStore.user.role}</p>
              </div>
              <button
                onclick={() => { userMenuOpen = false; authStore.logout(); }}
                class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors"
                role="menuitem"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar sesion
              </button>
            </div>
          {/if}
        </div>
      {/if}
    </header>

    <main class="flex-1 overflow-y-auto p-6">
      {@render children()}
    </main>
  </div>
</div>
{/if}
