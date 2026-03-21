import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"

export default defineConfig({
  resolve: {
    alias: {
      'svelte/client': 'svelte'
    }
  },
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
