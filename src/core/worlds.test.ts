import { describe, expect, it } from 'vitest'
import {
  completeLevel,
  emptyProgress,
  isAdventureComplete,
  isLevelPlayable,
  isWorldUnlocked,
  nextWorld,
  nodeState,
  parseProgress,
  WORLD_IDS,
  worldMax,
  type Progress,
} from './worlds'

const progress = (p: Partial<Progress>): Progress => ({ ...emptyProgress(), ...p })

describe('mundos', () => {
  it('son manzana, plátano, fresa y naranja con máximos 3/5/7/10', () => {
    expect(WORLD_IDS).toEqual(['apple', 'banana', 'strawberry', 'orange'])
    expect(WORLD_IDS.map(worldMax)).toEqual([3, 5, 7, 10])
    expect(nextWorld('apple')).toBe('banana')
    expect(nextWorld('orange')).toBeNull()
  })
})

describe('mapa de niveles (CA3)', () => {
  it('marca completados, siguiente y bloqueados', () => {
    const p = progress({ strawberry: 3 })
    const states = Array.from({ length: 10 }, (_, i) => nodeState(p, 'strawberry', i + 1))
    expect(states).toEqual(['done', 'done', 'done', 'next', ...Array(6).fill('locked')])
  })

  it('solo se juegan el siguiente y los completados', () => {
    const p = progress({ strawberry: 3 })
    expect(isLevelPlayable(p, 'strawberry', 2)).toBe(true)
    expect(isLevelPlayable(p, 'strawberry', 4)).toBe(true)
    expect(isLevelPlayable(p, 'strawberry', 7)).toBe(false)
    expect(isLevelPlayable(p, 'strawberry', 0)).toBe(false)
    expect(isLevelPlayable(p, 'strawberry', 11)).toBe(false)
  })

  it('con el mundo completo no hay nodo siguiente ni bloqueados', () => {
    const p = progress({ apple: 10 })
    expect(nodeState(p, 'apple', 10)).toBe('done')
    expect(isLevelPlayable(p, 'apple', 10)).toBe(true)
  })
})

describe('completeLevel (CA5)', () => {
  it('avanza al completar el siguiente', () => {
    expect(completeLevel(progress({ apple: 2 }), 'apple', 3).apple).toBe(3)
  })

  it('repetir un nivel completado no cambia el progreso', () => {
    const p = progress({ apple: 5 })
    expect(completeLevel(p, 'apple', 2)).toBe(p)
  })

  it('un nivel bloqueado no se puede completar', () => {
    const p = progress({ apple: 2 })
    expect(completeLevel(p, 'apple', 7)).toBe(p)
  })

  it('no modifica el progreso original', () => {
    const p = progress({ apple: 2 })
    completeLevel(p, 'apple', 3)
    expect(p.apple).toBe(2)
  })
})

describe('aventura (CA7, CA8)', () => {
  it('sin progreso solo está abierta la manzana', () => {
    const p = emptyProgress()
    expect(WORLD_IDS.map((w) => isWorldUnlocked(p, w))).toEqual([true, false, false, false])
  })

  it('el progreso hecho en "Mundos" desbloquea en orden', () => {
    const p = progress({ apple: 10, banana: 10 })
    expect(WORLD_IDS.map((w) => isWorldUnlocked(p, w))).toEqual([true, true, true, false])
  })

  it('completar un mundo posterior no salta el orden', () => {
    const p = progress({ orange: 10 })
    expect(isWorldUnlocked(p, 'banana')).toBe(false)
    expect(isAdventureComplete(p)).toBe(false)
  })

  it('está completa con los 4 mundos completos', () => {
    expect(
      isAdventureComplete(progress({ apple: 10, banana: 10, strawberry: 10, orange: 10 })),
    ).toBe(true)
  })
})

describe('parseProgress (CA9)', () => {
  it('acepta datos válidos', () => {
    expect(parseProgress({ version: 1, worlds: { apple: 4, banana: 10 } })).toEqual(
      progress({ apple: 4, banana: 10 }),
    )
  })

  it.each([
    null,
    'basura',
    42,
    { worlds: null },
    { worlds: { apple: 11 } },
    { worlds: { apple: -1 } },
    { worlds: { apple: 2.5 } },
    { worlds: { apple: '3' } },
  ])('con datos inválidos (%j) empieza sin progreso', (value) => {
    expect(parseProgress(value)).toEqual(emptyProgress())
  })

  it('ignora claves desconocidas', () => {
    expect(parseProgress({ worlds: { apple: 1, kiwi: 9 } })).toEqual(progress({ apple: 1 }))
  })
})
