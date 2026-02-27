import { defineConfig } from 'vite'

import { resolve } from 'path'
import { readdirSync } from 'fs'

const root = 'playground'
const input = {}
readdirSync(root).filter(f => f.endsWith('.html')).forEach(f => {
  const name = f.replace(/\.html$/, '')
  input[name] = resolve(root, f)
})

export default defineConfig({
  root,
  build: {
    outDir: '../playground-preview',
    emptyOutDir: true,
    rollupOptions: {
      input,
    },
  },
  preview: {
    port: 5173,
  },
})
