import type { AudioPort } from '../audio/audioService'
import { numberClip, type ClipId } from '../audio/manifest'

/** Pausa mínima entre pasos; se alarga si la grabación es más larga. */
export const STEP_MS = 750
const STEP_GAP_MS = 150

export interface NarrationStep {
  /** Clips que suenan seguidos en este paso (p. ej. "Pon" + "cuatro"). */
  clips?: ClipId[]
  /** Índice base 0 de la fruta que se resalta durante el paso. */
  highlight?: number
  /** Opción de respuesta ("¿Cuántas hay?") que se resalta durante el paso. */
  option?: number
}

/** Pasos para contar en voz alta de 1 a `total` resaltando cada fruta. */
export function countSteps(total: number): NarrationStep[] {
  return Array.from({ length: total }, (_, i) => ({ clips: [numberClip(i + 1)], highlight: i }))
}

/**
 * Reproduce secuencias cancelables de voz y resaltado. Los tiempos no dependen de que el
 * audio suene: con la voz silenciada el resaltado avanza igual.
 */
export class Narrator {
  /** Índice base 0 de la fruta resaltada, o null. */
  highlighted = $state<number | null>(null)
  /** Opción de respuesta resaltada, o null. */
  option = $state<number | null>(null)

  private timer: ReturnType<typeof setTimeout> | undefined

  constructor(private readonly audio: AudioPort) {}

  get running(): boolean {
    return this.timer !== undefined
  }

  run(steps: NarrationStep[], onDone?: () => void): void {
    this.cancel()
    const play = (i: number) => {
      if (i >= steps.length) {
        this.clearMarks()
        this.timer = undefined
        onDone?.()
        return
      }
      const { clips = [], highlight, option } = steps[i]
      this.highlighted = highlight ?? null
      this.option = option ?? null
      if (clips.length) this.audio.playSequence(clips)
      this.timer = setTimeout(() => play(i + 1), this.stepDuration(clips))
    }
    play(0)
  }

  cancel(): void {
    if (this.timer !== undefined) clearTimeout(this.timer)
    this.timer = undefined
    this.clearMarks()
  }

  private clearMarks(): void {
    this.highlighted = null
    this.option = null
  }

  private stepDuration(clips: ClipId[]): number {
    const seconds = clips.reduce((sum, clip) => sum + (this.audio.durationOf(clip) ?? 0), 0)
    return Math.max(STEP_MS, seconds ? seconds * 1000 + STEP_GAP_MS : 0)
  }
}
