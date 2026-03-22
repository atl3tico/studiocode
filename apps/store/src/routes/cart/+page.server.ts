import {
	storefront,
	CART_QUERY,
	CART_CREATE_MUTATION,
	CART_LINES_ADD_MUTATION,
	CART_LINES_UPDATE_MUTATION,
	CART_LINES_REMOVE_MUTATION,
	type Cart,
	ShopifyError,
} from '$lib/shopify';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const cartId = cookies.get('cart_id');

	if (!cartId) {
		return { cart: null };
	}

	try {
		const data = await storefront<{ cart: Cart | null }>(CART_QUERY, { cartId }, { retries: 1 });
		return { cart: data.cart };
	} catch (err) {
		if (err instanceof ShopifyError) {
			console.error('Shopify cart error:', err.message);
		}
		cookies.delete('cart_id', { path: '/' });
		return { cart: null };
	}
};

export const actions: Actions = {
	add: async ({ request, cookies }) => {
		const form = await request.formData();
		const variantId = form.get('variantId') as string;

		if (!variantId) return fail(400, { error: 'No variant selected' });

		const cartId = cookies.get('cart_id');

		try {
			if (cartId) {
				const data = await storefront<{ cartLinesAdd: { cart: Cart } }>(
					CART_LINES_ADD_MUTATION,
					{
						cartId,
						lines: [{ merchandiseId: variantId, quantity: 1 }],
					},
					{ retries: 1 }
				);
				cookies.set('cart_id', data.cartLinesAdd.cart.id, {
					path: '/',
					httpOnly: true,
					sameSite: 'lax',
				});
			} else {
				const data = await storefront<{ cartCreate: { cart: Cart } }>(
					CART_CREATE_MUTATION,
					{
						lines: [{ merchandiseId: variantId, quantity: 1 }],
					},
					{ retries: 1 }
				);
				cookies.set('cart_id', data.cartCreate.cart.id, {
					path: '/',
					httpOnly: true,
					sameSite: 'lax',
				});
			}
		} catch (err) {
			const message = err instanceof ShopifyError ? err.message : 'Failed to add item to cart';
			return fail(503, { error: message, recoverable: true });
		}

		redirect(303, '/cart');
	},

	update: async ({ request, cookies }) => {
		const form = await request.formData();
		const lineId = form.get('lineId') as string;
		const quantity = parseInt(form.get('quantity') as string, 10);
		const cartId = cookies.get('cart_id');

		if (!cartId || !lineId || isNaN(quantity)) return fail(400, { error: 'Invalid request' });

		try {
			await storefront<{ cartLinesUpdate: { cart: Cart } }>(
				CART_LINES_UPDATE_MUTATION,
				{
					cartId,
					lines: [{ id: lineId, quantity }],
				},
				{ retries: 1 }
			);
		} catch (err) {
			const message = err instanceof ShopifyError ? err.message : 'Failed to update cart';
			return fail(503, { error: message, recoverable: true });
		}
	},

	remove: async ({ request, cookies }) => {
		const form = await request.formData();
		const lineId = form.get('lineId') as string;
		const cartId = cookies.get('cart_id');

		if (!cartId || !lineId) return fail(400, { error: 'Invalid request' });

		try {
			await storefront<{ cartLinesRemove: { cart: Cart } }>(
				CART_LINES_REMOVE_MUTATION,
				{
					cartId,
					lineIds: [lineId],
				},
				{ retries: 1 }
			);
		} catch (err) {
			const message = err instanceof ShopifyError ? err.message : 'Failed to remove item';
			return fail(503, { error: message, recoverable: true });
		}
	},
};
