import { expect, type Page } from '@playwright/test'

type Challenge =
  { kind: 'howMany'; target: number; options: number[] } | { kind: 'put'; target: number }

declare global {
  interface Window {
    __audioLog: { clip: string; at: number }[]
    __audio: { loadedCount: number }
    __challenges: { set: (challenge: Challenge) => void }
    __celebrationLog?: number[]
    __highlightLog?: number[]
    __optionHighlightLog?: number[]
  }
}

/** 0–10, "full", "empty" y los 4 audios de los retos. */
export const TOTAL_CLIPS = 17

/** Entra en el juego libre desde la pantalla inicial. */
export async function startGame(page: Page): Promise<void> {
  await page.goto('./')
  await page.getByTestId('start-free').click()
  await expect(page.getByTestId('play-scene')).toBeVisible()
}

/** Entra en los retos y espera a que los audios estén cargados (la primera pregunta ya sonó). */
export async function startChallenges(page: Page): Promise<void> {
  await page.goto('./')
  await page.getByTestId('start-challenges').click()
  await expect(page.getByTestId('challenge-scene')).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.__audio.loadedCount)).toBe(TOTAL_CLIPS)
}

/** Fuerza el reto actual (solo en el build de e2e); el registro de audio queda con su pregunta. */
export async function setChallenge(page: Page, challenge: Challenge): Promise<void> {
  await clearAudio(page)
  await page.evaluate((c) => window.__challenges.set(c), challenge)
  const scene = page.getByTestId('challenge-scene')
  await expect(scene).toHaveAttribute('data-kind', challenge.kind)
  await expect(scene).toHaveAttribute('data-target', String(challenge.target))
}

export function option(page: Page, value: number) {
  return page.getByTestId('option').filter({ hasText: new RegExp(`^${value}$`) })
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

/**
 * Número de celebraciones mostradas desde que cargó la página. La celebración solo dura
 * 1,8 s: comprobar el elemento visible falla en runners lentos, el registro no caduca.
 */
export async function celebrations(page: Page): Promise<number> {
  return page.evaluate(() => window.__celebrationLog?.length ?? 0)
}

/**
 * Tras un acierto debe sonar primero "¡Muy bien!" y nunca "¡Vamos a contarlas!". No se exige
 * que no suene nada más: pasados 2 s ya empieza el reto siguiente con su pregunta, y en un
 * runner lento la lectura del registro puede llegar después.
 */
export async function expectWellDone(page: Page): Promise<void> {
  const clips = await audioClips(page)
  expect(clips[0]).toBe('wellDone')
  expect(clips).not.toContain('letsCount')
}

/**
 * Frutas resaltadas al contar (índices base 0, en orden) desde que cargó la página. Cada
 * resaltado dura ~750 ms: el registro evita depender de verlo a tiempo en un runner lento.
 */
export async function highlights(page: Page): Promise<number[]> {
  return page.evaluate(() => window.__highlightLog ?? [])
}

/** Opciones resaltadas al tocar su altavoz, en orden, desde que cargó la página. */
export async function optionHighlights(page: Page): Promise<number[]> {
  return page.evaluate(() => window.__optionHighlightLog ?? [])
}
