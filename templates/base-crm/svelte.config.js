import adapter from "@sveltejs/adapter-vercel"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    prerender: {
        handleHttpError: 'ignore',
        entries: [],
        handleUnseenRoutes: 'ignore'
    },
    adapter: adapter({
        runtime: 'nodejs22.x'
    }),
    inlineStyleThreshold: 150000,
  },
  preprocess: vitePreprocess(),
}

export default config
