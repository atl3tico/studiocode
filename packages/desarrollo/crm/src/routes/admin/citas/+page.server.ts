import { listCitas, updateCitaStatus, type CitaStatus } from '$lib/cal';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const status = (url.searchParams.get('status') as CitaStatus) ?? undefined;
	const date_from = url.searchParams.get('from') ?? undefined;
	const date_to = url.searchParams.get('to') ?? undefined;

	const citas = await listCitas({ status, date_from, date_to, limit: 50 });
	return { citas, status: status ?? '' };
};

export const actions: Actions = {
	updateStatus: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		const status = data.get('status')?.toString() as CitaStatus;

		if (!id || !status) return fail(400, { error: 'Datos incompletos.' });

		try {
			await updateCitaStatus(id, status);
			return { success: true };
		} catch {
			return fail(500, { error: 'No se pudo actualizar el estado.' });
		}
	}
};
