import { storefront, PRODUCTS_QUERY, type Product } from '$lib/shopify';

export async function load() {
	const data = await storefront<{
		products: { edges: Array<{ node: Product }> };
	}>(PRODUCTS_QUERY, { first: 24 });

	return {
		products: data.products.edges.map((e) => e.node),
	};
}
