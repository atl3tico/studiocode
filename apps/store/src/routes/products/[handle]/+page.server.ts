import { error } from '@sveltejs/kit';
import { storefront, PRODUCT_BY_HANDLE_QUERY, type Product } from '$lib/shopify';

export async function load({ params }) {
	const data = await storefront<{ product: Product | null }>(PRODUCT_BY_HANDLE_QUERY, {
		handle: params.handle,
	});

	if (!data.product) {
		error(404, 'Product not found');
	}

	return { product: data.product };
}
