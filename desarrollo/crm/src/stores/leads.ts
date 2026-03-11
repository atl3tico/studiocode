/**
 * leads.ts — Store Svelte 5 para estado global del formulario de leads.
 */

import { writable } from 'svelte/store';

export type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export interface LeadFormState {
	status: FormStatus;
	error: string | null;
}

export const leadForm = writable<LeadFormState>({
	status: 'idle',
	error: null
});

export function resetLeadForm() {
	leadForm.set({ status: 'idle', error: null });
}
