<script lang="ts">
	import LeadForm from '$lib/components/forms/LeadForm.svelte';

	const features = [
		{ icon: '📋', title: 'Captura de Leads', desc: 'Formularios inteligentes que convierten visitas en clientes.' },
		{ icon: '📅', title: 'Gestión de Citas', desc: 'Reservas online con recordatorios automáticos por email.' },
		{ icon: '📊', title: 'Panel CRM', desc: 'Visualiza y gestiona todos tus contactos en un solo lugar.' },
		{ icon: '🔔', title: 'Notificaciones', desc: 'Alertas inmediatas cuando un cliente potencial te contacta.' }
	];
</script>

<svelte:head>
	<title>Tu Negocio — Web Profesional con CRM</title>
	<meta name="description" content="Aumenta tus clientes con una web profesional y un CRM integrado. Captura leads, gestiona citas y haz crecer tu negocio." />
</svelte:head>

<!-- Hero -->
<section class="bg-gradient-to-br from-brand-900 to-brand-700 py-20 text-white">
	<div class="mx-auto max-w-6xl px-6 lg:px-8">
		<div class="grid gap-12 lg:grid-cols-2 lg:items-center">
			<div>
				<p class="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-100">Web + CRM · Kit Digital</p>
				<h1 class="mb-6 text-5xl font-bold leading-tight">
					Tu presencia online que <span class="text-yellow-300">trabaja por ti</span>
				</h1>
				<p class="mb-8 text-lg text-brand-100">
					Web profesional con CRM integrado. Captura leads, gestiona citas y automatiza el seguimiento
					de clientes — todo desde un panel sencillo.
				</p>
				<div class="flex flex-wrap gap-4">
					<a href="#contacto" class="btn-primary bg-yellow-400 text-gray-900 hover:bg-yellow-300">
						Quiero una demo gratuita
					</a>
					<a href="#servicios" class="btn-secondary border-white text-white hover:bg-white/10">
						Ver cómo funciona
					</a>
				</div>
			</div>
			<div class="card bg-white/10 backdrop-blur-sm" id="contacto">
				<h3 class="mb-4 text-xl font-semibold text-white">Solicita información gratuita</h3>
				<LeadForm source="hero" />
			</div>
		</div>
	</div>
</section>

<!-- Features -->
<section class="py-20" id="servicios">
	<div class="mx-auto max-w-6xl px-6 lg:px-8">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-gray-900">Todo lo que necesita tu negocio</h2>
			<p class="mx-auto max-w-2xl text-gray-500">
				Solución completa elegible para <strong>Kit Digital</strong>. Sin complicaciones técnicas,
				tú te centras en tu negocio.
			</p>
		</div>
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each features as f}
				<div class="card text-center">
					<div class="mb-3 text-4xl">{f.icon}</div>
					<h3 class="mb-2 text-gray-900">{f.title}</h3>
					<p class="text-sm text-gray-500">{f.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Footer -->
<section class="bg-gray-50 py-16">
	<div class="mx-auto max-w-2xl px-6 text-center">
		<h2 class="mb-4 text-gray-900">¿Listo para empezar?</h2>
		<p class="mb-8 text-gray-500">
			Financiación disponible con <strong>Kit Digital</strong> (hasta 6.000€). Sin coste inicial para
			autónomos y pymes.
		</p>
		<a href="#contacto" class="btn-primary text-base">Solicitar propuesta gratuita</a>
	</div>
</section>
