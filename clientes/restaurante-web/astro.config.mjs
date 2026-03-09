// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://atl3tico.github.io',
  base: '/restaurante-web',
  vite: {
    plugins: [tailwindcss()]
  }
});