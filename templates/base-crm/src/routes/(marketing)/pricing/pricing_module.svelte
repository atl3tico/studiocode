<script lang="ts">
  import { pricingPlans } from "./pricing_plans"
  import { Button } from "$lib/components/ui/button"
  import * as Card from "$lib/components/ui/card"

  interface Props {
    // Module context
    highlightedPlanId?: string
    callToAction: string
    currentPlanId?: string
    center?: boolean
  }

  let {
    highlightedPlanId = "",
    callToAction,
    currentPlanId = "",
    center = true,
  }: Props = $props()
</script>

<div
  class="flex flex-col lg:flex-row gap-10 {center
    ? 'place-content-center'
    : ''} flex-wrap"
>
  {#each pricingPlans as plan}
    <Card.Root
      class="flex-none {plan.id === highlightedPlanId
        ? 'border-primary'
        : 'border-gray-200'} shadow-xl flex-1 grow min-w-[260px] max-w-[310px] p-6"
    >
      <div class="flex flex-col h-full">
        <div class="text-xl font-bold">{plan.name}</div>
        <p class="mt-2 text-sm text-gray-500 leading-relaxed">
          {plan.description}
        </p>
        <div class="mt-auto pt-4 text-sm text-gray-600">
          Plan Includes:
          <ul class="list-disc list-inside mt-2 space-y-1">
            {#each plan.features as feature}
              <li class="">{feature}</li>
            {/each}
            <ul></ul>
          </ul>
        </div>
        <div class="pt-8">
          <span class="text-4xl font-bold">{plan.price}</span>
          <span class="text-gray-400">{plan.priceIntervalName}</span>
          <div class="mt-6 pt-4 flex-1 flex flex-row items-center">
            {#if plan.id === currentPlanId}
              <Button
                variant="outline"
                class="text-success border-success cursor-default w-[80%] mx-auto"
              >
                Current Plan
              </Button>
            {:else}
              <Button
                href={"/account/subscribe/" +
                  (plan?.stripe_price_id ?? "free_plan")}
                variant="default"
                class="w-[80%] mx-auto"
              >
                {callToAction}
              </Button>
            {/if}
          </div>
        </div>
      </div>
    </Card.Root>
  {/each}
</div>
