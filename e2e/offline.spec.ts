import { expect, test } from '@playwright/test'
import {
  adventureWorld,
  audioClips,
  levelNode,
  setAvatar,
  setProgress,
  expectCount,
  startChallenges,
  startGame,
  tap,
  TOTAL_CLIPS,
  waitForServiceWorker,
} from './helpers.ts'

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

test('CA11 (retos): el modo retos funciona sin conexión con sus audios', async ({
  page,
  context,
}) => {
  await page.goto('./')
  await waitForServiceWorker(page)

  await context.setOffline(true)
  await page.reload()
  await startChallenges(page)
  const scene = page.getByTestId('challenge-scene')
  const kind = await scene.getAttribute('data-kind')
  const target = await scene.getAttribute('data-target')
  await expect
    .poll(() => audioClips(page))
    .toEqual(kind === 'howMany' ? ['howMany'] : ['put', target])
  // Los audios nuevos se decodificaron desde la caché (startChallenges espera a los 17).
  await page.getByTestId('repeat').click()
  const question = kind === 'howMany' ? ['howMany'] : ['put', target]
  await expect.poll(() => audioClips(page)).toEqual([...question, ...question])
})

test('CA12 (mundos): la aventura funciona sin conexión con el progreso guardado', async ({
  page,
  context,
}) => {
  await page.goto('./')
  await setAvatar(page, 'banana')
  await setProgress(page, { apple: 10, banana: 3 })
  await waitForServiceWorker(page)

  await context.setOffline(true)
  await page.reload()
  await page.getByTestId('start-adventure').click()
  const states = await page
    .getByTestId('adventure-world')
    .evaluateAll((els) => els.map((e) => e.getAttribute('data-state')))
  expect(states).toEqual(['done', 'next', 'locked', 'locked'])

  await adventureWorld(page, 'banana').click()
  await expect(page.getByTestId('world-theme')).toHaveAttribute('data-world', 'banana')
  await levelNode(page, 4).click()
  await expect.poll(() => page.evaluate(() => window.__audio.loadedCount)).toBe(TOTAL_CLIPS)
  await expect.poll(async () => (await audioClips(page)).length).toBeGreaterThan(0)
})

test('CA9 (avatar): se elige y aparece en la aventura sin conexión', async ({ page, context }) => {
  await page.goto('./')
  await waitForServiceWorker(page)

  await context.setOffline(true)
  await page.reload()
  await page.getByTestId('start-adventure').click()
  await expect(page.getByTestId('avatar-option')).toHaveCount(4)
  const loaded = await page
    .locator('[data-testid="avatar-option"] img')
    .evaluateAll((imgs) => imgs.every((img) => (img as HTMLImageElement).naturalWidth > 0))
  expect(loaded).toBe(true)
  await expect.poll(() => audioClips(page)).toEqual(['chooseAvatar'])

  await page.locator('[data-testid="avatar-option"][data-avatar="orange"]').click()
  await expect(page.getByTestId('avatar')).toHaveAttribute('data-avatar', 'orange')
})
