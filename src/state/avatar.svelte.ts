import { FRUITS, type Fruit } from './preferences.svelte'
import { browserStorage, type ProgressStorage } from './progress.svelte'

/** Clave propia: reiniciar el progreso no debe tocar el avatar. */
export const AVATAR_KEY = 'contar-frutas:avatar:v1'

function isFruit(value: unknown): value is Fruit {
  return typeof value === 'string' && (FRUITS as readonly string[]).includes(value)
}

/**
 * Avatar elegido por la niña, guardado en el dispositivo. Nunca lanza: si el almacenamiento
 * falta, falla o tiene un valor desconocido, se pide elegir y se juega sin guardar.
 */
export class AvatarStore {
  avatar = $state<Fruit | null>(null)

  constructor(private readonly storage: ProgressStorage | null = browserStorage()) {
    this.avatar = this.load()
  }

  set(avatar: Fruit): void {
    this.avatar = avatar
    try {
      this.storage?.setItem(AVATAR_KEY, avatar)
    } catch {
      // Almacenamiento bloqueado o lleno: el avatar vale para esta sesión.
    }
  }

  private load(): Fruit | null {
    try {
      const value = this.storage?.getItem(AVATAR_KEY)
      return isFruit(value) ? value : null
    } catch {
      return null
    }
  }
}
