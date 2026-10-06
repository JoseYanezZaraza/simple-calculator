import type { AudioPort } from '../audio/audioService'
import { numberClip } from '../audio/manifest'
import { add, MAX_COUNT, MIN_COUNT, remove, type FrameEvent } from '../core/tenFrame'
import { countSteps, Narrator } from './narrator.svelte'
import { Preferences, type Fruit } from './preferences.svelte'

export { FRUITS, type Fruit } from './preferences.svelte'
/** Pausa mínima entre números al contar; se alarga si la grabación es más larga. */
export { STEP_MS as COUNT_STEP_MS } from './narrator.svelte'

export interface SessionOptions {
  /** Si llegar a 10 celebra y dice la frase de lleno (juego libre). En "Pon N" no. */
  celebrateFull?: boolean
  /** Fruta fija (la del mundo). Sin ella se usa la elegida por el adulto. */
  fruit?: Fruit
}

/**
 * Estado del marco de diez. La cantidad solo cambia a través del núcleo
 * (src/core) y cada evento se traduce aquí en audio.
 */
export class Session {
  count = $state(MIN_COUNT)
  /** Se incrementa cada vez que se llega a 10; la UI lo usa como clave de la celebración. */
  celebration = $state(0)
  readonly narrator: Narrator
  private readonly celebrateFull: boolean
  private readonly fixedFruit: Fruit | undefined

  constructor(
    private readonly audio: AudioPort,
    readonly preferences: Preferences = new Preferences(audio),
    { celebrateFull = true, fruit }: SessionOptions = {},
  ) {
    this.narrator = new Narrator(audio)
    this.celebrateFull = celebrateFull
    this.fixedFruit = fruit
  }

  get fruit(): Fruit {
    return this.fixedFruit ?? this.preferences.fruit
  }

  get voiceOn(): boolean {
    return this.preferences.voiceOn
  }

  /** Índice base 0 de la fruta que se está nombrando al contar, o null. */
  get highlighted(): number | null {
    return this.narrator.highlighted
  }

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

  /** Pone la cantidad sin locución (al preparar un reto). */
  reset(count: number = MIN_COUNT): void {
    this.narrator.cancel()
    this.count = count
  }

  /** Cuenta en voz alta de 1 a N resaltando cada fruta. */
  countAloud(): void {
    this.narrator.run(countSteps(this.count))
  }

  setVoice(on: boolean): void {
    this.preferences.setVoice(on)
  }

  setFruit(fruit: Fruit): void {
    this.preferences.setFruit(fruit)
  }

  private apply(result: { count: number; event: FrameEvent }): void {
    const { event } = result
    if (event.type === 'blockedFull') return
    this.narrator.cancel()
    this.count = result.count
    switch (event.type) {
      case 'changed':
        this.audio.play(numberClip(event.count))
        break
      case 'reachedFull':
        if (this.celebrateFull) {
          this.celebration++
          this.audio.playSequence([numberClip(event.count), 'full'])
        } else {
          this.audio.play(numberClip(event.count))
        }
        break
      case 'blockedEmpty':
        this.audio.play('empty')
        break
    }
  }
}
