<script lang="ts">
  import { getContext } from "svelte"
  import { Alert, AlertDescription } from "$lib/components/ui/alert"

  let adminSection: { value: string } = getContext("adminSection")
  adminSection.value = "home"
</script>

<svelte:head>
  <title>Account</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-1">Dashboard</h1>
<Alert class="max-w-lg mt-2 border-destructive bg-destructive/10">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="stroke-current shrink-0 h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    ><path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    /></svg
  >
  <AlertDescription>
    <div class="font-bold">Demo Content</div>
    <div class="my-2">
      This page is just a placeholder. Replace this page with your app's content
      and functionality.
    </div>
    <div class="my-2">
      The <a href="/account/billing" class="underline font-medium">billing</a> and
      <a href="/account/settings" class="underline font-medium">settings</a> pages are functional
      demos.
    </div>
  </AlertDescription>
</Alert>

<div class="my-6">
  <h1 class="text-xl font-bold mb-1">Users</h1>
  <div class="flex flex-col sm:flex-row shadow-sm rounded-lg border sm:w-[420px] overflow-hidden">
    <div class="flex flex-col items-center p-4 flex-1">
      <div class="text-sm text-muted-foreground">Downloads</div>
      <div class="text-2xl font-bold">31K</div>
      <div class="text-xs text-muted-foreground">↗︎ 546 (2%)</div>
    </div>
    <div class="border-t sm:border-l sm:border-t-0"></div>
    <div class="flex flex-col items-center p-4 flex-1">
      <div class="text-sm text-muted-foreground">Users</div>
      <div class="text-2xl font-bold text-secondary">4,200</div>
      <div class="text-xs text-muted-foreground">↗︎ 40 (2%)</div>
    </div>
  </div>
</div>
<div class="my-6">
  <h1 class="text-xl font-bold mb-1">Accounts</h1>
  <div class="flex flex-col sm:flex-row shadow-sm rounded-lg border sm:w-[420px] overflow-hidden">
    <div class="flex flex-col items-center p-4 flex-1">
      <div class="text-sm text-muted-foreground">New Registers</div>
      <div class="text-2xl font-bold">1,200</div>
      <div class="text-xs text-muted-foreground">↘︎ 90 (14%)</div>
    </div>
    <div class="border-t sm:border-l sm:border-t-0"></div>
    <div class="flex flex-col items-center p-4 flex-1">
      <div class="text-sm text-muted-foreground">Churned Accounts</div>
      <div class="text-2xl font-bold">42</div>
      <div class="text-xs text-muted-foreground">↘︎ 6 (12%)</div>
    </div>
  </div>
</div>
<div class="my-6">
  <h1 class="text-xl font-bold mb-1">Revenue</h1>
  <div class="flex flex-col sm:flex-row shadow-sm rounded-lg border sm:w-[420px] overflow-hidden">
    <div class="flex flex-col items-center p-4 flex-1">
      <div class="text-sm text-muted-foreground text-success">Revenue</div>
      <div class="text-2xl font-bold text-success">$4200</div>
      <div class="text-xs text-muted-foreground">↗︎ $180 (4%)</div>
    </div>
    <div class="border-t sm:border-l sm:border-t-0"></div>
    <div class="flex flex-col items-center p-4 flex-1">
      <div class="text-sm text-muted-foreground">New Subscribers</div>
      <div class="text-2xl font-bold">16</div>
      <div class="text-xs text-muted-foreground">↘︎ 1 (%7)</div>
    </div>
  </div>
</div>
