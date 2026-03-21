<script lang="ts">
  import { base } from "$app/paths";
</script>

<svelte:head>
  <title>StudioCRM - Gestiona tu negocio</title>
  <meta name="description" content="CRM moderno para gestionar clientes, ventas y equipo." />
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden py-24 md:py-32">
  <div class="mx-auto max-w-7xl px-6 text-center">
    <div class="inline-flex items-center rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground mb-6">
      Nuevo: Integraciones con WhatsApp y email
    </div>
    <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-primary max-w-4xl mx-auto">
      Tu negocio organizado, tus clientes
      <span class="text-accent">satisfechos</span>
    </h1>
    <p class="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
      Gestiona contactos, seguimiento de ventas y comunicaciones con tu equipo desde un solo panel. Simple, potente y hecho para crecer.
    </p>
    <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
      <a href="{base}/crm" class="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
        Comenzar gratis
      </a>
      <a href="{base}/#features" class="inline-flex items-center justify-center rounded-md border border-border px-8 py-3 text-sm font-medium hover:bg-muted transition-colors">
        Ver funciones
      </a>
    </div>
  </div>
</section>

<!-- Features -->
<section id="features" class="py-24 bg-muted/30">
  <div class="mx-auto max-w-7xl px-6">
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-4xl font-bold text-primary">Todo lo que necesitas</h2>
      <p class="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
        Herramientas diseadas para equipos que quieren vender mas y perder menos tiempo.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {#each features as feature}
        <div class="rounded-xl border border-border bg-card p-8 hover:shadow-lg transition-shadow">
          <div class="h-12 w-12 rounded-lg bg-secondary/30 flex items-center justify-center text-2xl mb-4">
            {feature.icon}
          </div>
          <h3 class="text-lg font-semibold text-card-foreground">{feature.title}</h3>
          <p class="mt-2 text-sm text-muted-foreground">{feature.description}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Pricing -->
<section id="pricing" class="py-24">
  <div class="mx-auto max-w-7xl px-6">
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-4xl font-bold text-primary">Precios simples</h2>
      <p class="mt-4 text-lg text-muted-foreground">Sin sorpresas. Elige el plan que mejor se adapte.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {#each plans as plan}
        <div class="rounded-xl border {plan.featured ? 'border-accent shadow-lg scale-105' : 'border-border'} bg-card p-8 flex flex-col">
          {#if plan.featured}
            <div class="text-xs font-semibold text-accent uppercase tracking-wider mb-2">Popular</div>
          {/if}
          <h3 class="text-xl font-bold text-card-foreground">{plan.name}</h3>
          <div class="mt-4">
            <span class="text-4xl font-bold text-primary">{plan.price}</span>
            {#if plan.period}
              <span class="text-muted-foreground">/{plan.period}</span>
            {/if}
          </div>
          <p class="mt-2 text-sm text-muted-foreground">{plan.description}</p>
          <ul class="mt-6 space-y-3 flex-1">
            {#each plan.features as feat}
              <li class="flex items-start gap-2 text-sm">
                <svg class="h-5 w-5 text-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {feat}
              </li>
            {/each}
          </ul>
          <a
            href="{base}/crm"
            class="mt-8 block text-center rounded-md {plan.featured ? 'bg-accent text-white hover:bg-accent/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'} px-4 py-2.5 text-sm font-medium transition-colors"
          >
            {plan.cta}
          </a>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Contact -->
<section id="contact" class="py-24 bg-muted/30">
  <div class="mx-auto max-w-2xl px-6">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold text-primary">Contactanos</h2>
      <p class="mt-4 text-lg text-muted-foreground">Tienes preguntas? Escribenos y te respondemos en menos de 24h.</p>
    </div>

    <form class="space-y-6" onsubmit={(e) => e.preventDefault()}>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="name" class="block text-sm font-medium mb-1.5">Nombre</label>
          <input id="name" type="text" class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Tu nombre" />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium mb-1.5">Email</label>
          <input id="email" type="email" class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="tu@email.com" />
        </div>
      </div>
      <div>
        <label for="message" class="block text-sm font-medium mb-1.5">Mensaje</label>
        <textarea id="message" rows="4" class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none" placeholder="Como podemos ayudarte?"></textarea>
      </div>
      <button type="submit" class="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
        Enviar mensaje
      </button>
    </form>
  </div>
</section>

<script lang="ts" module>
  const features = [
    {
      icon: "👥",
      title: "Gestion de contactos",
      description: "Organiza todos tus clientes y prospectos con campos personalizados, etiquetas y segmentacion inteligente.",
    },
    {
      icon: "📊",
      title: "Pipeline de ventas",
      description: "Visualiza tu embudo de ventas con tableros Kanban. Arrastra y mueve deals entre etapas.",
    },
    {
      icon: "📧",
      title: "Comunicaciones",
      description: "Historial completo de emails, llamadas y notas por cada contacto. Nunca pierdas contexto.",
    },
    {
      icon: "📈",
      title: "Reportes y metricas",
      description: "Dashboards en tiempo real con KPIs de ventas, rendimiento del equipo y proyecciones.",
    },
    {
      icon: "🔄",
      title: "Automatizaciones",
      description: "Crea flujos automaticos: asignacion de leads, seguimiento, recordatorios y mas.",
    },
    {
      icon: "🔌",
      title: "Integraciones",
      description: "Conecta con WhatsApp, Gmail, Calendario y tus herramientas favoritas.",
    },
  ];

  const plans = [
    {
      name: "Starter",
      price: "Gratis",
      period: null,
      description: "Para freelancers y equipos pequenos.",
      featured: false,
      cta: "Comenzar gratis",
      features: ["Hasta 100 contactos", "1 pipeline de ventas", "Historial basico", "1 usuario"],
    },
    {
      name: "Pro",
      price: "€29",
      period: "mes",
      description: "Para equipos en crecimiento.",
      featured: true,
      cta: "Probar 14 dias gratis",
      features: [
        "Contactos ilimitados",
        "Pipelines ilimitados",
        "Automatizaciones",
        "5 usuarios",
        "Integraciones",
        "Reportes avanzados",
      ],
    },
    {
      name: "Enterprise",
      price: "€79",
      period: "mes",
      description: "Para empresas y agencias.",
      featured: false,
      cta: "Contactar ventas",
      features: [
        "Todo de Pro",
        "Usuarios ilimitados",
        "API personalizada",
        "SLA dedicado",
        "Onboarding personalizado",
      ],
    },
  ];
</script>
