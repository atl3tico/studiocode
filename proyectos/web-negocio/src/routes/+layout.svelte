<script lang="ts">
	import '../app.css';
	import CookieBanner from '$lib/components/CookieBanner.svelte';

	interface Props {
		children: import('svelte').Snippet;
	}
	let { children }: Props = $props();
</script>

{@render children?.()}
<CookieBanner />
