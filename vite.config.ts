import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@':        new URL('./src', import.meta.url).pathname,
      '@core':    new URL('./src/core', import.meta.url).pathname,
      '@shared':  new URL('./src/shared', import.meta.url).pathname,
      '@domains': new URL('./src/domains', import.meta.url).pathname,
      '@store':   new URL('./src/store', import.meta.url).pathname,
      '@layouts': new URL('./src/layouts', import.meta.url).pathname,
      '@pages':   new URL('./src/pages', import.meta.url).pathname,
      '@routes':  new URL('./src/routes', import.meta.url).pathname,
      '@config':  new URL('./src/config', import.meta.url).pathname,
      '@assets':  new URL('./src/assets', import.meta.url).pathname,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: ['node_modules/', 'src/test/', '**/*.d.ts', '**/*.config.*'],
    },
  },
})
