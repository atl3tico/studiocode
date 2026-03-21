<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="min-h-screen flex flex-col bg-white text-gray-900">
	<header class="border-b border-gray-200">
		<nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
			<a href="/" class="text-xl font-bold tracking-tight">Store</a>
			<div class="flex items-center gap-6">
				<a href="/" class="text-sm hover:text-gray-600">Products</a>
				<a href="/cart" class="text-sm hover:text-gray-600">Cart</a>
			</div>
		</nav>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="border-t border-gray-200 py-8">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
			&copy; {new Date().getFullYear()} Store. Powered by StudioCode.
		</div>
	</footer>
</div>
