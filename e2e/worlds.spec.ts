import { expect, test, type Page } from '@playwright/test'
import {
  adventureWorld,
  audioClips,
  celebrationKinds,
  clearAudio,
  getProgress,
  levelNode,
  option,
  setChallenge,
  setAvatar,
  setProgress,
  tap,
  TOTAL_CLIPS,
  worldButton,
  type Progress,
  type WorldId,
} from './helpers.ts'

/** Tras celebración de mundo (3,5 s) y desbloqueo (2,5 s) en un runner lento. */
const WORLD_FLOW_TIMEOUT = 15_000

async function openHome(page: Page, progress: Partial<Progress> = {}) {
  await page.goto('./')
  await setAvatar(page, 'apple')
  await setProgress(page, progress)
}

/** Acierta el reto en curso leyendo `data-kind` y `data-target`. */
async function solveCurrent(page: Page) {
  const scene = page.getByTestId('challenge-scene')
  await expect(scene).toBeVisible()
  const kind = await scene.getAttribute('data-kind')
  const target = Number(await scene.getAttribute('data-target'))
  if (kind === 'howMany') {
    await option(page, target).click()
  } else {
    await tap(page, 'add', target)
    await page.getByTestId('confirm').click()
  }
  return { kind, target }
}

async function playLevel(page: Page, level: number) {
  await levelNode(page, level).click()
  await expect(page.getByTestId('challenge-scene')).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.__audio.loadedCount)).toBe(TOTAL_CLIPS)
}

async function expectProgressShown(page: Page, world: WorldId, done: number) {
  await expect(worldButton(page, world)).toHaveAttribute('data-progress', String(done))
}

test.describe('Pantalla inicial', () => {
  test('CA1: tres botones grandes que caben en pantalla', async ({ page }) => {
    await page.goto('./')
    const viewport = page.viewportSize()!
    for (const id of ['start-free', 'start-worlds', 'start-adventure']) {
      const box = (await page.getByTestId(id).boundingBox())!
      expect(box.width).toBeGreaterThanOrEqual(160)
      expect(box.height).toBeGreaterThanOrEqual(160)
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
      expect(box.y + box.height).toBeLessThanOrEqual(viewport.height)
    }
    await expect(page.getByTestId('start-challenges')).toHaveCount(0)
  })
})

test.describe('Mundos', () => {
  test('CA2: muestra los 4 mundos en orden con su progreso, todos abiertos', async ({ page }) => {
    await openHome(page, { apple: 10, banana: 4 })
    await page.getByTestId('start-worlds').click()
    const worlds = page.getByTestId('world')
    await expect(worlds).toHaveCount(4)
    expect(await worlds.evaluateAll((els) => els.map((e) => e.getAttribute('data-world')))).toEqual(
      ['apple', 'banana', 'strawberry', 'orange'],
    )
    await expectProgressShown(page, 'apple', 10)
    await expect(worldButton(page, 'apple')).toHaveAttribute('data-state', 'done')
    await expectProgressShown(page, 'banana', 4)

    await worldButton(page, 'orange').click()
    await expect(page.getByTestId('level-map')).toHaveAttribute('data-world', 'orange')
    await expect(page.getByTestId('world-theme')).toHaveAttribute('data-world', 'orange')
  })

  test('CA3: estados de los nodos y nodos bloqueados sin efecto', async ({ page }) => {
    await openHome(page, { strawberry: 3 })
    await page.getByTestId('start-worlds').click()
    await worldButton(page, 'strawberry').click()
    const states = await page
      .getByTestId('level-node')
      .evaluateAll((els) => els.map((e) => e.getAttribute('data-state')))
    expect(states).toEqual(['done', 'done', 'done', 'next', ...Array(6).fill('locked')])

    await levelNode(page, 7).click({ force: true })
    await expect(page.getByTestId('level-map')).toBeVisible()
    await expect(page.getByTestId('challenge-scene')).toHaveCount(0)
    await expect(page.getByRole('alert')).toHaveCount(0)
  })

  test('CA3: los nodos caben sin scroll y miden al menos 96 px', async ({ page }) => {
    await openHome(page)
    await page.getByTestId('start-worlds').click()
    await worldButton(page, 'apple').click()
    const viewport = page.viewportSize()!
    for (const node of await page.getByTestId('level-node').all()) {
      const box = (await node.boundingBox())!
      expect(box.width).toBeGreaterThanOrEqual(96)
      expect(box.y).toBeGreaterThanOrEqual(0)
      expect(box.y + box.height).toBeLessThanOrEqual(viewport.height)
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
    }
  })

  test('CA4: los retos del mundo manzana usan 1–3, su fruta y su temática', async ({ page }) => {
    await openHome(page)
    await page.getByTestId('start-worlds').click()
    await worldButton(page, 'apple').click()
    for (let level = 1; level <= 4; level++) {
      await playLevel(page, level)
      await expect(page.getByTestId('world-theme')).toHaveAttribute('data-world', 'apple')
      await expect(page.getByTestId('fruit-picker')).toHaveCount(0)
      const scene = page.getByTestId('challenge-scene')
      expect(Number(await scene.getAttribute('data-target'))).toBeLessThanOrEqual(3)
      if ((await scene.getAttribute('data-kind')) === 'howMany') {
        const options = await page.getByTestId('option').allTextContents()
        expect(options.map(Number).sort()).toEqual([1, 2, 3])
        await expect(page.locator('[data-testid="slot"] img[data-fruit="apple"]')).not.toHaveCount(
          0,
        )
      }
      await solveCurrent(page)
      await expect(page.getByTestId('level-map')).toBeVisible({ timeout: 5000 })
    }
  })

  test('CA5: acertar completa el nodo y repetir no cambia el progreso', async ({ page }) => {
    await openHome(page, { apple: 2 })
    await page.getByTestId('start-worlds').click()
    await worldButton(page, 'apple').click()
    await playLevel(page, 3)
    await solveCurrent(page)
    await expect(page.getByTestId('level-map')).toBeVisible({ timeout: 5000 })
    await expect(levelNode(page, 3)).toHaveAttribute('data-state', 'done')
    await expect(levelNode(page, 4)).toHaveAttribute('data-state', 'next')
    expect((await getProgress(page)).apple).toBe(3)

    await playLevel(page, 1)
    await solveCurrent(page)
    await expect(page.getByTestId('level-map')).toBeVisible({ timeout: 5000 })
    expect((await getProgress(page)).apple).toBe(3)
  })

  test('CA6: completar el nivel 10 celebra el mundo y vuelve al selector', async ({ page }) => {
    await openHome(page, { apple: 9 })
    await page.getByTestId('start-worlds').click()
    await worldButton(page, 'apple').click()
    await playLevel(page, 10)
    await clearAudio(page)
    await solveCurrent(page)

    await expect.poll(() => celebrationKinds(page), { timeout: 8000 }).toContain('world')
    await expect.poll(() => audioClips(page), { timeout: 8000 }).toContain('worldDone')
    await expect(page.getByTestId('world-select')).toBeVisible({ timeout: WORLD_FLOW_TIMEOUT })
    await expect(worldButton(page, 'apple')).toHaveAttribute('data-state', 'done')
    expect(await celebrationKinds(page)).not.toContain('adventure')
  })
})

test.describe('Aventura', () => {
  test('CA7: solo el primer mundo sin completar está abierto', async ({ page }) => {
    await openHome(page)
    await page.getByTestId('start-adventure').click()
    const states = await page
      .getByTestId('adventure-world')
      .evaluateAll((els) => els.map((e) => e.getAttribute('data-state')))
    expect(states).toEqual(['next', 'locked', 'locked', 'locked'])

    await adventureWorld(page, 'orange').click({ force: true })
    await expect(page.getByTestId('adventure-path')).toBeVisible()
    await expect(page.getByTestId('level-map')).toHaveCount(0)
  })

  test('CA7: el progreso hecho en "Mundos" desbloquea en orden', async ({ page }) => {
    await openHome(page, { apple: 10, banana: 10, orange: 10 })
    await page.getByTestId('start-adventure').click()
    const states = await page
      .getByTestId('adventure-world')
      .evaluateAll((els) => els.map((e) => e.getAttribute('data-state')))
    expect(states).toEqual(['done', 'done', 'next', 'done'])
  })

  test('CA7: al completar un mundo se desbloquea y se abre el siguiente', async ({ page }) => {
    await openHome(page, { apple: 9 })
    await page.getByTestId('start-adventure').click()
    await adventureWorld(page, 'apple').click()
    await playLevel(page, 10)
    await solveCurrent(page)

    await expect.poll(() => celebrationKinds(page), { timeout: 8000 }).toContain('world')
    await expect(page.getByTestId('level-map')).toHaveAttribute('data-world', 'banana', {
      timeout: WORLD_FLOW_TIMEOUT,
    })
    await expect(levelNode(page, 1)).toHaveAttribute('data-state', 'next')
  })

  test('CA8: completar la naranja celebra la aventura', async ({ page }) => {
    await openHome(page, { apple: 10, banana: 10, strawberry: 10, orange: 9 })
    await page.getByTestId('start-adventure').click()
    await adventureWorld(page, 'orange').click()
    await playLevel(page, 10)
    await clearAudio(page)
    await solveCurrent(page)

    await expect
      .poll(() => celebrationKinds(page), { timeout: WORLD_FLOW_TIMEOUT })
      .toContain('adventure')
    await expect.poll(() => audioClips(page)).toContain('adventureDone')
    await expect(page.getByTestId('adventure-path')).toHaveAttribute('data-complete', 'true', {
      timeout: WORLD_FLOW_TIMEOUT,
    })
    const states = await page
      .getByTestId('adventure-world')
      .evaluateAll((els) => els.map((e) => e.getAttribute('data-state')))
    expect(states).toEqual(['done', 'done', 'done', 'done'])
  })
})

test.describe('Progreso', () => {
  test('CA9: se conserva al recargar la app', async ({ page }) => {
    await openHome(page, { banana: 6 })
    await page.reload()
    await page.getByTestId('start-worlds').click()
    await expectProgressShown(page, 'banana', 6)
  })

  test('CA9: con datos guardados inválidos empieza sin progreso y sin errores', async ({
    page,
  }) => {
    await page.goto('./')
    await setAvatar(page, 'apple')
    await page.evaluate(() => localStorage.setItem('contar-frutas:progress:v1', '{roto'))
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.reload()
    await page.getByTestId('start-worlds').click()
    for (const world of ['apple', 'banana', 'strawberry', 'orange'] as const) {
      await expectProgressShown(page, world, 0)
    }
    expect(errors).toEqual([])
  })

  test('CA10: reiniciar con confirmación borra todo, también al recargar', async ({ page }) => {
    await openHome(page, { apple: 10, banana: 4 })
    await page.getByTestId('start-worlds').click()
    await page.getByTestId('reset-progress').click()
    await expect(page.getByRole('alertdialog')).toBeVisible()
    await page.getByTestId('reset-confirm').click()
    await expect(page.getByRole('alertdialog')).toHaveCount(0)
    await expectProgressShown(page, 'apple', 0)
    await expectProgressShown(page, 'banana', 0)

    await page.reload()
    await page.getByTestId('start-worlds').click()
    await expectProgressShown(page, 'apple', 0)
  })

  test('CA10: cancelar el reinicio no cambia nada', async ({ page }) => {
    await openHome(page, { apple: 5 })
    await page.getByTestId('start-adventure').click()
    await page.getByTestId('reset-progress').click()
    await page.getByTestId('reset-cancel').click()
    expect((await getProgress(page)).apple).toBe(5)
  })

  test('CA10: el reinicio no se ofrece en el mapa ni en los retos', async ({ page }) => {
    await openHome(page)
    await page.getByTestId('start-worlds').click()
    await worldButton(page, 'apple').click()
    await expect(page.getByTestId('reset-progress')).toHaveCount(0)
    await playLevel(page, 1)
    await expect(page.getByTestId('reset-progress')).toHaveCount(0)
  })
})

test.describe('Navegación y voz', () => {
  test('CA11: "inicio" vuelve al menú desde el selector, la aventura, el mapa y un reto', async ({
    page,
  }) => {
    const home = async () => {
      await page.getByTestId('home').click()
      await expect(page.getByTestId('start-worlds')).toBeVisible()
    }
    await openHome(page)
    await page.getByTestId('start-worlds').click()
    await home()
    await page.getByTestId('start-adventure').click()
    await home()
    await page.getByTestId('start-worlds').click()
    await worldButton(page, 'banana').click()
    await home()
    await page.getByTestId('start-worlds').click()
    await worldButton(page, 'banana').click()
    await playLevel(page, 1)
    await home()
  })

  test('CA11: con la voz silenciada se completa un mundo sin ningún audio', async ({ page }) => {
    await openHome(page, { apple: 9 })
    await page.getByTestId('start-worlds').click()
    await page.getByTestId('voice-toggle').click()
    await worldButton(page, 'apple').click()
    await playLevel(page, 10)
    await clearAudio(page)
    await setChallenge(page, { kind: 'howMany', target: 2, options: [1, 2, 3] })
    await option(page, 2).click()
    await expect.poll(() => celebrationKinds(page), { timeout: 8000 }).toContain('world')
    await expect(page.getByTestId('world-select')).toBeVisible({ timeout: WORLD_FLOW_TIMEOUT })
    expect(await audioClips(page)).toEqual([])
  })
})
