import { redirect } from '@sveltejs/kit';
import { isAuthenticated } from '$lib/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const authenticated = await isAuthenticated(cookies);

	if (!authenticated && url.pathname !== '/admin/login') {
		redirect(303, '/admin/login');
	}

	return { authenticated };
};
