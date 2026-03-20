import adapter from "@sveltejs/adapter-vercel"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      runtime: "nodejs22.x",
    }),
    paths: {
      base: process.env.BASE_PATH || "",
    },
  },
  preprocess: vitePreprocess(),
}

export default config
