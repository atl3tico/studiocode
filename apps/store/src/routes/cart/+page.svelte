<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Cart } from '$lib/shopify';

	let { data }: { data: { cart: Cart | null } } = $props();
	const cart = $derived(data.cart);
	const lines = $derived(cart?.lines.edges.map((e) => e.node) ?? []);

	let updating = $state<string | null>(null);

	function formatPrice(amount: string, currency: string) {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
			parseFloat(amount),
		);
	}
</script>

<svelte:head>
	<title>Cart — Store</title>
</svelte:head>

<section class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	<h1 class="text-3xl font-bold mb-8">Your Cart</h1>

	{#if !cart || lines.length === 0}
		<div class="text-center py-16">
			<p class="text-gray-500 text-lg">Your cart is empty.</p>
			<a
				href="/"
				class="mt-6 inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
			>
				Continue Shopping
			</a>
		</div>
	{:else}
		<div class="divide-y divide-gray-200">
			{#each lines as line (line.id)}
				{@const item = line.merchandise}
				<div
					class="py-6 flex gap-4 transition-opacity {updating === line.id ? 'opacity-50' : ''}"
				>
					<!-- Product image -->
					{#if item.product.featuredImage}
						<a
							href="/products/{item.product.handle}"
							class="shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden"
						>
							<img
								src={item.product.featuredImage.url}
								alt={item.product.featuredImage.altText || item.product.title}
								class="w-full h-full object-cover"
							/>
						</a>
					{:else}
						<div class="shrink-0 w-24 h-24 bg-gray-100 rounded-lg"></div>
					{/if}

					<!-- Product details -->
					<div class="flex-1 min-w-0">
						<a
							href="/products/{item.product.handle}"
							class="font-medium text-gray-900 hover:text-gray-600 truncate block"
						>
							{item.product.title}
						</a>
						{#if item.title !== 'Default Title'}
							<p class="text-sm text-gray-500 mt-1">{item.title}</p>
						{/if}
						<p class="text-sm font-medium mt-1">
							{formatPrice(item.price.amount, item.price.currencyCode)}
						</p>

						<div class="flex items-center gap-3 mt-3">
							<!-- Quantity controls -->
							<form
								method="POST"
								action="/cart?/update"
								class="flex items-center gap-1"
								use:enhance={() => {
									updating = line.id;
									return async ({ update }) => {
										await update();
										updating = null;
									};
								}}
							>
								<input type="hidden" name="lineId" value={line.id} />
								<input type="hidden" name="quantity" value={Math.max(1, line.quantity - 1)} />
								<button
									type="submit"
									class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50"
									disabled={line.quantity <= 1}
								>
									-
								</button>
							</form>

							<span class="text-sm font-medium w-8 text-center">{line.quantity}</span>

							<form
								method="POST"
								action="/cart?/update"
								use:enhance={() => {
									updating = line.id;
									return async ({ update }) => {
										await update();
										updating = null;
									};
								}}
							>
								<input type="hidden" name="lineId" value={line.id} />
								<input type="hidden" name="quantity" value={line.quantity + 1} />
								<button
									type="submit"
									class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
								>
									+
								</button>
							</form>

							<!-- Remove -->
							<form
								method="POST"
								action="/cart?/remove"
								class="ml-auto"
								use:enhance={() => {
									updating = line.id;
									return async ({ update }) => {
										await update();
										updating = null;
									};
								}}
							>
								<input type="hidden" name="lineId" value={line.id} />
								<button
									type="submit"
									class="text-sm text-red-600 hover:text-red-800 transition-colors"
								>
									Remove
								</button>
							</form>
						</div>
					</div>

					<!-- Line total -->
					<div class="text-right shrink-0">
						<p class="font-medium">
							{formatPrice(
								(parseFloat(item.price.amount) * line.quantity).toFixed(2),
								item.price.currencyCode,
							)}
						</p>
					</div>
				</div>
			{/each}
		</div>

		<!-- Cart summary -->
		<div class="border-t border-gray-200 pt-6 mt-2">
			<div class="flex justify-between text-sm text-gray-500">
				<span>Subtotal</span>
				<span>
					{formatPrice(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}
				</span>
			</div>
			{#if cart.cost.totalTaxAmount}
				<div class="flex justify-between text-sm text-gray-500 mt-1">
					<span>Tax</span>
					<span>
						{formatPrice(cart.cost.totalTaxAmount.amount, cart.cost.totalTaxAmount.currencyCode)}
					</span>
				</div>
			{/if}
			<div class="flex justify-between text-lg font-bold mt-4">
				<span>Total</span>
				<span>
					{formatPrice(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}
				</span>
			</div>

			<a
				href={cart.checkoutUrl}
				class="mt-6 block w-full bg-black text-white text-center py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
			>
				Proceed to Checkout
			</a>

			<a
				href="/"
				class="mt-3 block w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
			>
				Continue Shopping
			</a>
		</div>
	{/if}
</section>
