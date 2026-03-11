<script lang="ts">
	import '../../app.css';
	import { page } from '$app/stores';

	interface Props {
		children: import('svelte').Snippet;
		data: { authenticated: boolean };
	}
	let { children, data }: Props = $props();

	const navLinks = [
		{ href: '/admin', label: 'Dashboard', icon: '📊' },
		{ href: '/admin/leads', label: 'Leads', icon: '👥' },
		{ href: '/admin/citas', label: 'Citas', icon: '📅' }
	];
</script>

{#if !data.authenticated}
	{@render children?.()}
{:else}
	<div class="flex min-h-screen bg-gray-50">
		<!-- Sidebar -->
		<aside class="flex w-60 flex-col bg-brand-900 text-white">
			<div class="flex items-center gap-2 border-b border-brand-700 px-6 py-5">
				<span class="text-xl font-bold">CRM Panel</span>
			</div>
			<nav class="flex-1 space-y-1 px-3 py-4">
				{#each navLinks as link}
					<a
						href={link.href}
						class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition
							{$page.url.pathname === link.href
								? 'bg-brand-700 text-white'
								: 'text-brand-100 hover:bg-brand-800 hover:text-white'}"
					>
						<span>{link.icon}</span>
						{link.label}
					</a>
				{/each}
			</nav>
			<div class="border-t border-brand-700 px-3 py-4">
				<form method="POST" action="/admin?/logout">
					<button
						type="submit"
						class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-100 transition hover:bg-brand-800 hover:text-white"
					>
						<span>🚪</span> Cerrar sesión
					</button>
				</form>
			</div>
		</aside>

		<!-- Main content -->
		<main class="flex-1 overflow-y-auto">
			{@render children?.()}
		</main>
	</div>
{/if}
