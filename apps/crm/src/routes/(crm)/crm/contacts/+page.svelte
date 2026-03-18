<script lang="ts">
  import { contactStore } from "$lib/data/store.svelte";
</script>

<svelte:head>
  <title>Contactos - StudioCRM</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-foreground">Contactos</h1>
      <p class="text-sm text-muted-foreground mt-1">{contactStore.count} contactos registrados</p>
    </div>
    <button class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
      + Nuevo contacto
    </button>
  </div>

  <!-- Search -->
  <div class="flex gap-3">
    <input type="text" placeholder="Buscar contactos..." class="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm" />
    <button class="rounded-md border border-input px-3 py-2 text-sm hover:bg-muted transition-colors">Filtros</button>
  </div>

  <!-- Table -->
  <div class="rounded-xl border border-border bg-card overflow-hidden">
    <table class="w-full">
      <thead>
        <tr class="border-b border-border bg-muted/30">
          <th class="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Nombre</th>
          <th class="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Empresa</th>
          <th class="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Email</th>
          <th class="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-border">
        {#each contactStore.list as contact}
          <tr class="hover:bg-muted/20 transition-colors cursor-pointer">
            <td class="p-4">
              <div class="flex items-center gap-3">
                <div class="h-8 w-8 rounded-full bg-secondary/30 flex items-center justify-center text-xs font-medium">
                  {contact.initials}
                </div>
                <span class="text-sm font-medium text-card-foreground">{contact.name}</span>
              </div>
            </td>
            <td class="p-4 text-sm text-muted-foreground hidden sm:table-cell">{contact.company}</td>
            <td class="p-4 text-sm text-muted-foreground hidden md:table-cell">{contact.email}</td>
            <td class="p-4">
              <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {contact.status === 'activo' ? 'bg-success/10 text-success' : contact.status === 'prospecto' ? 'bg-secondary/30 text-secondary-foreground' : 'bg-muted text-muted-foreground'}">
                {contact.status}
              </span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
