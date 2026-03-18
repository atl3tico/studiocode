<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Product, ProductVariant } from '$lib/shopify';

	let { data }: { data: { product: Product } } = $props();
	const product = $derived(data.product);

	let selectedVariant: ProductVariant = $state(data.product.variants.edges[0]?.node);
	let selectedImage = $state(data.product.featuredImage);
	let adding = $state(false);

	const images = $derived(data.product.images.edges.map((e) => e.node));
	const variants = $derived(data.product.variants.edges.map((e) => e.node));

	function formatPrice(amount: string, currency: string) {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(parseFloat(amount));
	}

	function selectVariant(variant: ProductVariant) {
		selectedVariant = variant;
		if (variant.image) selectedImage = variant.image;
	}
</script>

<svelte:head>
	<title>{product.title} — Store</title>
	<meta name="description" content={product.description} />
</svelte:head>

<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
		<!-- Images -->
		<div>
			{#if selectedImage}
				<div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
					<img
						src={selectedImage.url}
						alt={selectedImage.altText || product.title}
						class="w-full h-full object-cover"
					/>
				</div>
			{/if}

			{#if images.length > 1}
				<div class="grid grid-cols-4 gap-2">
					{#each images as img (img.url)}
						<button
							type="button"
							class="aspect-square rounded border-2 overflow-hidden {selectedImage?.url === img.url ? 'border-black' : 'border-gray-200'}"
							onclick={() => (selectedImage = img)}
						>
							<img
								src={img.url}
								alt={img.altText || ''}
								class="w-full h-full object-cover"
								loading="lazy"
							/>
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Product info -->
		<div>
			<h1 class="text-3xl font-bold">{product.title}</h1>

			{#if selectedVariant}
				<p class="mt-4 text-2xl font-semibold">
					{formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)}
					{#if selectedVariant.compareAtPrice}
						<span class="ml-2 text-lg text-gray-400 line-through">
							{formatPrice(selectedVariant.compareAtPrice.amount, selectedVariant.compareAtPrice.currencyCode)}
						</span>
					{/if}
				</p>
			{/if}

			<!-- Variant selector -->
			{#if variants.length > 1}
				<div class="mt-6">
					<h3 class="text-sm font-medium text-gray-700 mb-2">Options</h3>
					<div class="flex flex-wrap gap-2">
						{#each variants as variant (variant.id)}
							<button
								type="button"
								class="px-4 py-2 text-sm rounded border {selectedVariant?.id === variant.id
									? 'border-black bg-black text-white'
									: 'border-gray-300 hover:border-gray-400'}
									{!variant.availableForSale ? 'opacity-50 cursor-not-allowed' : ''}"
								disabled={!variant.availableForSale}
								onclick={() => selectVariant(variant)}
							>
								{variant.title}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Add to cart -->
			<form
				method="POST"
				action="/cart?/add"
				class="mt-8"
				use:enhance={() => {
					adding = true;
					return async ({ update }) => {
						await update();
						adding = false;
					};
				}}
			>
				<input type="hidden" name="variantId" value={selectedVariant?.id || ''} />
				<button
					type="submit"
					class="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={!selectedVariant?.availableForSale || adding}
				>
					{#if adding}
						Adding...
					{:else}
						{selectedVariant?.availableForSale ? 'Add to Cart' : 'Sold Out'}
					{/if}
				</button>
			</form>

			<!-- Description -->
			{#if product.descriptionHtml}
				<div class="mt-8 prose prose-sm max-w-none">
					{@html product.descriptionHtml}
				</div>
			{/if}
		</div>
	</div>
</section>
