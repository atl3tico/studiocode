<script lang="ts">
  import { page } from "$app/stores";
  import { base } from "$app/paths";

  let { children } = $props();
  let mobileOpen = $state(false);

  const navLinks = [
    { href: `${base}/`, label: "Inicio" },
    { href: `${base}/#features`, label: "Funciones" },
    { href: `${base}/#pricing`, label: "Precios" },
    { href: `${base}/#contact`, label: "Contacto" },
  ];
</script>

<div class="min-h-screen flex flex-col">
  <header class="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <nav class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <a href="{base}/" class="text-xl font-bold text-primary">StudioCRM</a>

      <div class="hidden md:flex items-center gap-8">
        {#each navLinks as link}
          <a href={link.href} class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {link.label}
          </a>
        {/each}
        <a href="{base}/login" class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          Acceder al CRM
        </a>
      </div>

      <button
        class="md:hidden p-2"
        onclick={() => mobileOpen = !mobileOpen}
        aria-label="Toggle menu"
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {#if mobileOpen}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          {:else}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          {/if}
        </svg>
      </button>
    </nav>

    {#if mobileOpen}
      <div class="md:hidden border-t border-border px-6 py-4 space-y-3">
        {#each navLinks as link}
          <a href={link.href} class="block text-sm font-medium text-muted-foreground hover:text-foreground" onclick={() => mobileOpen = false}>
            {link.label}
          </a>
        {/each}
        <a href="{base}/login" class="block w-full text-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Acceder al CRM
        </a>
      </div>
    {/if}
  </header>

  <main class="flex-1">
    {@render children()}
  </main>

  <footer class="border-t border-border bg-muted/30">
    <div class="mx-auto max-w-7xl px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-lg font-bold text-primary">StudioCRM</h3>
          <p class="mt-2 text-sm text-muted-foreground">Gestiona tus clientes, ventas y equipo en un solo lugar.</p>
        </div>
        <div>
          <h4 class="font-semibold text-sm mb-3">Producto</h4>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li><a href="{base}/#features" class="hover:text-foreground">Funciones</a></li>
            <li><a href="{base}/#pricing" class="hover:text-foreground">Precios</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-sm mb-3">Contacto</h4>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li><a href="{base}/#contact" class="hover:text-foreground">Formulario</a></li>
          </ul>
        </div>
      </div>
      <div class="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} StudioCRM. Todos los derechos reservados.
      </div>
    </div>
  </footer>
</div>
