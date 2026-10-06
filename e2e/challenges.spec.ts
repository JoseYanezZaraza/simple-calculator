import { expect, test, type Page } from '@playwright/test'
import {
  audioClips,
  celebrations,
  clearAudio,
  expectWellDone,
  highlights,
  optionHighlights,
  expectCount,
  filledSlots,
  option,
  setChallenge,
  slotPattern,
  startChallenges,
  tap,
  TOTAL_CLIPS,
} from './helpers.ts'

const highlightedSlots = (page: Page) =>
  page.locator('[data-testid="slot"][data-highlighted="true"]')

/** Resuelve el reto actual correctamente leyendo `data-kind` y `data-target`. */
async function solve(page: Page) {
  const scene = page.getByTestId('challenge-scene')
  const kind = await scene.getAttribute('data-kind')
  const target = Number(await scene.getAttribute('data-target'))
  if (kind === 'howMany') {
    await option(page, target).click()
  } else {
    await tap(page, 'add', target)
    await page.getByTestId('confirm').click()
  }
  return `${kind}:${target}`
}

test.describe('Pantalla inicial', () => {
  test('CA1: ofrece "jugar libre" y "retos" con botones grandes', async ({ page }) => {
    await page.goto('./')
    for (const id of ['start-free', 'start-challenges']) {
      const box = await page.getByTestId(id).boundingBox()
      expect(box!.width).toBeGreaterThanOrEqual(160)
      expect(box!.height).toBeGreaterThanOrEqual(160)
    }
  })

  test('CA1: "jugar libre" entra en el juego libre con 0 frutas y audio habilitado', async ({
    page,
  }) => {
    await page.goto('./')
    await page.getByTestId('start-free').click()
    await expect(page.getByTestId('slot')).toHaveCount(10)
    await expectCount(page, 0)
    await expect.poll(() => page.evaluate(() => window.__audio.loadedCount)).toBe(TOTAL_CLIPS)
    await tap(page, 'add')
    expect(await audioClips(page)).toEqual(['1'])
  })

  test('CA1: "retos" entra en los retos y suena la primera pregunta', async ({ page }) => {
    await startChallenges(page)
    const scene = page.getByTestId('challenge-scene')
    const kind = await scene.getAttribute('data-kind')
    const target = await scene.getAttribute('data-target')
    const expected = kind === 'howMany' ? ['howMany'] : ['put', target]
    await expect.poll(() => audioClips(page)).toEqual(expected)
  })
})

test.describe('Retos', () => {
  test.beforeEach(async ({ page }) => {
    await startChallenges(page)
  })

  test('CA2: "¿Cuántas hay?" muestra N frutas, pregunta y ofrece 3 opciones', async ({ page }) => {
    await setChallenge(page, { kind: 'howMany', target: 7, options: [5, 7, 9] })
    expect(await slotPattern(page)).toBe('1111111000')
    await expect(page.getByTestId('option')).toHaveText(['5', '7', '9'])
    await expect(page.getByTestId('add')).toHaveCount(0)
    await expect(page.getByTestId('remove')).toHaveCount(0)
    expect(await audioClips(page)).toEqual(['howMany'])
  })

  test('CA3: acertar celebra, dice "¡Muy bien!" y trae un reto nuevo', async ({ page }) => {
    await setChallenge(page, { kind: 'howMany', target: 3, options: [2, 3, 5] })
    await clearAudio(page)
    await option(page, 3).click()
    const scene = page.getByTestId('challenge-scene')
    await expect.poll(() => celebrations(page)).toBe(1)
    await expectWellDone(page)

    // La pausa exacta (SUCCESS_PAUSE_MS) se verifica en los tests unitarios.
    await expect(scene).toHaveAttribute('data-phase', 'asking', { timeout: 5000 })
    const next = `${await scene.getAttribute('data-kind')}:${await scene.getAttribute('data-target')}`
    expect(next).not.toBe('howMany:3')
  })

  test('CA4: una opción incorrecta lleva a contar juntos y repetir, sin errores', async ({
    page,
  }) => {
    await setChallenge(page, { kind: 'howMany', target: 6, options: [4, 6, 8] })
    await clearAudio(page)
    await option(page, 8).click()

    await expect.poll(() => highlights(page), { timeout: 10_000 }).toEqual([0, 1, 2, 3, 4, 5])
    await expect
      .poll(() => audioClips(page), { timeout: 10_000 })
      .toEqual(['letsCount', '1', '2', '3', '4', '5', '6', 'howMany'])

    await expect(page.getByTestId('option')).toHaveText(['4', '6', '8'])
    await expectCountSlots(page, 6)
    await expect(page.getByTestId('challenge-scene')).toHaveAttribute('data-phase', 'asking')
    expect(await celebrations(page)).toBe(0)
    await expect(page.getByRole('alert')).toHaveCount(0)
  })

  test('CA5: "Pon N" empieza vacío, muestra N y pide "Pon N"', async ({ page }) => {
    await setChallenge(page, { kind: 'put', target: 4 })
    await expectCountSlots(page, 0)
    await expect(page.getByTestId('count-display')).toHaveText('4')
    expect(await audioClips(page)).toEqual(['put', '4'])
    for (const id of ['remove', 'confirm', 'add']) await expect(page.getByTestId(id)).toBeVisible()

    await clearAudio(page)
    await tap(page, 'add', 3)
    await expectCountSlots(page, 3)
    expect((await audioClips(page)).at(-1)).toBe('3')
  })

  test('CA5: en "Pon N" llegar a 10 no celebra', async ({ page }) => {
    await setChallenge(page, { kind: 'put', target: 6 })
    await tap(page, 'add', 9)
    await clearAudio(page)
    await tap(page, 'add')
    await expectCountSlots(page, 10)
    expect(await audioClips(page)).toEqual(['10'])
    expect(await celebrations(page)).toBe(0)
  })

  test('CA6: ✓ con N frutas es acierto', async ({ page }) => {
    await setChallenge(page, { kind: 'put', target: 5 })
    await tap(page, 'add', 5)
    await clearAudio(page)
    await page.getByTestId('confirm').click()
    await expect.poll(() => celebrations(page)).toBe(1)
    await expectWellDone(page)
  })

  test('CA6: ✓ con otra cantidad cuenta, repite y no vacía el marco', async ({ page }) => {
    await setChallenge(page, { kind: 'put', target: 4 })
    await tap(page, 'add', 6)
    await clearAudio(page)
    await page.getByTestId('confirm').click()
    await expect
      .poll(() => audioClips(page), { timeout: 10_000 })
      .toEqual(['letsCount', '1', '2', '3', '4', '5', '6', 'put', '4'])
    await expectCountSlots(page, 6)
    await tap(page, 'remove', 2)
    await expectCountSlots(page, 4)
  })

  test('CA7: tres aciertos seguidos traen retos distintos cada vez', async ({ page }) => {
    const scene = page.getByTestId('challenge-scene')
    let previous = await solve(page)
    for (let i = 0; i < 3; i++) {
      await expect(scene).toHaveAttribute('data-phase', 'asking', { timeout: 5000 })
      const current = await solve(page)
      expect(current).not.toBe(previous)
      previous = current
    }
  })

  test('CA8: el botón de repetir vuelve a decir la pregunta', async ({ page }) => {
    await setChallenge(page, { kind: 'put', target: 9 })
    await clearAudio(page)
    await page.getByTestId('repeat').click()
    expect(await audioClips(page)).toEqual(['put', '9'])
  })

  test('CA9: "inicio" vuelve a la pantalla inicial desde los retos', async ({ page }) => {
    await page.getByTestId('home').click()
    await expect(page.getByTestId('start-free')).toBeVisible()
    await expect(page.getByTestId('start-challenges')).toBeVisible()
    await expect(page.getByTestId('challenge-scene')).toHaveCount(0)
  })

  test('CA10: con la voz silenciada los retos funcionan igual sin audio', async ({ page }) => {
    await page.getByTestId('voice-toggle').click()
    await setChallenge(page, { kind: 'howMany', target: 3, options: [2, 3, 4] })
    await option(page, 2).click()
    await expect.poll(() => highlights(page), { timeout: 10_000 }).toEqual([0, 1, 2])
    await expect(highlightedSlots(page)).toHaveCount(0, { timeout: 6000 })
    await option(page, 3).click()
    await expect.poll(() => celebrations(page)).toBe(1)
    await expect(page.getByTestId('challenge-scene')).toHaveAttribute('data-phase', 'asking', {
      timeout: 5000,
    })
    expect(await audioClips(page)).toEqual([])
  })

  test('CA10: los retos usan la fruta elegida por el adulto', async ({ page }) => {
    await page.getByTestId('fruit-picker').click()
    await page.locator('[data-fruit-option="strawberry"]').click()
    await setChallenge(page, { kind: 'howMany', target: 4, options: [3, 4, 5] })
    await expect(page.locator('[data-testid="slot"] img[data-fruit="strawberry"]')).toHaveCount(4)
  })
})

test('CA9: "inicio" desde el juego libre vacía el marco al volver y conserva la fruta', async ({
  page,
}) => {
  await page.goto('./')
  await page.getByTestId('start-free').click()
  await tap(page, 'add', 5)
  await page.getByTestId('fruit-picker').click()
  await page.locator('[data-fruit-option="banana"]').click()

  await page.getByTestId('home').click()
  await page.getByTestId('start-free').click()
  await expectCount(page, 0)
  await tap(page, 'add')
  await expect(filledSlots(page).locator('img[data-fruit="banana"]')).toHaveCount(1)
})

async function expectCountSlots(page: Page, n: number) {
  await expect(filledSlots(page)).toHaveCount(n)
}

test.describe('Escuchar el número de una opción', () => {
  test.beforeEach(async ({ page }) => {
    await startChallenges(page)
    await setChallenge(page, { kind: 'howMany', target: 6, options: [4, 6, 8] })
    await clearAudio(page)
  })

  const speaker = (page: Page, index: number) => page.getByTestId('option-audio').nth(index)

  test('CA1: cada opción tiene su altavoz de ≥72 px separado ≥16 px', async ({ page }) => {
    await expect(page.getByTestId('option-audio')).toHaveCount(3)
    for (let i = 0; i < 3; i++) {
      const o = (await page.getByTestId('option').nth(i).boundingBox())!
      const a = (await speaker(page, i).boundingBox())!
      expect(a.width).toBeGreaterThanOrEqual(72)
      expect(a.height).toBeGreaterThanOrEqual(72)
      expect(a.y - (o.y + o.height)).toBeGreaterThanOrEqual(16)
    }
  })

  test('CA2: el altavoz dice el número de su opción y la resalta', async ({ page }) => {
    await speaker(page, 2).click()
    expect(await audioClips(page)).toEqual(['8'])
    await expect.poll(() => optionHighlights(page)).toEqual([8])
    // Al terminar el paso deja de estar resaltada.
    await expect(page.getByTestId('option').nth(2)).toHaveAttribute('data-highlighted', 'false', {
      timeout: 3000,
    })
  })

  test('CA2: el altavoz interrumpe el "contar juntos"', async ({ page }) => {
    await option(page, 8).click()
    await expect.poll(() => audioClips(page)).toContain('1')
    await speaker(page, 0).click()
    await page.waitForTimeout(2000)
    const clips = await audioClips(page)
    expect(clips.at(-1)).toBe('4')
    expect(clips).not.toContain('howMany')
  })

  test('CA3: escuchar no es responder; después se puede acertar', async ({ page }) => {
    await speaker(page, 2).click()
    await speaker(page, 1).click()
    expect(await audioClips(page)).toEqual(['8', '6'])
    expect(await celebrations(page)).toBe(0)
    await expect(page.getByTestId('option')).toHaveText(['4', '6', '8'])
    const scene = page.getByTestId('challenge-scene')
    await expect(scene).toHaveAttribute('data-target', '6')
    await expect(scene).toHaveAttribute('data-phase', 'asking')

    await option(page, 6).click()
    await expect.poll(() => celebrations(page)).toBe(1)
  })

  test('CA4: con la voz silenciada no suena pero resalta', async ({ page }) => {
    await page.getByTestId('voice-toggle').click()
    await speaker(page, 1).click()
    await expect(page.getByTestId('option').nth(1)).toHaveAttribute('data-highlighted', 'false', {
      timeout: 3000,
    })
    expect(await audioClips(page)).toEqual([])
    expect(await optionHighlights(page)).toContain(6)
  })

  test('CA5: durante la celebración el altavoz no hace nada', async ({ page }) => {
    // Los dos toques en el mismo instante: un runner lento no puede dejar acabar la celebración.
    await page.evaluate(() => {
      const options = document.querySelectorAll<HTMLElement>('[data-testid="option"]')
      const speakers = document.querySelectorAll<HTMLElement>('[data-testid="option-audio"]')
      options[1].click()
      speakers[0].click()
    })
    expect(await optionHighlights(page)).toEqual([])
    const clips = await audioClips(page)
    expect(clips[0]).toBe('wellDone')
    expect(clips).not.toContain('4')
  })
})
