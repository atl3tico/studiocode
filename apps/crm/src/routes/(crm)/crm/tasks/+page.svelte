<script lang="ts">
  import { taskStore } from "$lib/data/store.svelte";
</script>

<svelte:head>
  <title>Tareas - StudioCRM</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-foreground">Tareas</h1>
      <p class="text-sm text-muted-foreground mt-1">Gestiona tu lista de pendientes</p>
    </div>
    <button class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
      + Nueva tarea
    </button>
  </div>

  <!-- Task filters -->
  <div class="flex gap-2">
    {#each ["Todas", "Hoy", "Esta semana", "Atrasadas"] as filter, i}
      <button class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors {i === 0 ? 'bg-primary text-primary-foreground' : 'border border-input hover:bg-muted'}">
        {filter}
      </button>
    {/each}
  </div>

  <!-- Task list -->
  <div class="rounded-xl border border-border bg-card divide-y divide-border">
    {#each taskStore.list as task}
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
      </div>
    {/each}
  </div>
</div>
