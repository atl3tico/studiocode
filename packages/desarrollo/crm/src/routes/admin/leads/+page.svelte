<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	interface Props { data: PageData; }
	let { data }: Props = $props();

	const statuses = ['', 'new', 'contacted', 'qualified', 'lost', 'won'];
	const statusLabels: Record<string, string> = {
		'': 'Todos', new: 'Nuevo', contacted: 'Contactado',
		qualified: 'Cualificado', lost: 'Perdido', won: 'Ganado'
	};

	function badgeClass(status: string) {
		const map: Record<string, string> = {
			new: 'badge-new', contacted: 'badge-contacted',
			qualified: 'badge-qualified', lost: 'badge-lost', won: 'badge-won'
		};
		return map[status] ?? 'badge';
	}

	function formatDate(d: string) {
		return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
	}
</script>

<svelte:head>
	<title>Leads — CRM</title>
</svelte:head>

<div class="p-6 lg:p-8">
	<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Leads</h1>
			<p class="mt-1 text-sm text-gray-500">{data.leads.length} resultado(s)</p>
		</div>
	</div>

	<!-- Filtros -->
	<div class="mb-6 flex flex-wrap gap-2">
		{#each statuses as s}
			<a
				href="/admin/leads{s ? `?status=${s}` : ''}"
				class="rounded-full px-4 py-1.5 text-sm font-medium transition
					{data.status === s
						? 'bg-brand-600 text-white'
						: 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'}"
			>
				{statusLabels[s]}
			</a>
		{/each}
	</div>

	<!-- Tabla -->
	<div class="card overflow-hidden p-0">
		{#if data.leads.length === 0}
			<p class="py-12 text-center text-sm text-gray-400">No hay leads en este filtro.</p>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm">
					<thead>
						<tr class="border-b border-gray-100 bg-gray-50">
							<th class="px-4 py-3 font-semibold text-gray-600">Nombre</th>
							<th class="px-4 py-3 font-semibold text-gray-600">Email</th>
							<th class="hidden px-4 py-3 font-semibold text-gray-600 sm:table-cell">Teléfono</th>
							<th class="hidden px-4 py-3 font-semibold text-gray-600 lg:table-cell">Fuente</th>
							<th class="px-4 py-3 font-semibold text-gray-600">Estado</th>
							<th class="hidden px-4 py-3 font-semibold text-gray-600 md:table-cell">Fecha</th>
							<th class="px-4 py-3 font-semibold text-gray-600">Acción</th>
						</tr>
					</thead>
					<tbody>
						{#each data.leads as lead}
							<tr class="border-b border-gray-50 hover:bg-gray-50/50">
								<td class="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
								<td class="px-4 py-3 text-gray-500">
									<a href="mailto:{lead.email}" class="hover:text-brand-600 hover:underline">{lead.email}</a>
								</td>
								<td class="hidden px-4 py-3 text-gray-500 sm:table-cell">{lead.phone ?? '—'}</td>
								<td class="hidden px-4 py-3 text-gray-500 lg:table-cell">{lead.source}</td>
								<td class="px-4 py-3">
									<span class={badgeClass(lead.status)}>{statusLabels[lead.status] ?? lead.status}</span>
								</td>
								<td class="hidden px-4 py-3 text-gray-400 md:table-cell">{formatDate(lead.created_at)}</td>
								<td class="px-4 py-3">
									<form method="POST" action="?/updateStatus" use:enhance class="flex gap-1">
										<input type="hidden" name="id" value={lead.id} />
										<select
											name="status"
											class="rounded border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
											onchange={(e) => (e.currentTarget.form as HTMLFormElement)?.requestSubmit()}
										>
											{#each ['new','contacted','qualified','lost','won'] as s}
												<option value={s} selected={lead.status === s}>{statusLabels[s]}</option>
											{/each}
										</select>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
