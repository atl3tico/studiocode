<script lang="ts">
  import { reminderStore, webhookStore } from "$lib/data/store.svelte";
  import type { ReminderStatus, ReminderChannel, ReminderTrigger } from "$lib/data/types";

  let tab = $state<"reminders" | "webhooks">("reminders");
  let statusFilter = $state<ReminderStatus | "todos">("todos");
  let showWebhookForm = $state(false);

  // Webhook form state
  let whName = $state("");
  let whChannel = $state<ReminderChannel>("email");
  let whUrl = $state("");

  const filtered = $derived(
    statusFilter === "todos"
      ? reminderStore.list
      : reminderStore.list.filter(r => r.status === statusFilter)
  );

  const statusColors: Record<ReminderStatus, string> = {
    activo: "bg-blue-100 text-blue-800",
    enviado: "bg-green-100 text-green-800",
    fallido: "bg-red-100 text-red-800",
    cancelado: "bg-gray-100 text-gray-600",
  };

  const channelLabels: Record<ReminderChannel, string> = {
    email: "Email",
    whatsapp: "WhatsApp",
  };

  function formatDateTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  function addWebhook(e: Event) {
    e.preventDefault();
    webhookStore.add({
      name: whName,
      channel: whChannel,
      url: whUrl,
      active: true,
      secret: `whsec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    });
    whName = "";
    whUrl = "";
    showWebhookForm = false;
  }
</script>

<svelte:head>
  <title>Recordatorios - StudioCRM</title>
</svelte:head>

<!-- Header -->
<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
  <div>
    <h1 class="text-2xl font-bold">Recordatorios</h1>
    <p class="text-sm text-muted-foreground mt-1">
      {reminderStore.active.length} activos &middot; {reminderStore.sent.length} enviados
    </p>
  </div>
</div>

<!-- Tabs -->
<div class="flex gap-1 mb-6 border-b border-border">
  <button
    onclick={() => tab = "reminders"}
    class="px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px
      {tab === 'reminders' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}"
  >
    Notificaciones ({reminderStore.count})
  </button>
  <button
    onclick={() => tab = "webhooks"}
    class="px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px
      {tab === 'webhooks' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}"
  >
    Webhooks ({webhookStore.list.length})
  </button>
</div>

{#if tab === "reminders"}
  <!-- Status filters -->
  <div class="flex gap-2 mb-4 flex-wrap">
    {#each [["todos", "Todos"], ["activo", "Activos"], ["enviado", "Enviados"], ["fallido", "Fallidos"], ["cancelado", "Cancelados"]] as [value, label]}
      <button
        onclick={() => statusFilter = value as typeof statusFilter}
        class="rounded-full px-3 py-1.5 text-xs font-medium transition-colors
          {statusFilter === value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}"
      >
        {label}
      </button>
    {/each}
  </div>

  <!-- Reminder list -->
  {#if filtered.length === 0}
    <div class="rounded-lg border border-border p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <p class="text-muted-foreground">No hay recordatorios{statusFilter !== "todos" ? " con este filtro" : ""}</p>
    </div>
  {:else}
    <div class="space-y-2">
      {#each filtered as reminder}
        <div class="flex items-center gap-4 rounded-lg border border-border p-4 hover:bg-muted/30 transition-colors">
          <!-- Channel icon -->
          <div class="shrink-0">
            {#if reminder.channel === "email"}
              <div class="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            {:else}
              <div class="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                <svg class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            {/if}
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-medium truncate">{reminder.title}</span>
              <span class="inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium {statusColors[reminder.status]}">
                {reminderStore.statusLabel(reminder.status)}
              </span>
            </div>
            <div class="text-sm text-muted-foreground mt-0.5 truncate">
              {reminder.recipientName} &middot; {reminder.recipientContact}
            </div>
            <div class="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span>{channelLabels[reminder.channel]}</span>
              <span>&middot;</span>
              <span>{reminderStore.triggerLabel(reminder.trigger)}</span>
              <span>&middot;</span>
              <span>{formatDateTime(reminder.scheduledAt)}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 shrink-0">
            {#if reminder.status === "activo"}
              <button
                onclick={() => reminderStore.updateStatus(reminder.id, "cancelado")}
                class="rounded-md p-1.5 text-muted-foreground hover:bg-muted transition-colors"
                title="Cancelar"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            {/if}
            <button
              onclick={() => reminderStore.remove(reminder.id)}
              class="rounded-md p-1.5 text-destructive hover:bg-destructive/10 transition-colors"
              title="Eliminar"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}

{:else}
  <!-- Webhooks tab -->
  <div class="mb-4 flex justify-end">
    <button
      onclick={() => showWebhookForm = !showWebhookForm}
      class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Agregar webhook
    </button>
  </div>

  {#if showWebhookForm}
    <form onsubmit={addWebhook} class="rounded-lg border border-border p-4 mb-4 space-y-3">
      <div class="grid grid-cols-3 gap-3">
        <div>
          <label for="whName" class="block text-sm font-medium mb-1">Nombre</label>
          <input id="whName" type="text" bind:value={whName} required
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Ej: Email via SendGrid" />
        </div>
        <div>
          <label for="whChannel" class="block text-sm font-medium mb-1">Canal</label>
          <select id="whChannel" bind:value={whChannel}
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>
        <div>
          <label for="whUrl" class="block text-sm font-medium mb-1">URL del webhook</label>
          <input id="whUrl" type="url" bind:value={whUrl} required
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="https://..." />
        </div>
      </div>
      <div class="flex gap-2">
        <button type="submit" class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          Guardar
        </button>
        <button type="button" onclick={() => showWebhookForm = false} class="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  {/if}

  {#if webhookStore.list.length === 0}
    <div class="rounded-lg border border-border p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
      <p class="text-muted-foreground">No hay webhooks configurados</p>
      <p class="text-xs text-muted-foreground mt-1">Agrega endpoints para Email y WhatsApp</p>
    </div>
  {:else}
    <div class="space-y-2">
      {#each webhookStore.list as wh}
        <div class="flex items-center gap-4 rounded-lg border border-border p-4">
          <div class="shrink-0">
            <div class="h-10 w-10 rounded-lg {wh.channel === 'email' ? 'bg-blue-50' : 'bg-green-50'} flex items-center justify-center">
              {#if wh.channel === "email"}
                <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              {:else}
                <svg class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              {/if}
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-medium">{wh.name}</span>
              <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium {wh.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}">
                <span class="h-1.5 w-1.5 rounded-full {wh.active ? 'bg-green-500' : 'bg-gray-400'}"></span>
                {wh.active ? "Activo" : "Inactivo"}
              </span>
            </div>
            <div class="text-xs text-muted-foreground mt-0.5 font-mono truncate">{wh.url}</div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button
              onclick={() => webhookStore.toggle(wh.id)}
              class="rounded-md px-3 py-1.5 text-xs font-medium border border-border hover:bg-muted transition-colors"
            >
              {wh.active ? "Desactivar" : "Activar"}
            </button>
            <button
              onclick={() => webhookStore.remove(wh.id)}
              class="rounded-md p-1.5 text-destructive hover:bg-destructive/10 transition-colors"
              title="Eliminar"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
{/if}
