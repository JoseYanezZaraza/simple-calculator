import { describe, expect, it } from 'vitest'
import { add, filledSlots, MAX_COUNT, remove, slotPosition } from './tenFrame'

describe('add', () => {
  it('incrementa la cantidad con espacio libre (CA1)', () => {
    expect(add(3)).toEqual({ count: 4, event: { type: 'changed', count: 4 } })
  })

  it('emite reachedFull al pasar de 9 a 10 (CA3)', () => {
    expect(add(9)).toEqual({ count: 10, event: { type: 'reachedFull', count: 10 } })
  })

  it('emite reachedFull cada vez que se vuelve a llegar a 10 (CA3)', () => {
    const first = add(9)
    const back = remove(first.count)
    expect(add(back.count).event.type).toBe('reachedFull')
  })

  it('no cambia la cantidad con el marco lleno (CA3)', () => {
    expect(add(MAX_COUNT)).toEqual({ count: 10, event: { type: 'blockedFull', count: 10 } })
  })
})

describe('remove', () => {
  it('decrementa la cantidad con frutas presentes (CA2)', () => {
    expect(remove(7)).toEqual({ count: 6, event: { type: 'changed', count: 6 } })
  })

  it('no cambia la cantidad con el marco vacío (CA4)', () => {
    expect(remove(0)).toEqual({ count: 0, event: { type: 'blockedEmpty', count: 0 } })
  })
})

describe('validación', () => {
  it.each([-1, 11, 2.5, NaN])('rechaza la cantidad inválida %s', (bad) => {
    expect(() => add(bad)).toThrow(RangeError)
    expect(() => remove(bad)).toThrow(RangeError)
    expect(() => filledSlots(bad)).toThrow(RangeError)
  })
})

describe('filledSlots (CA5)', () => {
  it('con 7 frutas llena la fila superior y 2 huecos de la inferior', () => {
    const slots = filledSlots(7)
    expect(slots.slice(0, 5)).toEqual([true, true, true, true, true])
    expect(slots.slice(5)).toEqual([true, true, false, false, false])
  })

  it('tras quitar dos y añadir una desde 6 ocupa exactamente los huecos 1 a 5', () => {
    let count = 6
    count = remove(count).count
    count = remove(count).count
    count = add(count).count
    expect(filledSlots(count)).toEqual([
      true,
      true,
      true,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
    ])
  })

  it('con cualquier cantidad ocupa exactamente los huecos 1..N', () => {
    for (let n = 0; n <= MAX_COUNT; n++) {
      const slots = filledSlots(n)
      expect(slots).toHaveLength(10)
      expect(slots.filter(Boolean)).toHaveLength(n)
      expect(slots.indexOf(false)).toBe(n === MAX_COUNT ? -1 : n)
    }
  })
})

describe('slotPosition', () => {
  it('coloca los huecos 0-4 en la fila superior y 5-9 en la inferior', () => {
    expect(slotPosition(0)).toEqual({ row: 0, col: 0 })
    expect(slotPosition(4)).toEqual({ row: 0, col: 4 })
    expect(slotPosition(5)).toEqual({ row: 1, col: 0 })
    expect(slotPosition(9)).toEqual({ row: 1, col: 4 })
  })
})
