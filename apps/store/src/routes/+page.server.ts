import { error } from '@sveltejs/kit';
import { storefront, PRODUCTS_QUERY, type Product, ShopifyError } from '$lib/shopify';

export async function load() {
	try {
		const data = await storefront<{
			products: { edges: Array<{ node: Product }> };
		}>(PRODUCTS_QUERY, { first: 24 }, { retries: 2, timeoutMs: 10000 });

		return {
			products: data.products.edges.map((e) => e.node),
		};
	} catch (err) {
		if (err instanceof ShopifyError) {
			console.error('Shopify API error:', err.message);
			error(503, 'Store temporarily unavailable. Please try again later.');
		}
		error(500, 'Failed to load products');
	}
}
