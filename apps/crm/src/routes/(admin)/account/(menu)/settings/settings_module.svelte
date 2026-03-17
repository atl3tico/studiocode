<script lang="ts">
  import { enhance, applyAction } from "$app/forms"
  import { page } from "$app/state"
  import type { SubmitFunction } from "@sveltejs/kit"
  import { Button } from "$lib/components/ui/button"
  import { Input } from "$lib/components/ui/input"
  import * as Card from "$lib/components/ui/card"
  import * as Alert from "$lib/components/ui/alert"

  const fieldError = (liveForm: FormAccountUpdateResult, name: string) => {
    let errors = liveForm?.errorFields ?? []
    return errors.includes(name)
  }

  // Page state
  let loading = $state(false)
  let showSuccess = $state(false)

  type Field = {
    inputType?: string // default is "text"
    id: string
    label?: string
    initialValue: string | boolean
    placeholder?: string
    maxlength?: number
  }

  interface Props {
    // Module context
    editable?: boolean
    dangerous?: boolean
    title?: string
    message?: string
    fields: Field[]
    formTarget?: string
    successTitle?: string
    successBody?: string
    editButtonTitle?: string | null
    editLink?: string | null
    saveButtonTitle?: string
  }

  let {
    editable = false,
    dangerous = false,
    title = "",
    message = "",
    fields,
    formTarget = "",
    successTitle = "Success",
    successBody = "",
    editButtonTitle = null,
    editLink = null,
    saveButtonTitle = "Save",
  }: Props = $props()

  const handleSubmit: SubmitFunction = () => {
    loading = true
    return async ({ update, result }) => {
      await update({ reset: false })
      await applyAction(result)
      loading = false
      if (result.type === "success") {
        showSuccess = true
      }
    }
  }
</script>

<Card.Root class="mt-8 max-w-xl shadow-sm">
  <Card.Content class="p-6 pb-7 flex flex-col md:flex-row">
    {#if title}
      <div class="text-xl font-bold mb-3 w-48 md:pr-8 flex-none">{title}</div>
    {/if}

    <div class="w-full min-w-48">
      {#if !showSuccess}
        {#if message}
          <div class="mb-6">
            {#if dangerous}
              <Alert.Root class="border-warning bg-warning/10">
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
                <Alert.Description>{message}</Alert.Description>
              </Alert.Root>
            {:else}
              <span>{message}</span>
            {/if}
          </div>
        {/if}
        <form
          class="form-widget flex flex-col"
          method="POST"
          action={formTarget}
          use:enhance={handleSubmit}
        >
          {#each fields as field}
            {#if field.label}
              <label for={field.id}>
                <span class="text-sm text-gray-500">{field.label}</span>
              </label>
            {/if}
            {#if editable}
              <Input
                id={field.id}
                name={field.id}
                type={field.inputType ?? "text"}
                disabled={!editable}
                placeholder={field.placeholder ?? field.label ?? ""}
                class="h-8 mt-1 w-full max-w-xs mb-3 text-base {fieldError(page?.form, field.id)
                  ? 'border-destructive'
                  : ''}"
                value={page.form ? page.form[field.id] : field.initialValue}
                maxlength={field.maxlength ? field.maxlength : null}
              />
            {:else}
              <div class="text-lg mb-3">{field.initialValue}</div>
            {/if}
          {/each}

          {#if page?.form?.errorMessage}
            <p class="text-red-700 text-sm font-bold mt-1">
              {page?.form?.errorMessage}
            </p>
          {/if}

          {#if editable}
            <div>
              <Button
                type="submit"
                variant={dangerous ? "destructive" : "outline"}
                size="sm"
                class="ml-auto mt-3 min-w-[145px]"
                disabled={loading}
              >
                {#if loading}
                  <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                {:else}
                  {saveButtonTitle}
                {/if}
              </Button>
            </div>
          {:else if editButtonTitle && editLink}
            <!-- !editable -->
            <Button
              href={editLink}
              variant={dangerous ? "destructive" : "outline"}
              size="sm"
              class="mt-1 min-w-[145px]"
            >
              {editButtonTitle}
            </Button>
          {/if}
        </form>
      {:else}
        <!-- showSuccess -->
        <div>
          <div class="text-l font-bold">{successTitle}</div>
          <div class="text-base">{successBody}</div>
        </div>
        <Button
          href="/account/settings"
          variant="outline"
          size="sm"
          class="mt-3 min-w-[145px]"
        >
          Return to Settings
        </Button>
      {/if}
    </div>
  </Card.Content>
</Card.Root>
