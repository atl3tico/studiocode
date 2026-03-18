<script lang="ts">
  import { kpiStore, activityStore, dealStore, taskStore } from "$lib/data/store.svelte";
</script>

<svelte:head>
  <title>Dashboard - StudioCRM</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-2xl font-bold text-foreground">Dashboard</h1>
    <p class="text-sm text-muted-foreground mt-1">Vista general de tu negocio</p>
  </div>

  <!-- KPI Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {#each kpiStore.items as kpi}
      <div class="rounded-xl border border-border bg-card p-6">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-muted-foreground">{kpi.label}</p>
          <span class="text-xs font-medium {kpi.trend > 0 ? 'text-success' : 'text-destructive'}">
            {kpi.trend > 0 ? '+' : ''}{kpi.trend}%
          </span>
        </div>
        <p class="text-3xl font-bold text-card-foreground mt-2">{kpi.value}</p>
      </div>
    {/each}
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Recent Activity -->
    <div class="rounded-xl border border-border bg-card">
      <div class="p-6 border-b border-border">
        <h2 class="text-lg font-semibold text-card-foreground">Actividad reciente</h2>
      </div>
      <div class="divide-y divide-border">
        {#each activityStore.list as activity}
          <div class="flex items-start gap-3 p-4">
            <div class="h-8 w-8 rounded-full bg-secondary/30 flex items-center justify-center text-sm shrink-0">
              {activity.avatar}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-card-foreground">{activity.text}</p>
              <p class="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Pipeline Summary -->
    <div class="rounded-xl border border-border bg-card">
      <div class="p-6 border-b border-border">
        <h2 class="text-lg font-semibold text-card-foreground">Pipeline de ventas</h2>
      </div>
      <div class="p-6 space-y-4">
        {#each dealStore.pipeline as stage}
          <div>
            <div class="flex justify-between text-sm mb-1.5">
              <span class="font-medium text-card-foreground">{stage.name}</span>
              <span class="text-muted-foreground">{stage.count} deals &middot; {stage.value}</span>
            </div>
            <div class="h-2 rounded-full bg-muted overflow-hidden">
              <div class="h-full rounded-full bg-primary" style="width: {stage.percent}%"></div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Upcoming Tasks -->
  <div class="rounded-xl border border-border bg-card">
    <div class="p-6 border-b border-border">
      <h2 class="text-lg font-semibold text-card-foreground">Tareas pendientes</h2>
    </div>
    <div class="divide-y divide-border">
      {#each taskStore.dashboardTasks as task}
        <div class="flex items-center gap-4 p-4">
          <input
            type="checkbox"
            onchange={() => taskStore.toggle(task.id)}
            class="h-4 w-4 rounded border-input"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-card-foreground">{task.title}</p>
            <p class="text-xs text-muted-foreground">{task.contact}</p>
          </div>
          <span class="text-xs font-medium rounded-full px-2.5 py-0.5 {task.urgency === 'high' ? 'bg-destructive/10 text-destructive' : task.urgency === 'medium' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}">
            {task.due}
          </span>
        </div>
      {/each}
    </div>
  </div>
</div>
