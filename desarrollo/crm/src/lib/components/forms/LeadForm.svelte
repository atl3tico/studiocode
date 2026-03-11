<script lang="ts">
	import { leadForm, resetLeadForm } from '$stores/leads';

	interface Props {
		source?: string;
		compact?: boolean;
	}

	let { source = 'web', compact = false }: Props = $props();

	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let message = $state('');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		leadForm.set({ status: 'loading', error: null });

		try {
			const res = await fetch('/api/lead', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, phone: phone || undefined, message: message || undefined, source })
			});

			const data = await res.json();

			if (!res.ok || !data.success) {
				leadForm.set({ status: 'error', error: data.error ?? 'Ha ocurrido un error. Inténtalo de nuevo.' });
				return;
			}

			leadForm.set({ status: 'success', error: null });
			name = '';
			email = '';
			phone = '';
			message = '';
		} catch {
			leadForm.set({ status: 'error', error: 'Error de conexión. Por favor, inténtalo de nuevo.' });
		}
	}
</script>

{#if $leadForm.status === 'success'}
	<div class="rounded-xl bg-green-50 p-6 text-center">
		<div class="mb-2 text-3xl">✅</div>
		<h3 class="mb-1 font-semibold text-green-800">¡Mensaje enviado!</h3>
		<p class="text-sm text-green-700">Nos pondremos en contacto contigo en menos de 24 horas.</p>
		<button
			class="mt-4 text-sm text-green-700 underline hover:no-underline"
			onclick={resetLeadForm}
		>
			Enviar otro mensaje
		</button>
	</div>
{:else}
	<form onsubmit={handleSubmit} novalidate class="space-y-4">
		<!-- Name -->
		<div>
			<label for="lead-name" class="mb-1 block text-sm font-medium text-gray-200">
				Nombre <span class="text-red-400">*</span>
			</label>
			<input
				id="lead-name"
				type="text"
				bind:value={name}
				required
				minlength="2"
				placeholder="Tu nombre"
				class="input-field"
				disabled={$leadForm.status === 'loading'}
			/>
		</div>

		<!-- Email -->
		<div>
			<label for="lead-email" class="mb-1 block text-sm font-medium text-gray-200">
				Email <span class="text-red-400">*</span>
			</label>
			<input
				id="lead-email"
				type="email"
				bind:value={email}
				required
				placeholder="tu@email.com"
				class="input-field"
				disabled={$leadForm.status === 'loading'}
			/>
		</div>

		<!-- Phone -->
		<div>
			<label for="lead-phone" class="mb-1 block text-sm font-medium text-gray-200">
				Teléfono <span class="text-gray-400 font-normal">(opcional)</span>
			</label>
			<input
				id="lead-phone"
				type="tel"
				bind:value={phone}
				placeholder="600 000 000"
				class="input-field"
				disabled={$leadForm.status === 'loading'}
			/>
		</div>

		<!-- Message (not compact) -->
		{#if !compact}
			<div>
				<label for="lead-message" class="mb-1 block text-sm font-medium text-gray-200">
					¿En qué podemos ayudarte?
				</label>
				<textarea
					id="lead-message"
					bind:value={message}
					rows="3"
					placeholder="Cuéntanos brevemente lo que necesitas..."
					class="input-field resize-none"
					disabled={$leadForm.status === 'loading'}
				></textarea>
			</div>
		{/if}

		<!-- Error -->
		{#if $leadForm.error}
			<p class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{$leadForm.error}</p>
		{/if}

		<!-- Submit -->
		<button
			type="submit"
			class="btn-primary w-full bg-yellow-400 text-gray-900 hover:bg-yellow-300"
			disabled={$leadForm.status === 'loading'}
		>
			{$leadForm.status === 'loading' ? 'Enviando…' : 'Solicitar información gratuita'}
		</button>

		<p class="text-center text-xs text-gray-400">
			Sin spam. Tus datos están protegidos según el RGPD.
		</p>
	</form>
{/if}
