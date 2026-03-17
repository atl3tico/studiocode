<script lang="ts">
  import { WebsiteName } from "./../../config"
  import "../../app.css"
  import { Button } from "$lib/components/ui/button"
  import * as Sheet from "$lib/components/ui/sheet"

  interface Props {
    children?: import("svelte").Snippet
  }

  let { children }: Props = $props()
  let sheetOpen = $state(false)
</script>

<div class="flex items-center justify-between bg-background container mx-auto h-16 px-4">
  <div class="flex-1">
    <Button variant="ghost" href="/" class="text-xl normal-case">{WebsiteName}</Button>
  </div>
  <div class="flex-none">
    <div class="hidden sm:flex items-center gap-1 px-1 font-bold text-lg">
      <a
        href="https://github.com/CriticalMoments/CMSaasStarter"
        class="md:mx-4 border border-primary rounded-md px-3 py-2">★ us on Github</a
      >
      <a href="/blog" class="md:mx-2 px-3 py-2 hover:bg-muted rounded-md transition-colors">Blog</a>
      <a href="/pricing" class="md:mx-2 px-3 py-2 hover:bg-muted rounded-md transition-colors">Pricing</a>
      <a href="/account" class="md:mx-2 px-3 py-2 hover:bg-muted rounded-md transition-colors">Account</a>
      <a href="/search" aria-label="Search" class="px-3 py-2 hover:bg-muted rounded-md transition-colors">
        <svg
          fill="#000000"
          class="w-6 h-6"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          ><path
            d="M17.545 15.467l-3.779-3.779a6.15 6.15 0 0 0 .898-3.21c0-3.417-2.961-6.377-6.378-6.377A6.185 6.185 0 0 0 2.1 8.287c0 3.416 2.961 6.377 6.377 6.377a6.15 6.15 0 0 0 3.115-.844l3.799 3.801a.953.953 0 0 0 1.346 0l.943-.943c.371-.371.236-.84-.135-1.211zM4.004 8.287a4.282 4.282 0 0 1 4.282-4.283c2.366 0 4.474 2.107 4.474 4.474a4.284 4.284 0 0 1-4.283 4.283c-2.366-.001-4.473-2.109-4.473-4.474z"
            fill="currentColor"
          /></svg
        >
      </a>
    </div>
    <div class="sm:hidden">
      <Sheet.Root bind:open={sheetOpen}>
        <Sheet.Trigger>
          <Button variant="ghost" size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h7"
              /></svg
            >
          </Button>
        </Sheet.Trigger>
        <Sheet.Content side="right" class="w-52">
          <Sheet.Header>
            <Sheet.Title>{WebsiteName}</Sheet.Title>
          </Sheet.Header>
          <nav class="flex flex-col gap-1 mt-4 font-bold">
            <a href="/blog" class="px-3 py-2 rounded-md hover:bg-muted transition-colors" onclick={() => sheetOpen = false}>Blog</a>
            <a href="/pricing" class="px-3 py-2 rounded-md hover:bg-muted transition-colors" onclick={() => sheetOpen = false}>Pricing</a>
            <a href="/account" class="px-3 py-2 rounded-md hover:bg-muted transition-colors" onclick={() => sheetOpen = false}>Account</a>
            <a href="/search" class="px-3 py-2 rounded-md hover:bg-muted transition-colors" onclick={() => sheetOpen = false}>Search</a>
            <a
              href="https://github.com/CriticalMoments/CMSaasStarter"
              class="px-3 py-2 border border-primary rounded-md hover:bg-muted transition-colors"
              onclick={() => sheetOpen = false}>★ us on Github</a
            >
          </nav>
        </Sheet.Content>
      </Sheet.Root>
    </div>
  </div>
</div>

<div class="">
  {@render children?.()}
</div>

<!-- Spacer grows so the footer can be at bottom on short pages -->
<div class="grow"></div>
<div class="">
  <div class="border-t max-w-[1000px] mx-auto"></div>
  <footer
    class="footer flex flex-col md:flex-row p-10 gap-x-48 lg:gap-x-64 xl:gap-x-96 place-content-center text-base"
  >
    <nav class="flex flex-col">
      <span class="font-semibold text-sm tracking-wider uppercase opacity-80 mb-2">Explore</span>
      <a class="hover:underline transition-colors mb-1" href="/">Overview</a>
      <a class="hover:underline transition-colors my-1" href="/pricing">Pricing</a>
      <a class="hover:underline transition-colors my-1" href="/blog">Blog</a>
      <a class="hover:underline transition-colors my-1" href="/contact_us">Contact Us</a>
      <a
        class="hover:underline transition-colors my-1"
        href="https://github.com/CriticalMoments/CMSaasStarter">Github</a
      >
    </nav>
    <aside>
      <span class="font-semibold text-sm tracking-wider uppercase opacity-80 mb-2 block">Sponsor</span>
      <a class="max-w-[260px]" href="https://getkiln.ai">
        <div class="font-bold text-3xl mb-1">Kiln AI</div>
        <div class="font-medium mb-3">Build High Quality AI Products</div>
        <div class="font-light">
          Use advanced AI tactics, and collaborate with your team. Free apps for
          Mac and Windows.
        </div>
        <div class="hover:underline transition-colors text-sm font-bold mt-2">Learn More</div>
      </a>
    </aside>
  </footer>
</div>
