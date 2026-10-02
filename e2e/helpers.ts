import { expect, type Page } from '@playwright/test'

declare global {
  interface Window {
    __audioLog: { clip: string; at: number }[]
    __audio: { loadedCount: number }
  }
}

export const TOTAL_CLIPS = 13

export async function startGame(page: Page): Promise<void> {
  await page.goto('./')
  await page.getByTestId('start').click()
  await expect(page.getByTestId('play-scene')).toBeVisible()
}

/**
 * Toca ➕ o ➖. Un botón con aria-disabled sigue aceptando toques (en 0, ➖ responde con una
 * frase amable), pero Playwright no hace clic en él sin `force`.
 */
export async function tap(page: Page, testId: 'add' | 'remove', times = 1): Promise<void> {
  const button = page.getByTestId(testId)
  for (let i = 0; i < times; i++) {
    const force = (await button.getAttribute('aria-disabled')) === 'true'
    await button.click({ force })
  }
}

export function filledSlots(page: Page) {
  return page.locator('[data-testid="slot"][data-filled="true"]')
}

/** Huecos ocupados como cadena "1111100000" (1 = fruta), en orden de hueco. */
export async function slotPattern(page: Page): Promise<string> {
  const values = await page
    .getByTestId('slot')
    .evaluateAll((slots) =>
      slots.map((s) => (s.getAttribute('data-filled') === 'true' ? '1' : '0')),
    )
  return values.join('')
}

export async function expectCount(page: Page, n: number): Promise<void> {
  await expect(filledSlots(page)).toHaveCount(n)
  await expect(page.getByTestId('count-display')).toHaveText(String(n))
}

export async function audioClips(page: Page): Promise<string[]> {
  return page.evaluate(() => window.__audioLog.map((e) => e.clip))
}

export async function clearAudio(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.__audioLog.length = 0
  })
}

/** Lleva el marco a `n` frutas y limpia el registro de audio. */
export async function setCount(page: Page, n: number): Promise<void> {
  await tap(page, 'add', n)
  await expectCount(page, n)
  await clearAudio(page)
}

/** Espera a que el service worker controle la página (y, por tanto, haya terminado el precache). */
export async function waitForServiceWorker(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
    if (!navigator.serviceWorker.controller) {
      await new Promise((r) => navigator.serviceWorker.addEventListener('controllerchange', r))
    }
  })
}
