<script lang="ts">
	const STORAGE_KEY = 'analytics-consent';

	let visible = $state(false);

	$effect(() => {
		if (typeof window === 'undefined') return;
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === null) visible = true;
	});

	function accept() {
		localStorage.setItem(STORAGE_KEY, 'true');
		visible = false;
		// Cargar Plausible dinámicamente tras aceptar
		loadPlausible();
	}

	function decline() {
		localStorage.setItem(STORAGE_KEY, 'false');
		visible = false;
	}

	function loadPlausible() {
		if (typeof window === 'undefined') return;
		if (document.querySelector('script[data-domain]')) return;
		const domain = import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN;
		if (!domain) return;
		const script = document.createElement('script');
		script.defer = true;
		script.dataset.domain = domain;
		script.src = 'https://plausible.io/js/script.js';
		document.head.appendChild(script);
	}
</script>

{#if visible}
	<div
		role="dialog"
		aria-label="Aviso de cookies"
		class="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white p-4 shadow-lg md:bottom-4 md:left-4 md:right-auto md:max-w-sm md:rounded-xl md:border"
	>
		<p class="mb-3 text-sm text-gray-700">
			Usamos cookies analíticas para mejorar nuestra web. Puedes aceptarlas o rechazarlas.
			<a href="/privacidad" class="underline">Política de privacidad</a>.
		</p>
		<div class="flex gap-2">
			<button
				onclick={accept}
				class="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
			>
				Aceptar
			</button>
			<button
				onclick={decline}
				class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
			>
				Rechazar
			</button>
		</div>
	</div>
{/if}
