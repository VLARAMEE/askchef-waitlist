import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        whatWeDo: fileURLToPath(new URL('./what-we-do/index.html', import.meta.url)),
        faq: fileURLToPath(new URL('./faq/index.html', import.meta.url)),
        support: fileURLToPath(new URL('./support/index.html', import.meta.url)),
        terms: fileURLToPath(new URL('./terms/index.html', import.meta.url)),
        privacy: fileURLToPath(new URL('./privacy/index.html', import.meta.url)),
      },
    },
  },
})
