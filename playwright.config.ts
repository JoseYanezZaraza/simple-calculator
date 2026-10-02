import { defineConfig, devices } from '@playwright/test'

const port = 4173

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'ipad-portrait', use: { ...devices['iPad (gen 7)'] }, testIgnore: /offline/ },
    {
      name: 'ipad-landscape',
      use: { ...devices['iPad (gen 7) landscape'] },
      testIgnore: /offline/,
    },
    // El WebKit de Playwright no puede recargar sin red; el offline real se prueba en Chromium.
    {
      name: 'offline-chromium',
      use: { ...devices['iPad (gen 7)'], browserName: 'chromium' },
      testMatch: /offline/,
    },
  ],
  webServer: {
    // El modo "e2e" expone window.__audioLog para verificar qué audios suenan.
    command: `npx vite build --mode e2e && npx vite preview --port ${port} --strictPort`,
    port,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
