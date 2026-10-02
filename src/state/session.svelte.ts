import type { AudioPort } from '../audio/audioService'
import { numberClip } from '../audio/manifest'
import { add, MAX_COUNT, MIN_COUNT, remove, type FrameEvent } from '../core/tenFrame'

export const FRUITS = ['apple', 'banana', 'strawberry', 'orange'] as const
export type Fruit = (typeof FRUITS)[number]

/** Pausa mínima entre números al contar; se alarga si la grabación es más larga. */
export const COUNT_STEP_MS = 750
const COUNT_GAP_MS = 150

/**
 * Estado de una sesión de juego. La cantidad solo cambia a través del núcleo
 * (src/core) y cada evento se traduce aquí en audio.
 */
export class Session {
  count = $state(MIN_COUNT)
  fruit = $state<Fruit>('apple')
  voiceOn = $state(true)
  /** Se incrementa cada vez que se llega a 10; la UI lo usa como clave de la celebración. */
  celebration = $state(0)
  /** Índice base 0 de la fruta que se está nombrando al contar, o null. */
  highlighted = $state<number | null>(null)

  private countTimer: ReturnType<typeof setTimeout> | undefined

  constructor(private readonly audio: AudioPort) {}

  get canAdd(): boolean {
    return this.count < MAX_COUNT
  }

  get canRemove(): boolean {
    return this.count > MIN_COUNT
  }

  add(): void {
    this.apply(add(this.count))
  }

  remove(): void {
    this.apply(remove(this.count))
  }

  /** Cuenta en voz alta de 1 a N resaltando cada fruta. */
  countAloud(): void {
    this.cancelCounting()
    if (this.count === MIN_COUNT) return
    const total = this.count
    const step = (i: number) => {
      if (i >= total) {
        this.highlighted = null
        this.countTimer = undefined
        return
      }
      this.highlighted = i
      const clip = numberClip(i + 1)
      this.audio.play(clip)
      const duration = this.audio.durationOf(clip)
      const wait = Math.max(COUNT_STEP_MS, duration ? duration * 1000 + COUNT_GAP_MS : 0)
      this.countTimer = setTimeout(() => step(i + 1), wait)
    }
    step(0)
  }

  setVoice(on: boolean): void {
    this.voiceOn = on
    this.audio.setMuted(!on)
  }

  setFruit(fruit: Fruit): void {
    this.fruit = fruit
  }

  private apply(result: { count: number; event: FrameEvent }): void {
    const { event } = result
    if (event.type === 'blockedFull') return
    this.cancelCounting()
    this.count = result.count
    switch (event.type) {
      case 'changed':
        this.audio.play(numberClip(event.count))
        break
      case 'reachedFull':
        this.celebration++
        this.audio.playSequence([numberClip(event.count), 'full'])
        break
      case 'blockedEmpty':
        this.audio.play('empty')
        break
    }
  }

  private cancelCounting(): void {
    if (this.countTimer !== undefined) clearTimeout(this.countTimer)
    this.countTimer = undefined
    this.highlighted = null
  }
}
