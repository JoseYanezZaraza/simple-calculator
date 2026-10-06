import { expect, test } from '@playwright/test'
import {
  audioClips,
  celebrations,
  highlights,
  expectCount,
  filledSlots,
  setCount,
  slotPattern,
  startGame,
  tap,
} from './helpers.ts'

test.describe('Juego libre', () => {
  test.beforeEach(async ({ page }) => {
    await startGame(page)
  })

  test('CA1: ➕ con N < 10 muestra N+1 frutas, el número N+1 y dice su número', async ({
    page,
  }) => {
    await setCount(page, 3)
    await tap(page, 'add')
    await expectCount(page, 4)
    expect(await audioClips(page)).toEqual(['4'])
  })

  test('CA2: ➖ con N > 0 muestra N−1 frutas, el número N−1 y dice su número', async ({ page }) => {
    await setCount(page, 7)
    await tap(page, 'remove')
    await expectCount(page, 6)
    expect(await slotPattern(page)).toBe('1111110000')
    expect(await audioClips(page)).toEqual(['6'])
  })

  test('CA3: al llegar a 10 hay celebración y ➕ queda desactivado', async ({ page }) => {
    await setCount(page, 9)
    await tap(page, 'add')
    await expectCount(page, 10)
    await expect.poll(() => celebrations(page)).toBe(1)
    await expect(page.getByTestId('add')).toHaveAttribute('aria-disabled', 'true')
    expect(await audioClips(page)).toEqual(['10', 'full'])

    // Tocar ➕ lleno no cambia nada.
    await tap(page, 'add')
    await expectCount(page, 10)
  })

  test('CA3: la celebración se repite cada vez que se vuelve a llegar a 10', async ({ page }) => {
    await setCount(page, 10)
    await expect.poll(() => celebrations(page)).toBe(1)
    await tap(page, 'remove')
    await tap(page, 'add')
    await expect.poll(() => celebrations(page)).toBe(2)
  })

  test('CA4: con 0 frutas ➖ está desactivado y suena la frase amable sin errores', async ({
    page,
  }) => {
    await expect(page.getByTestId('remove')).toHaveAttribute('aria-disabled', 'true')
    await tap(page, 'remove')
    await expectCount(page, 0)
    expect(await audioClips(page)).toEqual(['empty'])
    await expect(page.getByRole('alert')).toHaveCount(0)
  })

  test('CA5: las frutas ocupan los huecos en orden fijo', async ({ page }) => {
    await tap(page, 'add', 7)
    await expectCount(page, 7)
    expect(await slotPattern(page)).toBe('1111111000')

    await tap(page, 'remove', 3)
    await tap(page, 'add')
    await expectCount(page, 5)
    expect(await slotPattern(page)).toBe('1111100000')
  })

  test('CA6: tocar una fruta cuenta de 1 a N resaltando cada una', async ({ page }) => {
    await setCount(page, 4)
    await filledSlots(page).nth(1).getByRole('button').click()
    await expect.poll(() => highlights(page), { timeout: 6000 }).toEqual([0, 1, 2, 3])
    await expect.poll(() => audioClips(page), { timeout: 6000 }).toEqual(['1', '2', '3', '4'])
    await expect(page.locator('[data-highlighted="true"]')).toHaveCount(0, { timeout: 3000 })
  })

  test('CA7: con la voz silenciada no suena nada y el resto se mantiene', async ({ page }) => {
    await page.getByTestId('voice-toggle').click()
    await expect(page.getByTestId('voice-toggle')).toHaveAttribute('aria-pressed', 'true')

    await tap(page, 'add', 10)
    await expectCount(page, 10)
    await expect.poll(() => celebrations(page)).toBe(1)
    await filledSlots(page).first().getByRole('button').click()
    // Con la voz silenciada el conteo resalta igual: basta con ver empezar el resaltado.
    await expect.poll(() => highlights(page)).toContain(0)
    await tap(page, 'remove', 11)
    await expectCount(page, 0)

    expect(await audioClips(page)).toEqual([])
  })

  test('CA8: cambiar de fruta sustituye todas sin alterar la cantidad', async ({ page }) => {
    await setCount(page, 4)
    await expect(page.locator('[data-testid="slot"] img[data-fruit="apple"]')).toHaveCount(4)

    await page.getByTestId('fruit-picker').click()
    await page.locator('[data-fruit-option="banana"]').click()

    await expect(page.locator('[data-testid="slot"] img[data-fruit="banana"]')).toHaveCount(4)
    await expect(page.locator('[data-testid="slot"] img[data-fruit="apple"]')).toHaveCount(0)
    await expectCount(page, 4)
  })

  test('los botones ➕ y ➖ miden al menos 120×120 px', async ({ page }) => {
    for (const id of ['add', 'remove'] as const) {
      const box = await page.getByTestId(id).boundingBox()
      expect(box!.width).toBeGreaterThanOrEqual(120)
      expect(box!.height).toBeGreaterThanOrEqual(120)
    }
  })

  test('toques rápidos consecutivos dejan el estado correcto', async ({ page }) => {
    await setCount(page, 1)
    await page.getByTestId('add').click({ clickCount: 1 })
    await page.getByTestId('add').click({ clickCount: 1 })
    await page.getByTestId('add').click({ clickCount: 1 })
    await expectCount(page, 4)
    expect((await audioClips(page)).at(-1)).toBe('4')
  })
})
