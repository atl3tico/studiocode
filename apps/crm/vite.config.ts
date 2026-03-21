import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          svelte: ['svelte', 'svelte/internal', 'svelte/client']
        }
      }
    }
  },
  plugins: [sveltekit()],
  server: {
    allowedHosts: ["k1k-ofi"],
  },
})
