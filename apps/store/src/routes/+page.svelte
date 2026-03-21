<script lang="ts">
	import ProductCard from '$lib/../components/ProductCard.svelte';
	import type { Product } from '$lib/shopify';

	let { data }: { data: { products: Product[] } } = $props();
</script>

<svelte:head>
	<title>Store — All Products</title>
</svelte:head>

<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	<h1 class="text-3xl font-bold mb-8">All Products</h1>

	{#if data.products.length === 0}
		<p class="text-gray-500">No products available.</p>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each data.products as product (product.id)}
				<ProductCard {product} />
			{/each}
		</div>
	{/if}
</section>
