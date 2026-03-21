<script lang="ts">
  import { page } from "$app/stores";
  import { base } from "$app/paths";
</script>

<div class="min-h-screen flex items-center justify-center bg-background">
  <div class="text-center">
    <h1 class="text-6xl font-bold text-primary">{$page.status}</h1>
    <p class="mt-4 text-lg text-muted-foreground">{$page.error?.message || 'Pagina no encontrada'}</p>
    <a href="{base}/" class="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
      Volver al inicio
    </a>
  </div>
</div>
