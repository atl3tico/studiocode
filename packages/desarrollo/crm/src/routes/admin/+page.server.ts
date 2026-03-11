import { redirect } from '@sveltejs/kit';
import { logout } from '$lib/auth';
import { listLeads } from '$lib/crm';
import { listCitas } from '$lib/cal';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [leads, citas] = await Promise.all([
		listLeads({ limit: 5 }),
		listCitas({ limit: 5 })
	]);

	const allLeads = await listLeads({ limit: 1000 });
	const stats = {
		total_leads: allLeads.length,
		new_leads: allLeads.filter((l) => l.status === 'new').length,
		qualified_leads: allLeads.filter((l) => l.status === 'qualified').length,
		won_leads: allLeads.filter((l) => l.status === 'won').length,
		pending_citas: citas.filter((c) => c.status === 'pending').length,
		confirmed_citas: citas.filter((c) => c.status === 'confirmed').length
	};

	return { recent_leads: leads, recent_citas: citas, stats };
};

export const actions: Actions = {
	logout: async ({ cookies }) => {
		logout(cookies);
		redirect(303, '/admin/login');
	}
};
