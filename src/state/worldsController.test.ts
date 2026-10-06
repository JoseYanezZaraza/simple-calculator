import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { seededRandom } from '../core/random'
import { emptyProgress, type Progress, type WorldId } from '../core/worlds'
import { FakeAudio } from '../test/fakeAudio'
import { SUCCESS_PAUSE_MS } from './challengeSession.svelte'
import { Preferences } from './preferences.svelte'
import { ProgressStore } from './progress.svelte'
import {
  UNLOCK_PAUSE_MS,
  WORLD_CELEBRATION_MS,
  WorldsController,
  type WorldsOrigin,
} from './worldsController.svelte'

let audio: FakeAudio
let store: ProgressStore

beforeEach(() => {
  vi.useFakeTimers()
  audio = new FakeAudio()
  store = new ProgressStore(null)
})

afterEach(() => {
  vi.useRealTimers()
})

function controller(origin: WorldsOrigin, progress: Partial<Progress> = {}) {
  store.set({ ...emptyProgress(), ...progress })
  return new WorldsController(audio, new Preferences(audio), store, origin, {
    random: seededRandom(3),
  })
}

/** Acierta el reto actual y espera la pausa de celebración. */
async function solve(c: WorldsController) {
  const game = c.game!
  const { challenge } = game
  if (challenge.kind === 'howMany') {
    game.choose(challenge.target)
  } else {
    for (let i = 0; i < challenge.target; i++) game.add()
    game.confirm()
  }
  vi.advanceTimersByTime(SUCCESS_PAUSE_MS)
}

async function playAndSolve(c: WorldsController, world: WorldId, level: number) {
  c.openWorld(world)
  c.playLevel(level)
  await solve(c)
}

describe('Mundos (libre)', () => {
  it('empieza en el selector y abre cualquier mundo (CA2)', () => {
    const c = controller('worlds')
    expect(c.screen).toEqual({ name: 'worlds' })
    c.openWorld('orange')
    expect(c.screen).toEqual({ name: 'levels', world: 'orange' })
  })

  it('no inicia niveles bloqueados (CA3)', () => {
    const c = controller('worlds', { strawberry: 3 })
    c.openWorld('strawberry')
    c.playLevel(7)
    expect(c.screen).toEqual({ name: 'levels', world: 'strawberry' })
    expect(c.game).toBeUndefined()
  })

  it('el reto usa el rango y la fruta del mundo (CA4)', () => {
    const c = controller('worlds')
    c.openWorld('apple')
    c.playLevel(1)
    expect(c.screen).toEqual({ name: 'challenge', world: 'apple', level: 1 })
    expect(c.game!.challenge.target).toBeLessThanOrEqual(3)
    expect(c.game!.frame.fruit).toBe('apple')
  })

  it('acertar completa el nivel y vuelve al mapa (CA5)', async () => {
    const c = controller('worlds', { apple: 2 })
    await playAndSolve(c, 'apple', 3)
    expect(store.progress.apple).toBe(3)
    expect(c.screen).toEqual({ name: 'levels', world: 'apple' })
  })

  it('repetir un nivel completado no cambia el progreso (CA5)', async () => {
    const c = controller('worlds', { apple: 5 })
    await playAndSolve(c, 'apple', 2)
    expect(store.progress.apple).toBe(5)
    expect(c.screen).toEqual({ name: 'levels', world: 'apple' })
  })

  it('niveles seguidos nunca repiten el reto anterior', async () => {
    const c = controller('worlds')
    let previous = null as { kind: string; target: number } | null
    for (let level = 1; level <= 10; level++) {
      c.openWorld('apple')
      c.playLevel(level)
      const { kind, target } = c.game!.challenge
      if (previous) expect(kind === previous.kind && target === previous.target).toBe(false)
      previous = { kind, target }
      await solve(c)
    }
  })

  it('completar el nivel 10 celebra el mundo y vuelve al selector (CA6)', async () => {
    const c = controller('worlds', { apple: 9 })
    await playAndSolve(c, 'apple', 10)
    expect(c.screen).toEqual({ name: 'worldComplete', world: 'apple' })
    expect(audio.played.at(-1)).toEqual(['worldDone'])
    vi.advanceTimersByTime(WORLD_CELEBRATION_MS)
    expect(c.screen).toEqual({ name: 'worlds' })
    expect(store.progress.apple).toBe(10)
  })

  it('completar los 4 mundos desde "Mundos" no celebra la aventura', async () => {
    const c = controller('worlds', { apple: 10, banana: 10, strawberry: 10, orange: 9 })
    await playAndSolve(c, 'orange', 10)
    vi.advanceTimersByTime(WORLD_CELEBRATION_MS)
    expect(c.screen).toEqual({ name: 'worlds' })
    expect(audio.played.flat()).not.toContain('adventureDone')
  })
})

describe('Aventura (lineal)', () => {
  it('empieza en el camino y bloquea los mundos posteriores (CA7)', () => {
    const c = controller('adventure')
    expect(c.screen).toEqual({ name: 'adventure' })
    c.openWorld('orange')
    expect(c.screen).toEqual({ name: 'adventure' })
    c.openWorld('apple')
    expect(c.screen).toEqual({ name: 'levels', world: 'apple' })
  })

  it('al completar un mundo desbloquea el siguiente y lo abre solo (CA7)', async () => {
    const c = controller('adventure', { apple: 9 })
    await playAndSolve(c, 'apple', 10)
    vi.advanceTimersByTime(WORLD_CELEBRATION_MS)
    expect(c.screen).toEqual({ name: 'adventure', unlocking: 'banana' })
    vi.advanceTimersByTime(UNLOCK_PAUSE_MS)
    expect(c.screen).toEqual({ name: 'levels', world: 'banana' })
  })

  it('el progreso hecho en "Mundos" cuenta en la aventura (CA7)', () => {
    const c = controller('adventure', { apple: 10, banana: 10 })
    expect(c.canOpen('strawberry')).toBe(true)
    expect(c.canOpen('orange')).toBe(false)
  })

  it('al completar la naranja celebra la aventura y vuelve al camino (CA8)', async () => {
    const c = controller('adventure', { apple: 10, banana: 10, strawberry: 10, orange: 9 })
    await playAndSolve(c, 'orange', 10)
    vi.advanceTimersByTime(WORLD_CELEBRATION_MS)
    expect(c.screen).toEqual({ name: 'adventureComplete' })
    expect(audio.played.at(-1)).toEqual(['adventureDone'])
    vi.advanceTimersByTime(WORLD_CELEBRATION_MS)
    expect(c.screen).toEqual({ name: 'adventure' })
  })
})

describe('inicio y voz (CA11)', () => {
  it('stop cancela las transiciones pendientes y el reto', async () => {
    const c = controller('adventure', { apple: 9 })
    await playAndSolve(c, 'apple', 10)
    c.stop()
    vi.advanceTimersByTime(WORLD_CELEBRATION_MS + UNLOCK_PAUSE_MS)
    expect(c.screen).toEqual({ name: 'worldComplete', world: 'apple' })
  })

  it('con la voz silenciada el flujo es igual sin audio', async () => {
    const prefs = new Preferences(audio)
    prefs.setVoice(false)
    store.set({ ...emptyProgress(), apple: 9 })
    const c = new WorldsController(audio, prefs, store, 'adventure', { random: seededRandom(1) })
    await playAndSolve(c, 'apple', 10)
    vi.advanceTimersByTime(WORLD_CELEBRATION_MS + UNLOCK_PAUSE_MS)
    expect(c.screen).toEqual({ name: 'levels', world: 'banana' })
    expect(audio.played).toEqual([])
  })
})
