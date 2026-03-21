<script lang="ts">
  import { configStore } from "$lib/data/store.svelte";
  import { tenantStore } from "$lib/data/tenant.svelte";

  let tab = $state<"general" | "stages" | "features">("general");
  let saved = $state(false);

  // General form
  let companyName = $state(configStore.current?.companyName ?? "");
  let industry = $state(configStore.current?.industry ?? "general");
  let currency = $state(configStore.current?.currency ?? "EUR");
  let locale = $state(configStore.current?.locale ?? "es-ES");
  let timezone = $state(configStore.current?.timezone ?? "Europe/Madrid");

  // Sync when config loads
  $effect(() => {
    if (configStore.current) {
      companyName = configStore.current.companyName;
      industry = configStore.current.industry;
      currency = configStore.current.currency;
      locale = configStore.current.locale;
      timezone = configStore.current.timezone;
    }
  });

  function showSaved() {
    saved = true;
    setTimeout(() => saved = false, 2000);
  }

  function saveGeneral(e: Event) {
    e.preventDefault();
    configStore.updateGeneral({ companyName, industry, currency, locale, timezone });
    showSaved();
  }

  function toggleFeature(key: keyof typeof configStore.features) {
    const features = { ...configStore.features };
    features[key] = !features[key];
    configStore.updateFeatures(features);
    showSaved();
  }

  // Stage editing
  let newStageKey = $state("");
  let newStageLabel = $state("");
  let newStageColor = $state("#3b82f6");

  function addStage(e: Event) {
    e.preventDefault();
    if (!newStageKey || !newStageLabel) return;
    const stages = [...configStore.dealStages, { key: newStageKey, label: newStageLabel, color: newStageColor }];
    configStore.updateDealStages(stages);
    newStageKey = "";
    newStageLabel = "";
    newStageColor = "#3b82f6";
    showSaved();
  }

  function removeStage(key: string) {
    configStore.updateDealStages(configStore.dealStages.filter(s => s.key !== key));
    showSaved();
  }

  // Task type editing
  let newTaskKey = $state("");
  let newTaskLabel = $state("");

  function addTaskType(e: Event) {
    e.preventDefault();
    if (!newTaskKey || !newTaskLabel) return;
    configStore.updateTaskTypes([...configStore.taskTypes, { key: newTaskKey, label: newTaskLabel }]);
    newTaskKey = "";
    newTaskLabel = "";
    showSaved();
  }

  function removeTaskType(key: string) {
    configStore.updateTaskTypes(configStore.taskTypes.filter(t => t.key !== key));
    showSaved();
  }

  const industries = [
    { value: "general", label: "General" },
    { value: "tecnologia", label: "Tecnologia" },
    { value: "marketing", label: "Marketing / Agencia" },
    { value: "consultoria", label: "Consultoria" },
    { value: "inmobiliaria", label: "Inmobiliaria" },
    { value: "salud", label: "Salud" },
    { value: "educacion", label: "Educacion" },
    { value: "retail", label: "Retail / Comercio" },
  ];
</script>

<svelte:head>
  <title>Configuracion - StudioCRM</title>
</svelte:head>

<!-- Header -->
<div class="flex items-center justify-between mb-6">
  <div>
    <h1 class="text-2xl font-bold">Configuracion</h1>
    <p class="text-sm text-muted-foreground mt-1">
      Personaliza las reglas de {tenantStore.current?.name ?? "tu organizacion"}
    </p>
  </div>
  {#if saved}
    <span class="inline-flex items-center gap-1.5 rounded-md bg-green-100 px-3 py-1.5 text-sm font-medium text-green-800 animate-pulse">
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
      Guardado
    </span>
  {/if}
</div>

<!-- Tabs -->
<div class="flex gap-1 mb-6 border-b border-border">
  {#each [["general", "General"], ["stages", "Pipeline y Tipos"], ["features", "Funcionalidades"]] as [value, label]}
    <button
      onclick={() => tab = value as typeof tab}
      class="px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px
        {tab === value ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}"
    >
      {label}
    </button>
  {/each}
</div>

{#if tab === "general"}
  <form onsubmit={saveGeneral} class="max-w-2xl space-y-4">
    <div>
      <label for="companyName" class="block text-sm font-medium mb-1.5">Nombre de la empresa</label>
      <input id="companyName" type="text" bind:value={companyName} required
        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
    </div>

    <div>
      <label for="industry" class="block text-sm font-medium mb-1.5">Industria</label>
      <select id="industry" bind:value={industry}
        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
        {#each industries as ind}
          <option value={ind.value}>{ind.label}</option>
        {/each}
      </select>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div>
        <label for="currency" class="block text-sm font-medium mb-1.5">Moneda</label>
        <select id="currency" bind:value={currency}
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="MXN">MXN</option>
          <option value="GBP">GBP</option>
        </select>
      </div>
      <div>
        <label for="locale" class="block text-sm font-medium mb-1.5">Idioma</label>
        <select id="locale" bind:value={locale}
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="es-ES">Espanol (ES)</option>
          <option value="es-MX">Espanol (MX)</option>
          <option value="en-US">English (US)</option>
        </select>
      </div>
      <div>
        <label for="timezone" class="block text-sm font-medium mb-1.5">Zona horaria</label>
        <select id="timezone" bind:value={timezone}
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="Europe/Madrid">Europe/Madrid</option>
          <option value="America/Mexico_City">America/Mexico_City</option>
          <option value="America/New_York">America/New_York</option>
          <option value="America/Los_Angeles">America/Los_Angeles</option>
        </select>
      </div>
    </div>

    <div class="flex gap-3 pt-2">
      <button type="submit"
        class="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
        Guardar cambios
      </button>
      <button type="button" onclick={() => configStore.reset()}
        class="rounded-md border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
        Restaurar valores por defecto
      </button>
    </div>
  </form>

{:else if tab === "stages"}
  <div class="max-w-2xl space-y-8">
    <!-- Deal stages -->
    <section>
      <h2 class="text-lg font-semibold mb-3">Etapas del pipeline</h2>
      <div class="space-y-2 mb-4">
        {#each configStore.dealStages as stage}
          <div class="flex items-center gap-3 rounded-md border border-border p-3">
            <span class="h-4 w-4 rounded-full shrink-0" style="background-color: {stage.color}"></span>
            <span class="flex-1 text-sm font-medium">{stage.label}</span>
            <span class="text-xs text-muted-foreground font-mono">{stage.key}</span>
            <button
              onclick={() => removeStage(stage.key)}
              class="rounded-md p-1 text-destructive hover:bg-destructive/10 transition-colors"
              title="Eliminar etapa"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        {/each}
      </div>
      <form onsubmit={addStage} class="flex items-end gap-3">
        <div class="flex-1">
          <label for="stageKey" class="block text-xs font-medium mb-1">Clave</label>
          <input id="stageKey" type="text" bind:value={newStageKey} required placeholder="ej: demo"
            class="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div class="flex-1">
          <label for="stageLabel" class="block text-xs font-medium mb-1">Nombre</label>
          <input id="stageLabel" type="text" bind:value={newStageLabel} required placeholder="ej: Demo"
            class="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label for="stageColor" class="block text-xs font-medium mb-1">Color</label>
          <input id="stageColor" type="color" bind:value={newStageColor}
            class="h-[34px] w-12 rounded-md border border-input cursor-pointer" />
        </div>
        <button type="submit" class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          Agregar
        </button>
      </form>
    </section>

    <!-- Task types -->
    <section>
      <h2 class="text-lg font-semibold mb-3">Tipos de tareas</h2>
      <div class="flex flex-wrap gap-2 mb-4">
        {#each configStore.taskTypes as taskType}
          <span class="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm">
            {taskType.label}
            <button
              onclick={() => removeTaskType(taskType.key)}
              class="text-muted-foreground hover:text-destructive transition-colors"
              title="Eliminar"
            >
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </span>
        {/each}
      </div>
      <form onsubmit={addTaskType} class="flex items-end gap-3">
        <div class="flex-1">
          <label for="taskKey" class="block text-xs font-medium mb-1">Clave</label>
          <input id="taskKey" type="text" bind:value={newTaskKey} required placeholder="ej: demo"
            class="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div class="flex-1">
          <label for="taskLabel" class="block text-xs font-medium mb-1">Nombre</label>
          <input id="taskLabel" type="text" bind:value={newTaskLabel} required placeholder="ej: Demo"
            class="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <button type="submit" class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          Agregar
        </button>
      </form>
    </section>
  </div>

{:else}
  <!-- Features toggle -->
  <div class="max-w-2xl space-y-1">
    <p class="text-sm text-muted-foreground mb-4">Activa o desactiva funcionalidades para esta organizacion</p>
    {#each [
      { key: "appointments", label: "Citas", desc: "Sistema de agenda y citas con clientes" },
      { key: "reminders", label: "Recordatorios", desc: "Notificaciones automaticas por email y WhatsApp" },
      { key: "webhooks", label: "Webhooks", desc: "Integraciones con servicios externos via webhooks" },
      { key: "emailIntegration", label: "Integracion Email", desc: "Envio de notificaciones por correo electronico" },
      { key: "whatsappIntegration", label: "Integracion WhatsApp", desc: "Envio de mensajes via WhatsApp Business API" },
    ] as feature}
      <div class="flex items-center justify-between rounded-lg border border-border p-4">
        <div>
          <div class="font-medium text-sm">{feature.label}</div>
          <div class="text-xs text-muted-foreground mt-0.5">{feature.desc}</div>
        </div>
        <button
          onclick={() => toggleFeature(feature.key as keyof typeof configStore.features)}
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            {configStore.features[feature.key as keyof typeof configStore.features] ? 'bg-primary' : 'bg-muted'}"
          role="switch"
          aria-checked={configStore.features[feature.key as keyof typeof configStore.features]}
          aria-label={feature.label}
        >
          <span
            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm
              {configStore.features[feature.key as keyof typeof configStore.features] ? 'translate-x-6' : 'translate-x-1'}"
          ></span>
        </button>
      </div>
    {/each}
  </div>
{/if}
