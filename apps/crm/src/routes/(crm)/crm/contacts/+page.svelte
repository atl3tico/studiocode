<script lang="ts">
  import { contactStore } from "$lib/data/store.svelte";
  import type { Contact } from "$lib/data/types";

  let search = $state("");
  let statusFilter = $state<"todos" | Contact["status"]>("todos");
  let showForm = $state(false);
  let editingContact = $state<Contact | null>(null);

  // Form fields
  let formName = $state("");
  let formCompany = $state("");
  let formEmail = $state("");
  let formStatus = $state<Contact["status"]>("prospecto");

  const filtered = $derived(
    contactStore.list.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "todos" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
  );

  function openNew() {
    editingContact = null;
    formName = "";
    formCompany = "";
    formEmail = "";
    formStatus = "prospecto";
    showForm = true;
  }

  function openEdit(contact: Contact) {
    editingContact = contact;
    formName = contact.name;
    formCompany = contact.company;
    formEmail = contact.email;
    formStatus = contact.status;
    showForm = true;
  }

  function saveContact() {
    if (!formName.trim() || !formEmail.trim()) return;
    if (editingContact) {
      contactStore.update(editingContact.id, {
        name: formName.trim(),
        company: formCompany.trim(),
        email: formEmail.trim(),
        status: formStatus,
      });
    } else {
      contactStore.add({
        name: formName.trim(),
        company: formCompany.trim(),
        email: formEmail.trim(),
        status: formStatus,
      });
    }
    showForm = false;
  }

  function deleteContact(id: string) {
    contactStore.remove(id);
  }
</script>

<svelte:head>
  <title>Contactos - StudioCRM</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-foreground">Contactos</h1>
      <p class="text-sm text-muted-foreground mt-1">{filtered.length} de {contactStore.count} contactos</p>
    </div>
    <button
      onclick={openNew}
      class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
    >
      + Nuevo contacto
    </button>
  </div>

  <!-- Search & Filters -->
  <div class="flex flex-col sm:flex-row gap-3">
    <input
      type="text"
      placeholder="Buscar contactos..."
      bind:value={search}
      class="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
    />
    <div class="flex gap-2">
      {#each [{ key: "todos", label: "Todos" }, { key: "activo", label: "Activos" }, { key: "prospecto", label: "Prospectos" }, { key: "inactivo", label: "Inactivos" }] as opt}
        <button
          onclick={() => statusFilter = opt.key as typeof statusFilter}
          class="rounded-md px-3 py-2 text-sm font-medium transition-colors {statusFilter === opt.key ? 'bg-primary text-primary-foreground' : 'border border-input hover:bg-muted'}"
        >
          {opt.label}
        </button>
      {/each}
    </div>
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
          <th class="text-right p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-border">
        {#each filtered as contact}
          <tr class="hover:bg-muted/20 transition-colors">
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
            <td class="p-4 text-right">
              <div class="flex items-center justify-end gap-1">
                <button
                  onclick={() => openEdit(contact)}
                  class="rounded-md p-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  title="Editar"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button
                  onclick={() => deleteContact(contact.id)}
                  class="rounded-md p-1.5 hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                  title="Eliminar"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </td>
          </tr>
        {/each}
        {#if filtered.length === 0}
          <tr>
            <td colspan="5" class="p-8 text-center text-sm text-muted-foreground">
              No se encontraron contactos
            </td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>
</div>

<!-- Modal Form -->
{#if showForm}
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <button class="absolute inset-0 bg-black/50" onclick={() => showForm = false} aria-label="Cerrar"></button>
    <div class="relative bg-card border border-border rounded-xl shadow-lg w-full max-w-md mx-4 p-6">
      <h2 class="text-lg font-semibold text-card-foreground mb-4">
        {editingContact ? "Editar contacto" : "Nuevo contacto"}
      </h2>
      <form onsubmit={(e) => { e.preventDefault(); saveContact(); }} class="space-y-4">
        <div>
          <label for="fc-name" class="block text-sm font-medium mb-1.5">Nombre *</label>
          <input id="fc-name" type="text" bind:value={formName} required class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label for="fc-company" class="block text-sm font-medium mb-1.5">Empresa</label>
          <input id="fc-company" type="text" bind:value={formCompany} class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label for="fc-email" class="block text-sm font-medium mb-1.5">Email *</label>
          <input id="fc-email" type="email" bind:value={formEmail} required class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label for="fc-status" class="block text-sm font-medium mb-1.5">Estado</label>
          <select id="fc-status" bind:value={formStatus} class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="prospecto">Prospecto</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" onclick={() => showForm = false} class="flex-1 rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
            Cancelar
          </button>
          <button type="submit" class="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            {editingContact ? "Guardar" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
