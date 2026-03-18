<script lang="ts">
  import { dealStore } from "$lib/data/store.svelte";
  import type { Deal, DealStage } from "$lib/data/types";

  let showForm = $state(false);
  let editingDeal = $state<Deal | null>(null);

  // Form fields
  let formTitle = $state("");
  let formCompany = $state("");
  let formValue = $state(0);
  let formOwner = $state("");
  let formStage = $state<DealStage>("prospeccion");

  const stageOrder: DealStage[] = ["prospeccion", "calificacion", "propuesta", "negociacion", "cierre"];

  function openNew() {
    editingDeal = null;
    formTitle = "";
    formCompany = "";
    formValue = 0;
    formOwner = "";
    formStage = "prospeccion";
    showForm = true;
  }

  function openEdit(deal: Deal) {
    editingDeal = deal;
    formTitle = deal.title;
    formCompany = deal.company;
    formValue = deal.value;
    formOwner = deal.owner;
    formStage = deal.stage;
    showForm = true;
  }

  function saveDeal() {
    if (!formTitle.trim() || !formCompany.trim()) return;
    const ownerInitials = formOwner.trim().split(" ").map(w => w[0] || "").join("").toUpperCase().slice(0, 2);
    if (editingDeal) {
      dealStore.update(editingDeal.id, {
        title: formTitle.trim(),
        company: formCompany.trim(),
        value: formValue,
        owner: formOwner.trim(),
        ownerInitials,
        stage: formStage,
      });
    } else {
      dealStore.add({
        title: formTitle.trim(),
        company: formCompany.trim(),
        value: formValue,
        owner: formOwner.trim(),
        ownerInitials,
        stage: formStage,
      });
    }
    showForm = false;
  }

  function moveStage(dealId: string, direction: -1 | 1) {
    const deal = dealStore.list.find(d => d.id === dealId);
    if (!deal) return;
    const idx = stageOrder.indexOf(deal.stage);
    const newIdx = idx + direction;
    if (newIdx >= 0 && newIdx < stageOrder.length) {
      dealStore.move(dealId, stageOrder[newIdx]);
    }
  }
</script>

<svelte:head>
  <title>Ventas - StudioCRM</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-foreground">Pipeline de ventas</h1>
      <p class="text-sm text-muted-foreground mt-1">Gestiona tus deals por etapa</p>
    </div>
    <button
      onclick={openNew}
      class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
    >
      + Nuevo deal
    </button>
  </div>

  <!-- Kanban Board -->
  <div class="flex gap-4 overflow-x-auto pb-4">
    {#each dealStore.stages as stage, stageIdx}
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
              <div class="rounded-lg border border-border bg-card p-4 hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0 flex-1">
                    <h4 class="text-sm font-medium text-card-foreground">{deal.title}</h4>
                    <p class="text-xs text-muted-foreground mt-1">{deal.company}</p>
                  </div>
                  <button
                    onclick={() => openEdit(deal)}
                    class="shrink-0 rounded-md p-1 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    title="Editar"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                </div>
                <div class="flex items-center justify-between mt-3">
                  <span class="text-sm font-semibold text-primary">&euro;{deal.value.toLocaleString("es-ES")}</span>
                  <div class="h-6 w-6 rounded-full bg-secondary/30 flex items-center justify-center text-[10px] font-medium" title={deal.owner}>
                    {deal.ownerInitials}
                  </div>
                </div>
                <!-- Stage movement -->
                <div class="flex items-center justify-between mt-3 pt-2 border-t border-border">
                  <button
                    onclick={() => moveStage(deal.id, -1)}
                    disabled={stageIdx === 0}
                    class="rounded px-2 py-1 text-xs hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground"
                    title="Mover atras"
                  >
                    &larr; Atras
                  </button>
                  <button
                    onclick={() => dealStore.remove(deal.id)}
                    class="rounded px-2 py-1 text-xs hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    title="Eliminar"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                  <button
                    onclick={() => moveStage(deal.id, 1)}
                    disabled={stageIdx === stageOrder.length - 1}
                    class="rounded px-2 py-1 text-xs hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground"
                    title="Mover adelante"
                  >
                    Adelante &rarr;
                  </button>
                </div>
              </div>
            {/each}
            {#if stage.deals.length === 0}
              <p class="text-xs text-muted-foreground text-center py-4">Sin deals</p>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<!-- Modal Form -->
{#if showForm}
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <button class="absolute inset-0 bg-black/50" onclick={() => showForm = false} aria-label="Cerrar"></button>
    <div class="relative bg-card border border-border rounded-xl shadow-lg w-full max-w-md mx-4 p-6">
      <h2 class="text-lg font-semibold text-card-foreground mb-4">
        {editingDeal ? "Editar deal" : "Nuevo deal"}
      </h2>
      <form onsubmit={(e) => { e.preventDefault(); saveDeal(); }} class="space-y-4">
        <div>
          <label for="fd-title" class="block text-sm font-medium mb-1.5">Titulo *</label>
          <input id="fd-title" type="text" bind:value={formTitle} required class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label for="fd-company" class="block text-sm font-medium mb-1.5">Empresa *</label>
          <input id="fd-company" type="text" bind:value={formCompany} required class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label for="fd-value" class="block text-sm font-medium mb-1.5">Valor (&euro;)</label>
          <input id="fd-value" type="number" bind:value={formValue} min="0" class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label for="fd-owner" class="block text-sm font-medium mb-1.5">Responsable</label>
          <input id="fd-owner" type="text" bind:value={formOwner} class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label for="fd-stage" class="block text-sm font-medium mb-1.5">Etapa</label>
          <select id="fd-stage" bind:value={formStage} class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="prospeccion">Prospeccion</option>
            <option value="calificacion">Calificacion</option>
            <option value="propuesta">Propuesta</option>
            <option value="negociacion">Negociacion</option>
            <option value="cierre">Cierre</option>
          </select>
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" onclick={() => showForm = false} class="flex-1 rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
            Cancelar
          </button>
          <button type="submit" class="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            {editingDeal ? "Guardar" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
