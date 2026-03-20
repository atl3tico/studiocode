<script lang="ts">
  import { appointmentStore } from "$lib/data/store.svelte";
  import { contactStore } from "$lib/data/store.svelte";
  import type { AppointmentStatus, AppointmentSource } from "$lib/data/types";

  let view = $state<"list" | "form">("list");
  let statusFilter = $state<AppointmentStatus | "todas">("todas");
  let editingId = $state<string | null>(null);

  // Form state
  let formTitle = $state("");
  let formContactName = $state("");
  let formContactEmail = $state("");
  let formDate = $state("");
  let formTime = $state("");
  let formDuration = $state(30);
  let formNotes = $state("");
  let formSource = $state<AppointmentSource>("manual");
  let formAssignee = $state("");
  let formAssigneeInitials = $state("");

  const filtered = $derived(
    statusFilter === "todas"
      ? appointmentStore.list.sort((a, b) => a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date))
      : appointmentStore.list
          .filter(a => a.status === statusFilter)
          .sort((a, b) => a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date))
  );

  const statusColors: Record<AppointmentStatus, string> = {
    programada: "bg-blue-100 text-blue-800",
    confirmada: "bg-green-100 text-green-800",
    completada: "bg-gray-100 text-gray-600",
    cancelada: "bg-red-100 text-red-800",
  };

  const sourceIcons: Record<AppointmentSource, string> = {
    manual: "Manual",
    calcom: "Cal.com",
    calendly: "Calendly",
  };

  function resetForm() {
    formTitle = "";
    formContactName = "";
    formContactEmail = "";
    formDate = new Date().toISOString().slice(0, 10);
    formTime = "10:00";
    formDuration = 30;
    formNotes = "";
    formSource = "manual";
    formAssignee = "";
    formAssigneeInitials = "";
    editingId = null;
  }

  function openNew() {
    resetForm();
    view = "form";
  }

  function openEdit(id: string) {
    const apt = appointmentStore.find(id);
    if (!apt) return;
    editingId = id;
    formTitle = apt.title;
    formContactName = apt.contactName;
    formContactEmail = apt.contactEmail;
    formDate = apt.date;
    formTime = apt.time;
    formDuration = apt.duration;
    formNotes = apt.notes;
    formSource = apt.source;
    formAssignee = apt.assignee;
    formAssigneeInitials = apt.assigneeInitials;
    view = "form";
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    const data = {
      title: formTitle,
      contactName: formContactName,
      contactEmail: formContactEmail,
      date: formDate,
      time: formTime,
      duration: formDuration,
      status: "programada" as AppointmentStatus,
      source: formSource,
      notes: formNotes,
      assignee: formAssignee,
      assigneeInitials: formAssignee.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
    };

    if (editingId) {
      appointmentStore.update(editingId, data);
    } else {
      appointmentStore.add(data);
    }
    view = "list";
    resetForm();
  }

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });
  }

  function formatDuration(mins: number): string {
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
</script>

<svelte:head>
  <title>Citas - StudioCRM</title>
</svelte:head>

{#if view === "list"}
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div>
      <h1 class="text-2xl font-bold">Citas</h1>
      <p class="text-sm text-muted-foreground mt-1">
        {appointmentStore.todayCount} citas hoy &middot; {appointmentStore.upcoming.length} proximas
      </p>
    </div>
    <button
      onclick={openNew}
      class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Nueva cita
    </button>
  </div>

  <!-- Filters -->
  <div class="flex gap-2 mb-4 flex-wrap">
    {#each [["todas", "Todas"], ["programada", "Programadas"], ["confirmada", "Confirmadas"], ["completada", "Completadas"], ["cancelada", "Canceladas"]] as [value, label]}
      <button
        onclick={() => statusFilter = value as typeof statusFilter}
        class="rounded-full px-3 py-1.5 text-xs font-medium transition-colors
          {statusFilter === value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}"
      >
        {label}
      </button>
    {/each}
  </div>

  <!-- Integration badges -->
  <div class="flex gap-2 mb-6">
    <span class="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs">
      <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
      Cal.com conectado
    </span>
    <span class="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs">
      <span class="h-2 w-2 rounded-full bg-blue-500"></span>
      Calendly conectado
    </span>
  </div>

  <!-- Appointment list -->
  {#if filtered.length === 0}
    <div class="rounded-lg border border-border p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-muted-foreground">No hay citas{statusFilter !== "todas" ? " con este filtro" : ""}</p>
    </div>
  {:else}
    <div class="space-y-2">
      {#each filtered as apt}
        <div class="flex items-center gap-4 rounded-lg border border-border p-4 hover:bg-muted/30 transition-colors">
          <!-- Date/time -->
          <div class="text-center shrink-0 w-20">
            <div class="text-xs text-muted-foreground">{formatDate(apt.date)}</div>
            <div class="text-lg font-bold">{apt.time}</div>
            <div class="text-xs text-muted-foreground">{formatDuration(apt.duration)}</div>
          </div>

          <!-- Divider -->
          <div class="w-px h-12 bg-border shrink-0"></div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-medium truncate">{apt.title}</span>
              <span class="inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium {statusColors[apt.status]}">
                {appointmentStore.statusLabel(apt.status)}
              </span>
            </div>
            <div class="text-sm text-muted-foreground mt-0.5 truncate">
              {apt.contactName} &middot; {apt.contactEmail}
            </div>
            <div class="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span>Via {sourceIcons[apt.source]}</span>
              <span>&middot;</span>
              <span>{apt.assignee}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 shrink-0">
            {#if apt.status === "programada"}
              <button
                onclick={() => appointmentStore.updateStatus(apt.id, "confirmada")}
                class="rounded-md p-1.5 text-green-600 hover:bg-green-50 transition-colors"
                title="Confirmar"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              </button>
            {/if}
            {#if apt.status !== "completada" && apt.status !== "cancelada"}
              <button
                onclick={() => appointmentStore.updateStatus(apt.id, "completada")}
                class="rounded-md p-1.5 text-muted-foreground hover:bg-muted transition-colors"
                title="Marcar completada"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
            {/if}
            <button
              onclick={() => openEdit(apt.id)}
              class="rounded-md p-1.5 text-muted-foreground hover:bg-muted transition-colors"
              title="Editar"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
            <button
              onclick={() => appointmentStore.remove(apt.id)}
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
  <!-- Form view -->
  <div class="max-w-2xl">
    <div class="flex items-center gap-3 mb-6">
      <button onclick={() => { view = "list"; resetForm(); }} class="rounded-md p-1.5 hover:bg-muted transition-colors">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <h1 class="text-2xl font-bold">{editingId ? "Editar cita" : "Nueva cita"}</h1>
    </div>

    <form onsubmit={handleSubmit} class="space-y-4">
      <div>
        <label for="title" class="block text-sm font-medium mb-1.5">Titulo</label>
        <input id="title" type="text" bind:value={formTitle} required
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Ej: Demo de producto" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="contactName" class="block text-sm font-medium mb-1.5">Nombre del contacto</label>
          <input id="contactName" type="text" bind:value={formContactName} required
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Nombre completo" />
        </div>
        <div>
          <label for="contactEmail" class="block text-sm font-medium mb-1.5">Email del contacto</label>
          <input id="contactEmail" type="email" bind:value={formContactEmail} required
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="email@ejemplo.com" />
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div>
          <label for="date" class="block text-sm font-medium mb-1.5">Fecha</label>
          <input id="date" type="date" bind:value={formDate} required
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label for="time" class="block text-sm font-medium mb-1.5">Hora</label>
          <input id="time" type="time" bind:value={formTime} required
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label for="duration" class="block text-sm font-medium mb-1.5">Duracion (min)</label>
          <select id="duration" bind:value={formDuration}
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
            <option value={45}>45 min</option>
            <option value={60}>1 hora</option>
            <option value={90}>1h 30m</option>
            <option value={120}>2 horas</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="assignee" class="block text-sm font-medium mb-1.5">Asignado a</label>
          <input id="assignee" type="text" bind:value={formAssignee} required
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Nombre del responsable" />
        </div>
        <div>
          <label for="source" class="block text-sm font-medium mb-1.5">Origen</label>
          <select id="source" bind:value={formSource}
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="manual">Manual</option>
            <option value="calcom">Cal.com</option>
            <option value="calendly">Calendly</option>
          </select>
        </div>
      </div>

      <div>
        <label for="notes" class="block text-sm font-medium mb-1.5">Notas</label>
        <textarea id="notes" bind:value={formNotes} rows="3"
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          placeholder="Notas adicionales..."></textarea>
      </div>

      <div class="flex gap-3 pt-2">
        <button type="submit"
          class="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          {editingId ? "Guardar cambios" : "Crear cita"}
        </button>
        <button type="button" onclick={() => { view = "list"; resetForm(); }}
          class="rounded-md border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  </div>
{/if}
