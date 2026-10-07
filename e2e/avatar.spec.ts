import { expect, test, type Page } from '@playwright/test'
import {
  adventureWorld,
  audioClips,
  hops,
  levelNode,
  option,
  setAvatar,
  setChallenge,
  setProgress,
  TOTAL_CLIPS,
  worldButton,
  type Progress,
  type WorldId,
} from './helpers.ts'

const avatar = (page: Page) => page.getByTestId('avatar')
const avatarOption = (page: Page, fruit: WorldId) =>
  page.locator(`[data-testid="avatar-option"][data-avatar="${fruit}"]`)

async function open(page: Page, progress: Partial<Progress> = {}, fruit: WorldId | null = 'apple') {
  await page.goto('./')
  if (fruit) await setAvatar(page, fruit)
  await setProgress(page, progress)
}

/** Juega `level` del mapa abierto y lo acierta con un reto forzado de "¿Cuántas hay?". */
async function winLevel(page: Page, level: number) {
  await levelNode(page, level).click()
  await expect(page.getByTestId('challenge-scene')).toBeVisible()
  await setChallenge(page, { kind: 'howMany', target: 1, options: [1, 2, 3] })
  await option(page, 1).click()
  await expect(page.getByTestId('level-map')).toBeVisible({ timeout: 5000 })
}

test.describe('Elegir avatar', () => {
  test('CA1: la primera vez en "Mundos" se elige personaje con la pregunta', async ({ page }) => {
    await open(page, {}, null)
    await page.getByTestId('start-worlds').click()
    await expect(page.getByTestId('avatar-picker')).toBeVisible()
    await expect(page.getByTestId('avatar-option')).toHaveCount(4)
    for (const opt of await page.getByTestId('avatar-option').all()) {
      const box = (await opt.boundingBox())!
      expect(box.width).toBeGreaterThanOrEqual(160)
      expect(box.height).toBeGreaterThanOrEqual(160)
    }
    await expect.poll(() => page.evaluate(() => window.__audio.loadedCount)).toBe(TOTAL_CLIPS)
    await expect.poll(() => audioClips(page)).toEqual(['chooseAvatar'])

    await avatarOption(page, 'strawberry').click()
    await expect(page.getByTestId('world-select')).toBeVisible()
    await expect(page.getByTestId('avatar-button')).toHaveAttribute('data-avatar', 'strawberry')
  })

  test('CA1: la primera vez en "Aventura" vuelve al camino con el avatar', async ({ page }) => {
    await open(page, {}, null)
    await page.getByTestId('start-adventure').click()
    await avatarOption(page, 'banana').click()
    await expect(page.getByTestId('adventure-path')).toBeVisible()
    await expect(avatar(page)).toHaveAttribute('data-avatar', 'banana')
  })

  test('CA2: el avatar se recuerda al recargar y no se vuelve a pedir', async ({ page }) => {
    await open(page, {}, null)
    await page.getByTestId('start-worlds').click()
    await avatarOption(page, 'orange').click()
    await page.reload()
    await page.getByTestId('start-worlds').click()
    await expect(page.getByTestId('world-select')).toBeVisible()
    await expect(page.getByTestId('avatar-picker')).toHaveCount(0)
    await expect(page.getByTestId('avatar-button')).toHaveAttribute('data-avatar', 'orange')
  })

  test('CA2: con un valor guardado inválido se pide elegir, sin errores', async ({ page }) => {
    await page.goto('./')
    await page.evaluate(() => localStorage.setItem('contar-frutas:avatar:v1', 'kiwi'))
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.reload()
    await page.getByTestId('start-worlds').click()
    await expect(page.getByTestId('avatar-picker')).toBeVisible()
    expect(errors).toEqual([])
  })

  test('CA3: el botón del avatar permite cambiarlo, con el actual marcado', async ({ page }) => {
    await open(page, {}, 'strawberry')
    await page.getByTestId('start-worlds').click()
    await page.getByTestId('avatar-button').click()
    await expect(avatarOption(page, 'strawberry')).toHaveAttribute('data-current', 'true')
    await avatarOption(page, 'banana').click()
    await expect(page.getByTestId('world-select')).toBeVisible()
    await expect(page.getByTestId('avatar-button')).toHaveAttribute('data-avatar', 'banana')

    await worldButton(page, 'apple').click()
    await expect(avatar(page)).toHaveAttribute('data-avatar', 'banana')
  })

  test('CA3: el botón del avatar está en la aventura pero no en el mapa', async ({ page }) => {
    await open(page)
    await page.getByTestId('start-adventure').click()
    await expect(page.getByTestId('avatar-button')).toBeVisible()
    await adventureWorld(page, 'apple').click()
    await expect(page.getByTestId('avatar-button')).toHaveCount(0)
  })
})

test.describe('Avatar en el mapa', () => {
  test('CA4: está sobre el nivel siguiente y no bloquea el toque', async ({ page }) => {
    await open(page, { strawberry: 3 })
    await page.getByTestId('start-worlds').click()
    await worldButton(page, 'strawberry').click()
    await expect(avatar(page)).toHaveAttribute('data-at', '4')

    // Toque justo donde está el avatar: lo recibe el nodo de debajo.
    const box = (await avatar(page).locator('img').boundingBox())!
    await page.mouse.click(box.x + box.width / 2, box.y + box.height - 4)
    await expect(page.getByTestId('challenge-scene')).toBeVisible()
  })

  test('CA4: con el mundo completo está sobre el nodo 10', async ({ page }) => {
    await open(page, { apple: 10 })
    await page.getByTestId('start-worlds').click()
    await worldButton(page, 'apple').click()
    await expect(avatar(page)).toHaveAttribute('data-at', '10')
  })

  test('CA5: salta del nivel completado al siguiente; repetir no lo mueve', async ({ page }) => {
    await open(page, { apple: 2 })
    await page.getByTestId('start-worlds').click()
    await worldButton(page, 'apple').click()
    await winLevel(page, 3)
    await expect(avatar(page)).toHaveAttribute('data-at', '4')
    expect(await hops(page)).toEqual([{ from: '3', to: '4', animated: true }])

    await winLevel(page, 1)
    await expect(avatar(page)).toHaveAttribute('data-at', '4')
    expect(await hops(page)).toHaveLength(1)
  })

  test('CA8: con "reducir movimiento" cambia de nodo sin salto animado', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await open(page, { apple: 2 })
    await page.getByTestId('start-worlds').click()
    await worldButton(page, 'apple').click()
    await winLevel(page, 3)
    await expect(avatar(page)).toHaveAttribute('data-at', '4')
    expect(await hops(page)).toEqual([{ from: '3', to: '4', animated: false }])
  })
})

test.describe('Avatar en la aventura', () => {
  test('CA6: está sobre el mundo actual', async ({ page }) => {
    await open(page, { apple: 10, banana: 4 })
    await page.getByTestId('start-adventure').click()
    await expect(avatar(page)).toHaveAttribute('data-at', 'banana')
  })

  test('CA6: salta al mundo desbloqueado antes de que se abra', async ({ page }) => {
    await open(page, { apple: 9 })
    await page.getByTestId('start-adventure').click()
    await expect(avatar(page)).toHaveAttribute('data-at', 'apple')
    await adventureWorld(page, 'apple').click()
    await levelNode(page, 10).click()
    await setChallenge(page, { kind: 'howMany', target: 1, options: [1, 2, 3] })
    await option(page, 1).click()

    await expect(page.getByTestId('adventure-path')).toBeVisible({ timeout: 10_000 })
    await expect(avatar(page)).toHaveAttribute('data-at', 'banana')
    await expect
      .poll(() => hops(page))
      .toContainEqual({
        from: 'apple',
        to: 'banana',
        animated: true,
      })
    // El salto ocurre en el camino, antes de que se abra el mapa del plátano.
    await expect(page.getByTestId('level-map')).toHaveCount(0)
    await expect(page.getByTestId('level-map')).toHaveAttribute('data-world', 'banana', {
      timeout: 10_000,
    })
  })

  test('CA7: reiniciar el progreso no cambia el avatar y lo devuelve al inicio', async ({
    page,
  }) => {
    await open(page, { apple: 10, banana: 3 }, 'banana')
    await page.getByTestId('start-adventure').click()
    await expect(avatar(page)).toHaveAttribute('data-at', 'banana')
    await page.getByTestId('reset-progress').click()
    await page.getByTestId('reset-confirm').click()
    await expect(avatar(page)).toHaveAttribute('data-at', 'apple')
    await expect(avatar(page)).toHaveAttribute('data-avatar', 'banana')
    expect(await page.evaluate(() => window.__avatar.get())).toBe('banana')
  })
})
