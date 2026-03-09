// astro.config.mjs
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'
import node from '@astrojs/node'

export default defineConfig({
  site: 'https://example.com',
  integrations: [
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  // 'static' es el default en Astro 5. Las rutas con `export const prerender = false`
  // se renderizan en servidor (requiere adaptador).
  adapter: node({ mode: 'standalone' }),
})
