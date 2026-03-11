<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	interface Props { form: ActionData; }
	let { form }: Props = $props();
</script>

<svelte:head>
	<title>Admin — Iniciar sesión</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
	<div class="card w-full max-w-sm">
		<div class="mb-6 text-center">
			<div class="mb-2 text-4xl">🔐</div>
			<h1 class="text-2xl font-bold text-gray-900">Panel Admin</h1>
			<p class="mt-1 text-sm text-gray-500">Introduce tu contraseña para continuar</p>
		</div>

		<form method="POST" use:enhance class="space-y-4">
			<div>
				<label for="password" class="mb-1 block text-sm font-medium text-gray-700">Contraseña</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					autocomplete="current-password"
					class="input-field"
					placeholder="••••••••"
				/>
			</div>

			{#if form?.error}
				<p class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{form.error}</p>
			{/if}

			<button type="submit" class="btn-primary w-full">Entrar</button>
		</form>
	</div>
</div>
