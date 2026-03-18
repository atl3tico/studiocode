<script lang="ts">
  import { dealStore } from "$lib/data/store.svelte";
</script>

<svelte:head>
  <title>Ventas - StudioCRM</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-foreground">Pipeline de ventas</h1>
      <p class="text-sm text-muted-foreground mt-1">Arrastra los deals entre etapas</p>
    </div>
    <button class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
      + Nuevo deal
    </button>
  </div>

  <!-- Kanban Board -->
  <div class="flex gap-4 overflow-x-auto pb-4">
    {#each dealStore.stages as stage}
      <div class="flex-shrink-0 w-72">
        <div class="rounded-xl border border-border bg-muted/20">
          <div class="flex items-center justify-between p-4 border-b border-border">
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-semibold text-foreground">{stage.name}</h3>
              <span class="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{stage.count}</span>
            </div>
            <span class="text-xs font-medium text-muted-foreground">{stage.total}</span>
          </div>
          <div class="p-3 space-y-3">
            {#each stage.deals as deal}
              <div class="rounded-lg border border-border bg-card p-4 cursor-grab hover:shadow-md transition-shadow">
                <h4 class="text-sm font-medium text-card-foreground">{deal.title}</h4>
                <p class="text-xs text-muted-foreground mt-1">{deal.company}</p>
                <div class="flex items-center justify-between mt-3">
                  <span class="text-sm font-semibold text-primary">€{deal.value.toLocaleString("es-ES")}</span>
                  <div class="h-6 w-6 rounded-full bg-secondary/30 flex items-center justify-center text-[10px] font-medium" title={deal.owner}>
                    {deal.ownerInitials}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
