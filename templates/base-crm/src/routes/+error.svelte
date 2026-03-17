<script>
  import "../app.css"
  import { page } from "$app/state"
  import { Button } from "$lib/components/ui/button"
</script>

<div class="flex min-h-screen items-center justify-center">
  <div class="text-center">
    <div class="max-w-lg">
      <h1 class="text-5xl font-bold">This is embarrassing...</h1>
      <p class="py-6 text-2xl">There was an error: {page?.error?.message}</p>
      <div>
        <Button href="/" variant="default" class="min-w-[200px]">Return Home</Button>
      </div>
    </div>
  </div>
</div>
