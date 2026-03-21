<script lang="ts">
	import type { Product } from '$lib/shopify';

	let { product }: { product: Product } = $props();

	const price = $derived(
		new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: product.priceRange.minVariantPrice.currencyCode,
		}).format(parseFloat(product.priceRange.minVariantPrice.amount))
	);
</script>

<a
	href="/products/{product.handle}"
	class="group block rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
>
	{#if product.featuredImage}
		<div class="aspect-square bg-gray-100 overflow-hidden">
			<img
				src={product.featuredImage.url}
				alt={product.featuredImage.altText || product.title}
				width={product.featuredImage.width}
				height={product.featuredImage.height}
				class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
				loading="lazy"
			/>
		</div>
	{:else}
		<div class="aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
			No image
		</div>
	{/if}

	<div class="p-4">
		<h3 class="font-medium text-sm line-clamp-2">{product.title}</h3>
		<p class="mt-1 text-sm font-semibold">{price}</p>
		{#if !product.availableForSale}
			<span class="mt-1 inline-block text-xs text-red-600">Sold out</span>
		{/if}
	</div>
</a>
