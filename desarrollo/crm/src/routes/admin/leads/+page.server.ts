import { listLeads, updateLeadStatus, type LeadStatus } from '$lib/crm';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const status = (url.searchParams.get('status') as LeadStatus) ?? undefined;
	const page = Number(url.searchParams.get('page') ?? '1');
	const limit = 20;
	const offset = (page - 1) * limit;

	const leads = await listLeads({ status, limit, offset });
	return { leads, status: status ?? '', page };
};

export const actions: Actions = {
	updateStatus: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		const status = data.get('status')?.toString() as LeadStatus;

		if (!id || !status) return fail(400, { error: 'Datos incompletos.' });

		try {
			await updateLeadStatus(id, status);
			return { success: true };
		} catch {
			return fail(500, { error: 'No se pudo actualizar el estado.' });
		}
	}
};
