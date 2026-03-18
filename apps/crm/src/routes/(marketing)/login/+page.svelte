<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { authStore } from "$lib/data/auth.svelte";

  let email = $state("");
  let password = $state("");
  let error = $state("");
  let loading = $state(false);

  // Redirect if already logged in
  $effect(() => {
    if (authStore.isAuthenticated) {
      goto(`${base}/crm`);
    }
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = "";
    loading = true;

    // Simulate network delay
    await new Promise(r => setTimeout(r, 400));

    const result = authStore.login(email, password);
    loading = false;

    if (result.success) {
      goto(`${base}/crm`);
    } else {
      error = result.error ?? "Error de autenticacion";
    }
  }

  function quickLogin(userEmail: string) {
    email = userEmail;
    password = "demo";
    const result = authStore.login(userEmail, "demo");
    if (result.success) {
      goto(`${base}/crm`);
    }
  }
</script>

<svelte:head>
  <title>Iniciar sesion - StudioCRM</title>
</svelte:head>

<section class="flex items-center justify-center py-16 md:py-24">
  <div class="w-full max-w-md px-6">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-primary">Iniciar sesion</h1>
      <p class="mt-2 text-sm text-muted-foreground">Accede a tu cuenta de StudioCRM</p>
    </div>

    <form onsubmit={handleSubmit} class="space-y-4">
      {#if error}
        <div class="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      {/if}

      <div>
        <label for="email" class="block text-sm font-medium mb-1.5">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="tu@email.com"
          required
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium mb-1.5">Contrasena</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Cualquier contrasena"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        class="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>

    <div class="mt-8 border-t border-border pt-6">
      <p class="text-xs text-muted-foreground text-center mb-4">Acceso rapido (demo)</p>
      <div class="space-y-2">
        {#each authStore.mockUsers as user}
          <button
            onclick={() => quickLogin(user.email)}
            class="w-full flex items-center gap-3 rounded-md border border-border px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left"
          >
            <span class="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-secondary-foreground shrink-0">
              {user.initials}
            </span>
            <div class="min-w-0">
              <div class="font-medium truncate">{user.name}</div>
              <div class="text-xs text-muted-foreground truncate">{user.email} &middot; {user.role}</div>
            </div>
          </button>
        {/each}
      </div>
    </div>
  </div>
</section>
