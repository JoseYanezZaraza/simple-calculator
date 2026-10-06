import { describe, expect, it } from 'vitest'
import { AVATAR_KEY, AvatarStore } from './avatar.svelte'
import type { ProgressStorage } from './progress.svelte'

class MemoryStorage implements ProgressStorage {
  data = new Map<string, string>()
  getItem(key: string) {
    return this.data.get(key) ?? null
  }
  setItem(key: string, value: string) {
    this.data.set(key, value)
  }
}

describe('AvatarStore', () => {
  it('sin avatar guardado empieza en null (CA1)', () => {
    expect(new AvatarStore(new MemoryStorage()).avatar).toBeNull()
  })

  it('guarda el avatar y lo recupera en una nueva sesión (CA2)', () => {
    const storage = new MemoryStorage()
    new AvatarStore(storage).set('strawberry')
    expect(new AvatarStore(storage).avatar).toBe('strawberry')
  })

  it('un valor desconocido se trata como sin avatar (CA2)', () => {
    const storage = new MemoryStorage()
    storage.setItem(AVATAR_KEY, 'kiwi')
    expect(new AvatarStore(storage).avatar).toBeNull()
  })

  it('si el almacenamiento falla, el avatar vale para la sesión sin errores (CA2)', () => {
    const throwing: ProgressStorage = {
      getItem: () => {
        throw new Error('SecurityError')
      },
      setItem: () => {
        throw new Error('QuotaExceededError')
      },
    }
    for (const storage of [null, throwing]) {
      const store = new AvatarStore(storage)
      expect(store.avatar).toBeNull()
      expect(() => store.set('orange')).not.toThrow()
      expect(store.avatar).toBe('orange')
    }
  })

  it('usa una clave distinta de la del progreso (CA7)', () => {
    expect(AVATAR_KEY).not.toBe('contar-frutas:progress:v1')
  })
})
