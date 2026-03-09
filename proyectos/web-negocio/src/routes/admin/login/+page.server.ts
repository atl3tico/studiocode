import { fail, redirect } from '@sveltejs/kit';
import { login } from '$lib/auth';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const password = data.get('password')?.toString() ?? '';

		const ok = await login(password, cookies);
		if (!ok) return fail(401, { error: 'Contraseña incorrecta.' });

		redirect(303, '/admin');
	}
};
