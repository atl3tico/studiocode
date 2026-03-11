<script lang="ts">
	import type { PageData } from './$types';

	interface Props { data: PageData; }
	let { data }: Props = $props();

	let statCards = $derived([
		{ label: 'Total Leads', value: data.stats.total_leads, icon: '👥', color: 'text-brand-600' },
		{ label: 'Leads Nuevos', value: data.stats.new_leads, icon: '🆕', color: 'text-yellow-600' },
		{ label: 'Cualificados', value: data.stats.qualified_leads, icon: '⭐', color: 'text-purple-600' },
		{ label: 'Ganados', value: data.stats.won_leads, icon: '🏆', color: 'text-green-600' },
		{ label: 'Citas Pendientes', value: data.stats.pending_citas, icon: '⏳', color: 'text-orange-600' },
		{ label: 'Citas Confirmadas', value: data.stats.confirmed_citas, icon: '✅', color: 'text-emerald-600' }
	]);

	function statusBadge(status: string) {
		const map: Record<string, string> = {
			new: 'badge-new',
			contacted: 'badge-contacted',
			qualified: 'badge-qualified',
			lost: 'badge-lost',
			won: 'badge-won',
			pending: 'badge-pending',
			confirmed: 'badge-confirmed',
			cancelled: 'badge-cancelled'
		};
		return map[status] ?? 'badge';
	}
</script>

<svelte:head>
	<title>Dashboard — CRM</title>
</svelte:head>

<div class="p-6 lg:p-8">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
		<p class="mt-1 text-sm text-gray-500">Resumen general del negocio</p>
	</div>

	<!-- Stats -->
	<div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each statCards as stat}
			<div class="card flex items-center gap-4">
				<div class="text-3xl">{stat.icon}</div>
				<div>
					<p class="text-sm text-gray-500">{stat.label}</p>
					<p class="text-2xl font-bold {stat.color}">{stat.value}</p>
				</div>
			</div>
		{/each}
	</div>

	<div class="grid gap-8 lg:grid-cols-2">
		<!-- Recent Leads -->
		<div class="card">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold text-gray-900">Últimos Leads</h2>
				<a href="/admin/leads" class="text-sm text-brand-600 hover:underline">Ver todos →</a>
			</div>
			{#if data.recent_leads.length === 0}
				<p class="py-8 text-center text-sm text-gray-400">No hay leads todavía.</p>
			{:else}
				<div class="space-y-3">
					{#each data.recent_leads as lead}
						<div class="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
							<div>
								<p class="font-medium text-gray-900">{lead.name}</p>
								<p class="text-xs text-gray-400">{lead.email}</p>
							</div>
							<span class={statusBadge(lead.status)}>{lead.status}</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Recent Citas -->
		<div class="card">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold text-gray-900">Próximas Citas</h2>
				<a href="/admin/citas" class="text-sm text-brand-600 hover:underline">Ver todas →</a>
			</div>
			{#if data.recent_citas.length === 0}
				<p class="py-8 text-center text-sm text-gray-400">No hay citas programadas.</p>
			{:else}
				<div class="space-y-3">
					{#each data.recent_citas as cita}
						<div class="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
							<div>
								<p class="font-medium text-gray-900">{cita.name}</p>
								<p class="text-xs text-gray-400">{cita.date} — {cita.time_start}</p>
							</div>
							<span class={statusBadge(cita.status)}>{cita.status}</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
