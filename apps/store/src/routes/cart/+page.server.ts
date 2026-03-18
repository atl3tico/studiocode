import {
	storefront,
	CART_QUERY,
	CART_CREATE_MUTATION,
	CART_LINES_ADD_MUTATION,
	CART_LINES_UPDATE_MUTATION,
	CART_LINES_REMOVE_MUTATION,
	type Cart,
} from '$lib/shopify';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const cartId = cookies.get('cart_id');

	if (!cartId) {
		return { cart: null };
	}

	try {
		const data = await storefront<{ cart: Cart | null }>(CART_QUERY, { cartId });
		return { cart: data.cart };
	} catch {
		cookies.delete('cart_id', { path: '/' });
		return { cart: null };
	}
};

export const actions: Actions = {
	add: async ({ request, cookies }) => {
		const form = await request.formData();
		const variantId = form.get('variantId') as string;

		if (!variantId) return { error: 'No variant selected' };

		const cartId = cookies.get('cart_id');

		if (cartId) {
			const data = await storefront<{ cartLinesAdd: { cart: Cart } }>(CART_LINES_ADD_MUTATION, {
				cartId,
				lines: [{ merchandiseId: variantId, quantity: 1 }],
			});
			cookies.set('cart_id', data.cartLinesAdd.cart.id, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
			});
		} else {
			const data = await storefront<{ cartCreate: { cart: Cart } }>(CART_CREATE_MUTATION, {
				lines: [{ merchandiseId: variantId, quantity: 1 }],
			});
			cookies.set('cart_id', data.cartCreate.cart.id, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
			});
		}

		redirect(303, '/cart');
	},

	update: async ({ request, cookies }) => {
		const form = await request.formData();
		const lineId = form.get('lineId') as string;
		const quantity = parseInt(form.get('quantity') as string, 10);
		const cartId = cookies.get('cart_id');

		if (!cartId || !lineId || isNaN(quantity)) return { error: 'Invalid request' };

		await storefront<{ cartLinesUpdate: { cart: Cart } }>(CART_LINES_UPDATE_MUTATION, {
			cartId,
			lines: [{ id: lineId, quantity }],
		});
	},

	remove: async ({ request, cookies }) => {
		const form = await request.formData();
		const lineId = form.get('lineId') as string;
		const cartId = cookies.get('cart_id');

		if (!cartId || !lineId) return { error: 'Invalid request' };

		await storefront<{ cartLinesRemove: { cart: Cart } }>(CART_LINES_REMOVE_MUTATION, {
			cartId,
			lineIds: [lineId],
		});
	},
};
