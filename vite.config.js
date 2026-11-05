import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative paths, so the same build works on a GitHub Pages project URL
  // (/repo-name/), a custom domain or the Hostinger web root.
  base: './',
  plugins: [vue()],
})
