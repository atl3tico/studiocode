<script lang="ts">
  import PricingModule from "./pricing_module.svelte"
  import { WebsiteName } from "./../../../config"
  import * as Table from "$lib/components/ui/table"
  import * as Accordion from "$lib/components/ui/accordion"

  type PlanFeatureRow = {
    name: string
    freeIncluded?: boolean
    proIncluded?: boolean
    freeString?: string
    proString?: string
    header?: boolean
  }

  const planFeatures: PlanFeatureRow[] = [
    {
      name: "Section 1",
      header: true,
    },
    {
      name: "Feature 1",
      freeIncluded: true,
      proIncluded: true,
    },
    {
      name: "Feature 2",
      freeIncluded: false,
      proIncluded: true,
    },
    {
      name: "Feature 3",
      freeString: "3",
      proString: "Unlimited",
    },
    {
      name: "Section 2",
      header: true,
    },
    {
      name: "Feature 4",
      freeIncluded: true,
      proIncluded: true,
    },
    {
      name: "Feature 5",
      freeIncluded: false,
      proIncluded: true,
    },
  ]
</script>

<svelte:head>
  <title>Pricing</title>
  <meta name="description" content="Pricing - {WebsiteName}" />
</svelte:head>

<div class="min-h-[70vh] pb-8 pt-[5vh] px-4">
  <h1 class="text-3xl font-bold text-center">Pricing</h1>
  <h2 class="text-xl text-center text-slate-500 mt-1 pb-3">
    Totally free, scale to millions of users
  </h2>

  <div class="w-full my-8">
    <PricingModule callToAction="Get Started" highlightedPlanId="pro" />
    <h1 class="text-2xl font-bold text-center mt-24">Pricing FAQ</h1>
    <div class="flex place-content-center">
      <Accordion.Root type="single" class="max-w-xl py-6 mx-auto w-full">
        <Accordion.Item value="item-1">
          <Accordion.Trigger class="text-lg font-medium">
            Is this template free to use?
          </Accordion.Trigger>
          <Accordion.Content>
            <p>Yup! This template is free to use for any project.</p>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger class="text-lg font-medium">
            Why does a free template have a pricing page?
          </Accordion.Trigger>
          <Accordion.Content>
            <p>
              The pricing page is part of the boilerplate. It shows how the
              pricing page integrates into the billing portal and the Stripe
              Checkout flows.
            </p>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-3">
          <Accordion.Trigger class="text-lg font-medium">
            What license is the template under?
          </Accordion.Trigger>
          <Accordion.Content>
            <p>The template is under the MIT license.</p>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-4">
          <Accordion.Trigger class="text-lg font-medium">
            Can I try out purchase flows without real a credit card?
          </Accordion.Trigger>
          <Accordion.Content>
            <p>
              Our demo page <a href="https://saasstarter.work" class="underline hover:opacity-80"
                >SaasStarter.work</a
              > has a functional demo page, using Stripe's test environment.
            </p>
            <p class="mt-4">
              You can use the credit card number 4242 4242 4242 4242 with any
              future expiry date to test the payment and upgrade flows.
            </p>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>

    <svg style="display:none" version="2.0">
      <defs>
        <symbol
          id="checkcircle"
          viewBox="0 0 24 24"
          stroke-width="2"
          fill="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-4.105-4.498a.791.791 0 0 0-1.082.29l-3.828 6.63-1.733-2.08a.791.791 0 1 0-1.216 1.014l2.459 2.952a.792.792 0 0 0 .608.285.83.83 0 0 0 .068-.003.791.791 0 0 0 .618-.393L12.6 6.866a.791.791 0 0 0-.29-1.081z"
          />
        </symbol>
      </defs>
    </svg>

    <svg style="display:none" version="2.0">
      <defs>
        <symbol id="nocircle" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4,11H8a1,1,0,0,1,0-2h8a1,1,0,0,1,0,2Z"
          />
        </symbol>
      </defs>
    </svg>

    <h1 class="text-2xl font-bold text-center mt-16">Plan Features</h1>
    <h2 class="text-xl text-center text-slate-500 mt-1 pb-3">
      Example feature table
    </h2>

    <div class="overflow-visible mx-auto max-w-xl mt-4">
      <Table.Root>
        <Table.Header>
          <Table.Row
            class="text-lg sticky top-0 bg-background bg-opacity-50 z-10 backdrop-blur-sm"
          >
            <Table.Head></Table.Head>
            <Table.Head class="text-center">Free</Table.Head>
            <Table.Head class="text-center">Pro</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each planFeatures as feature}
            {#if feature.header}
              <Table.Row class="bg-muted font-bold">
                <Table.Cell colspan={3}>{feature.name} </Table.Cell>
              </Table.Row>
            {:else}
              <Table.Row class="relative">
                <Table.Cell>{feature.name} </Table.Cell>
                <Table.Cell class="text-center">
                  {#if feature.freeString}
                    {feature.freeString}
                  {:else if feature.freeIncluded}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-8 h-8 ml-2 inline text-success"
                    >
                      <use href="#checkcircle" />
                    </svg>
                  {:else}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-[26px] h-[26px] inline text-muted"
                    >
                      <use href="#nocircle" />
                    </svg>
                  {/if}
                </Table.Cell>
                <Table.Cell class="text-center">
                  {#if feature.proString}
                    {feature.proString}
                  {:else if feature.proIncluded}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-8 h-8 ml-2 inline text-success"
                    >
                      <use href="#checkcircle" />
                    </svg>
                  {:else}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-[26px] h-[26px] inline text-muted"
                    >
                      <use href="#nocircle" />
                    </svg>
                  {/if}
                </Table.Cell>
              </Table.Row>
            {/if}
          {/each}
        </Table.Body>
      </Table.Root>
    </div>
  </div>
</div>
