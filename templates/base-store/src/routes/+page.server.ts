import { getProducts } from '$lib/server/shopify';

export async function load() {
    const products = await getProducts(10);
    return {
        products
    };
}