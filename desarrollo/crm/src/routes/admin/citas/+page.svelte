<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	interface Props { data: PageData; }
	let { data }: Props = $props();

	const statuses = ['', 'pending', 'confirmed', 'cancelled'];
	const statusLabels: Record<string, string> = {
		'': 'Todas', pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelada'
	};

	function badgeClass(status: string) {
		const map: Record<string, string> = {
			pending: 'badge-pending', confirmed: 'badge-confirmed', cancelled: 'badge-cancelled'
		};
		return map[status] ?? 'badge';
	}
</script>

<svelte:head>
	<title>Citas — CRM</title>
</svelte:head>

<div class="p-6 lg:p-8">
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-gray-900">Citas</h1>
		<p class="mt-1 text-sm text-gray-500">{data.citas.length} cita(s)</p>
	</div>

	<!-- Filtros de estado -->
	<div class="mb-6 flex flex-wrap gap-2">
		{#each statuses as s}
			<a
				href="/admin/citas{s ? `?status=${s}` : ''}"
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
		{#if data.citas.length === 0}
			<p class="py-12 text-center text-sm text-gray-400">No hay citas en este filtro.</p>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm">
					<thead>
						<tr class="border-b border-gray-100 bg-gray-50">
							<th class="px-4 py-3 font-semibold text-gray-600">Cliente</th>
							<th class="px-4 py-3 font-semibold text-gray-600">Fecha</th>
							<th class="px-4 py-3 font-semibold text-gray-600">Hora</th>
							<th class="hidden px-4 py-3 font-semibold text-gray-600 md:table-cell">Servicio</th>
							<th class="px-4 py-3 font-semibold text-gray-600">Estado</th>
							<th class="px-4 py-3 font-semibold text-gray-600">Acción</th>
						</tr>
					</thead>
					<tbody>
						{#each data.citas as cita}
							<tr class="border-b border-gray-50 hover:bg-gray-50/50">
								<td class="px-4 py-3">
									<p class="font-medium text-gray-900">{cita.name}</p>
									<p class="text-xs text-gray-400">
										<a href="mailto:{cita.email}" class="hover:text-brand-600 hover:underline">{cita.email}</a>
									</p>
								</td>
								<td class="px-4 py-3 text-gray-700">{cita.date}</td>
								<td class="px-4 py-3 text-gray-700">{cita.time_start} – {cita.time_end}</td>
								<td class="hidden px-4 py-3 text-gray-500 md:table-cell">{cita.service}</td>
								<td class="px-4 py-3">
									<span class={badgeClass(cita.status)}>{statusLabels[cita.status] ?? cita.status}</span>
								</td>
								<td class="px-4 py-3">
									<form method="POST" action="?/updateStatus" use:enhance class="flex gap-1">
										<input type="hidden" name="id" value={cita.id} />
										<select
											name="status"
											class="rounded border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
											onchange={(e) => (e.currentTarget.form as HTMLFormElement)?.requestSubmit()}
										>
											{#each ['pending','confirmed','cancelled'] as s}
												<option value={s} selected={cita.status === s}>{statusLabels[s]}</option>
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
