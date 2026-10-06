import { describe, expect, it } from 'vitest'
import {
  DISTRACTOR_SPREAD,
  howManyOptions,
  isCorrect,
  nextChallenge,
  sameChallenge,
  type Challenge,
} from './challenges'
import { seededRandom } from './random'

const ITERATIONS = 1000

function run(seed: number, n = ITERATIONS): Challenge[] {
  const random = seededRandom(seed)
  const out: Challenge[] = []
  let previous: Challenge | null = null
  for (let i = 0; i < n; i++) {
    previous = nextChallenge(previous, random)
    out.push(previous)
  }
  return out
}

describe('nextChallenge', () => {
  it('genera objetivos enteros entre 1 y 10 de ambos tipos (CA2, CA5)', () => {
    const all = run(1)
    expect(all.every((c) => Number.isInteger(c.target) && c.target >= 1 && c.target <= 10)).toBe(
      true,
    )
    expect(new Set(all.map((c) => c.target)).size).toBe(10)
    const howMany = all.filter((c) => c.kind === 'howMany').length
    expect(howMany).toBeGreaterThan(ITERATIONS * 0.4)
    expect(howMany).toBeLessThan(ITERATIONS * 0.6)
  })

  it('nunca repite el reto anterior (CA7)', () => {
    for (const seed of [1, 2, 3, 42]) {
      const all = run(seed)
      for (let i = 1; i < all.length; i++) expect(sameChallenge(all[i - 1], all[i])).toBe(false)
    }
  })

  it('es reproducible con la misma semilla', () => {
    expect(run(7, 20)).toEqual(run(7, 20))
  })
})

describe('howManyOptions (CA2)', () => {
  it.each([1, 2, 5, 9, 10])('con N=%i da 3 opciones distintas, con N y distractores a ≤3', (n) => {
    const random = seededRandom(n)
    for (let i = 0; i < 200; i++) {
      const options = howManyOptions(n, random)
      expect(options).toHaveLength(3)
      expect(new Set(options).size).toBe(3)
      expect(options).toContain(n)
      for (const o of options) {
        expect(o).toBeGreaterThanOrEqual(1)
        expect(o).toBeLessThanOrEqual(10)
        expect(Math.abs(o - n)).toBeLessThanOrEqual(DISTRACTOR_SPREAD)
      }
    }
  })

  it('no coloca siempre la respuesta en la misma posición', () => {
    const random = seededRandom(3)
    const positions = new Set(
      Array.from({ length: 50 }, () => howManyOptions(5, random).indexOf(5)),
    )
    expect(positions.size).toBe(3)
  })
})

describe('isCorrect', () => {
  it('acepta solo el objetivo (CA3, CA4, CA6)', () => {
    const howMany: Challenge = { kind: 'howMany', target: 6, options: [4, 6, 8] }
    expect(isCorrect(howMany, 6)).toBe(true)
    expect(isCorrect(howMany, 8)).toBe(false)
    const put: Challenge = { kind: 'put', target: 4 }
    expect(isCorrect(put, 4)).toBe(true)
    expect(isCorrect(put, 0)).toBe(false)
  })
})

describe('rango del mundo (max)', () => {
  it.each([3, 5, 7, 10])('con max=%i todos los objetivos y opciones están en 1..max', (max) => {
    const random = seededRandom(max)
    let previous: Challenge | null = null
    const targets = new Set<number>()
    for (let i = 0; i < 500; i++) {
      const c: Challenge = nextChallenge(previous, random, max)
      targets.add(c.target)
      expect(c.target).toBeGreaterThanOrEqual(1)
      expect(c.target).toBeLessThanOrEqual(max)
      if (c.kind === 'howMany') {
        expect(new Set(c.options).size).toBe(3)
        for (const o of c.options) expect(o).toBeLessThanOrEqual(max)
      }
      expect(sameChallenge(previous, c)).toBe(false)
      previous = c
    }
    expect(targets.size).toBe(max)
  })

  it('con max=3 las opciones son siempre 1, 2 y 3', () => {
    const random = seededRandom(9)
    for (const target of [1, 2, 3]) {
      expect([...howManyOptions(target, random, 3)].sort()).toEqual([1, 2, 3])
    }
  })
})
