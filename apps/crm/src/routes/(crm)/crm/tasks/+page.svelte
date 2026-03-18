<script lang="ts">
  import { taskStore } from "$lib/data/store.svelte";
  import type { Task, TaskUrgency } from "$lib/data/types";

  let activeFilter = $state("Todas");
  let showForm = $state(false);
  let editingTask = $state<Task | null>(null);

  // Form fields
  let formTitle = $state("");
  let formContact = $state("");
  let formType = $state("Llamada");
  let formDue = $state("Hoy");
  let formUrgency = $state<TaskUrgency>("media");

  const filters = ["Todas", "Pendientes", "Completadas", "Alta prioridad"];

  const filtered = $derived(
    taskStore.list.filter((t) => {
      switch (activeFilter) {
        case "Pendientes": return !t.done;
        case "Completadas": return t.done;
        case "Alta prioridad": return t.urgency === "alta" && !t.done;
        default: return true;
      }
    })
  );

  function openNew() {
    editingTask = null;
    formTitle = "";
    formContact = "";
    formType = "Llamada";
    formDue = "Hoy";
    formUrgency = "media";
    showForm = true;
  }

  function openEdit(task: Task) {
    editingTask = task;
    formTitle = task.title;
    formContact = task.contact;
    formType = task.type;
    formDue = task.due;
    formUrgency = task.urgency;
    showForm = true;
  }

  function saveTask() {
    if (!formTitle.trim()) return;
    if (editingTask) {
      taskStore.update(editingTask.id, {
        title: formTitle.trim(),
        contact: formContact.trim(),
        type: formType,
        due: formDue,
        urgency: formUrgency,
      });
    } else {
      taskStore.add({
        title: formTitle.trim(),
        contact: formContact.trim(),
        type: formType,
        due: formDue,
        urgency: formUrgency,
        done: false,
      });
    }
    showForm = false;
  }
</script>

<svelte:head>
  <title>Tareas - StudioCRM</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-foreground">Tareas</h1>
      <p class="text-sm text-muted-foreground mt-1">{taskStore.pending.length} pendientes de {taskStore.list.length}</p>
    </div>
    <button
      onclick={openNew}
      class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
    >
      + Nueva tarea
    </button>
  </div>

  <!-- Task filters -->
  <div class="flex gap-2 flex-wrap">
    {#each filters as filter}
      <button
        onclick={() => activeFilter = filter}
        class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors {activeFilter === filter ? 'bg-primary text-primary-foreground' : 'border border-input hover:bg-muted'}"
      >
        {filter}
      </button>
    {/each}
  </div>

  <!-- Task list -->
  <div class="rounded-xl border border-border bg-card divide-y divide-border">
    {#each filtered as task}
      <div class="flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors">
        <input
          type="checkbox"
          checked={task.done}
          onchange={() => taskStore.toggle(task.id)}
          class="h-4 w-4 rounded border-input"
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-card-foreground {task.done ? 'line-through opacity-50' : ''}">{task.title}</p>
          <div class="flex items-center gap-3 mt-1">
            <span class="text-xs text-muted-foreground">{task.contact}</span>
            <span class="text-xs text-muted-foreground">&middot;</span>
            <span class="text-xs text-muted-foreground">{task.type}</span>
          </div>
        </div>
        <span class="text-xs font-medium rounded-full px-2.5 py-0.5 shrink-0 {task.urgency === 'alta' ? 'bg-destructive/10 text-destructive' : task.urgency === 'media' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}">
          {task.due}
        </span>
        <div class="flex items-center gap-1 shrink-0">
          <button
            onclick={() => openEdit(task)}
            class="rounded-md p-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Editar"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </button>
          <button
            onclick={() => taskStore.remove(task.id)}
            class="rounded-md p-1.5 hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
            title="Eliminar"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
    {/each}
    {#if filtered.length === 0}
      <div class="p-8 text-center text-sm text-muted-foreground">
        No hay tareas en esta vista
      </div>
    {/if}
  </div>
</div>

<!-- Modal Form -->
{#if showForm}
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <button class="absolute inset-0 bg-black/50" onclick={() => showForm = false} aria-label="Cerrar"></button>
    <div class="relative bg-card border border-border rounded-xl shadow-lg w-full max-w-md mx-4 p-6">
      <h2 class="text-lg font-semibold text-card-foreground mb-4">
        {editingTask ? "Editar tarea" : "Nueva tarea"}
      </h2>
      <form onsubmit={(e) => { e.preventDefault(); saveTask(); }} class="space-y-4">
        <div>
          <label for="ft-title" class="block text-sm font-medium mb-1.5">Titulo *</label>
          <input id="ft-title" type="text" bind:value={formTitle} required class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label for="ft-contact" class="block text-sm font-medium mb-1.5">Contacto / Empresa</label>
          <input id="ft-contact" type="text" bind:value={formContact} class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="ft-type" class="block text-sm font-medium mb-1.5">Tipo</label>
            <select id="ft-type" bind:value={formType} class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option>Llamada</option>
              <option>Email</option>
              <option>Reunion</option>
              <option>Seguimiento</option>
              <option>Admin</option>
            </select>
          </div>
          <div>
            <label for="ft-urgency" class="block text-sm font-medium mb-1.5">Urgencia</label>
            <select id="ft-urgency" bind:value={formUrgency} class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>
        <div>
          <label for="ft-due" class="block text-sm font-medium mb-1.5">Vencimiento</label>
          <input id="ft-due" type="text" bind:value={formDue} placeholder="Hoy, Manana, Viernes..." class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" onclick={() => showForm = false} class="flex-1 rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
            Cancelar
          </button>
          <button type="submit" class="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            {editingTask ? "Guardar" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
