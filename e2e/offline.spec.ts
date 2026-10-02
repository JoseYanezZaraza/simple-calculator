import { expect, test } from '@playwright/test'
import { expectCount, startGame, tap, TOTAL_CLIPS, waitForServiceWorker } from './helpers.ts'

// Se ejecuta en Chromium con perfil de iPad: el WebKit de Playwright no permite recargar
// sin red aunque el service worker tenga la respuesta. En WebKit se verifica el precache
// (ipad-shell.spec.ts) y en un iPad real se prueba a mano en modo avión.
test('CA9: tras la primera carga, la app funciona sin conexión', async ({ page, context }) => {
  await page.goto('./')
  await waitForServiceWorker(page)

  await context.setOffline(true)
  await page.reload()
  await startGame(page)
  await expect.poll(() => page.evaluate(() => window.__audio.loadedCount)).toBe(TOTAL_CLIPS)

  await tap(page, 'add', 3)
  await expectCount(page, 3)
  const imagesLoaded = await page
    .locator('[data-testid="slot"] img')
    .evaluateAll((imgs) => imgs.every((img) => (img as HTMLImageElement).naturalWidth > 0))
  expect(imagesLoaded).toBe(true)
})
