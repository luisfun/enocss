import { defineConfig } from 'vite'

export default defineConfig({
  root: 'playground',
  build: {
    outDir: '../playground-preview',
    emptyOutDir: true,
  },
})
