import {
  completeLevel,
  emptyProgress,
  isWorldComplete,
  parseProgress,
  type Progress,
  type WorldId,
} from '../core/worlds'

export const PROGRESS_KEY = 'contar-frutas:progress:v1'

/** Lo que necesitamos del almacenamiento; permite un doble en los tests. */
export type ProgressStorage = Pick<Storage, 'getItem' | 'setItem'>

/** localStorage, o null si el navegador lo bloquea (modo privado, permisos). */
export function browserStorage(): ProgressStorage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

/**
 * Progreso de los mundos guardado en el dispositivo. Nunca lanza: si el almacenamiento falta,
 * falla o tiene datos inválidos, se juega sin progreso previo.
 */
export class ProgressStore {
  progress = $state<Progress>(emptyProgress())

  constructor(private readonly storage: ProgressStorage | null = browserStorage()) {
    this.progress = this.load()
  }

  /**
   * Completa `level` si es el siguiente. Indica si hubo avance (repetir un nivel completado
   * no avanza) y si con ello se completó el mundo.
   */
  complete(world: WorldId, level: number): { advanced: boolean; worldCompleted: boolean } {
    const before = this.progress
    const after = completeLevel(before, world, level)
    if (after === before) return { advanced: false, worldCompleted: false }
    this.set(after)
    return { advanced: true, worldCompleted: isWorldComplete(after, world) }
  }

  reset(): void {
    this.set(emptyProgress())
  }

  set(progress: Progress): void {
    this.progress = progress
    try {
      this.storage?.setItem(PROGRESS_KEY, JSON.stringify({ version: 1, worlds: progress }))
    } catch {
      // Cuota llena o almacenamiento bloqueado: se sigue jugando sin guardar.
    }
  }

  private load(): Progress {
    try {
      const raw = this.storage?.getItem(PROGRESS_KEY)
      return raw ? parseProgress(JSON.parse(raw)) : emptyProgress()
    } catch {
      return emptyProgress()
    }
  }
}
