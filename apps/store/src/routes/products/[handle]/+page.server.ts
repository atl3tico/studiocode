import { error } from '@sveltejs/kit';
import { storefront, PRODUCT_BY_HANDLE_QUERY, type Product, ShopifyError } from '$lib/shopify';

export async function load({ params }) {
	try {
		const data = await storefront<{ product: Product | null }>(
			PRODUCT_BY_HANDLE_QUERY,
			{ handle: params.handle },
			{ retries: 2, timeoutMs: 10000 }
		);

		if (!data.product) {
			error(404, 'Product not found');
		}

		return { product: data.product };
	} catch (err) {
		if (err instanceof ShopifyError) {
			console.error('Shopify API error:', err.message);
			error(503, 'Store temporarily unavailable. Please try again later.');
		}
		error(500, 'Failed to load product');
	}
}
