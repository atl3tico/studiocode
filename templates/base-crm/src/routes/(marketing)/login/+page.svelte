<script>
  import { Button } from "$lib/components/ui/button"
</script>

<svelte:head>
  <title>Log In</title>
</svelte:head>

<div>
  <h1 class="text-xl font-bold">Get Started</h1>
  <Button href="/login/sign_up" variant="default" class="mt-3 min-w-[200px]">Sign Up</Button>

  <h1 class="text-xl mt-6">Already have an account?</h1>
  <Button href="/login/sign_in" variant="outline" class="mt-3 min-w-[200px]">Sign In</Button>
</div>
