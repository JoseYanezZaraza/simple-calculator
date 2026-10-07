import { describe, expect, it } from 'vitest'
import { emptyProgress } from '../core/worlds'
import { PROGRESS_KEY, ProgressStore, type ProgressStorage } from './progress.svelte'

class MemoryStorage implements ProgressStorage {
  data = new Map<string, string>()
  getItem(key: string) {
    return this.data.get(key) ?? null
  }
  setItem(key: string, value: string) {
    this.data.set(key, value)
  }
}

describe('ProgressStore', () => {
  it('empieza vacío sin datos guardados', () => {
    expect(new ProgressStore(new MemoryStorage()).progress).toEqual(emptyProgress())
  })

  it('guarda cada cambio y lo recupera en una nueva sesión (CA9)', () => {
    const storage = new MemoryStorage()
    const store = new ProgressStore(storage)
    store.complete('banana', 1)
    store.complete('banana', 2)
    expect(new ProgressStore(storage).progress.banana).toBe(2)
  })

  it('avisa al completar el mundo, solo una vez', () => {
    const store = new ProgressStore(new MemoryStorage())
    store.set({ ...emptyProgress(), apple: 9 })
    expect(store.complete('apple', 10)).toEqual({ advanced: true, worldCompleted: true })
    expect(store.complete('apple', 10)).toEqual({ advanced: false, worldCompleted: false })
  })

  it('repetir un nivel completado no escribe ni cambia nada (CA5)', () => {
    const storage = new MemoryStorage()
    const store = new ProgressStore(storage)
    store.set({ ...emptyProgress(), apple: 5 })
    const saved = storage.getItem(PROGRESS_KEY)
    store.complete('apple', 2)
    expect(store.progress.apple).toBe(5)
    expect(storage.getItem(PROGRESS_KEY)).toBe(saved)
  })

  it('con JSON corrupto empieza sin progreso (CA9)', () => {
    const storage = new MemoryStorage()
    storage.setItem(PROGRESS_KEY, '{no es json')
    expect(new ProgressStore(storage).progress).toEqual(emptyProgress())
  })

  it('con valores fuera de rango empieza sin progreso (CA9)', () => {
    const storage = new MemoryStorage()
    storage.setItem(PROGRESS_KEY, JSON.stringify({ version: 1, worlds: { apple: 99 } }))
    expect(new ProgressStore(storage).progress).toEqual(emptyProgress())
  })

  it('sin almacenamiento o si este lanza, funciona sin guardar (CA9)', () => {
    const throwing: ProgressStorage = {
      getItem: () => {
        throw new Error('SecurityError')
      },
      setItem: () => {
        throw new Error('QuotaExceededError')
      },
    }
    for (const storage of [null, throwing]) {
      const store = new ProgressStore(storage)
      expect(store.progress).toEqual(emptyProgress())
      expect(() => store.complete('apple', 1)).not.toThrow()
      expect(store.progress.apple).toBe(1)
    }
  })

  it('reset deja todo a 0, también guardado (CA10)', () => {
    const storage = new MemoryStorage()
    const store = new ProgressStore(storage)
    store.set({ apple: 10, banana: 4, strawberry: 0, orange: 0 })
    store.reset()
    expect(store.progress).toEqual(emptyProgress())
    expect(new ProgressStore(storage).progress).toEqual(emptyProgress())
  })
})
