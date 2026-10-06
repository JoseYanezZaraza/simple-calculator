import type { AudioPort } from '../audio/audioService'
import { numberClip, type ClipId } from '../audio/manifest'
import { isCorrect, MAX_TARGET, nextChallenge, type Challenge } from '../core/challenges'
import type { Random } from '../core/random'
import { MIN_COUNT } from '../core/tenFrame'
import { countSteps, type NarrationStep } from './narrator.svelte'
import { Preferences, type Fruit } from './preferences.svelte'
import { Session } from './session.svelte'

/** Pausa tras un acierto antes de avisar con `onSolved` (vuelta al mapa). */
export const SUCCESS_PAUSE_MS = 2000

export type ChallengePhase = 'asking' | 'celebrating'

export interface ChallengeOptions {
  /** Máximo del rango del mundo (1..max). */
  max?: number
  /** Fruta del mundo. */
  fruit?: Fruit
  random?: Random
  /** Se llama tras la celebración de un acierto. */
  onSolved?: () => void
}

/**
 * Un reto de un nivel: "¿Cuántas hay?" o "Pon N frutas". Nunca hay error: una respuesta
 * no correcta lleva a contar juntos y repetir la pregunta del mismo reto.
 */
export class ChallengeSession {
  challenge = $state<Challenge>({ kind: 'put', target: 1 })
  phase = $state<ChallengePhase>('asking')
  /** Se incrementa en cada acierto; la UI lo usa como clave de la celebración. */
  celebration = $state(0)
  /** Marco de diez del reto; en "Pon N" llegar a 10 no celebra. */
  readonly frame: Session
  private solvedTimer: ReturnType<typeof setTimeout> | undefined
  private readonly max: number
  private readonly random: Random
  private readonly onSolved: (() => void) | undefined

  constructor(
    private readonly audio: AudioPort,
    preferences: Preferences = new Preferences(audio),
    { max = MAX_TARGET, fruit, random = Math.random, onSolved }: ChallengeOptions = {},
  ) {
    this.frame = new Session(audio, preferences, { celebrateFull: false, fruit })
    this.max = max
    this.random = random
    this.onSolved = onSolved
  }

  get preferences(): Preferences {
    return this.frame.preferences
  }

  get highlighted(): number | null {
    return this.frame.highlighted
  }

  /** Opción resaltada mientras suena su número, o null. */
  get spokenOption(): number | null {
    return this.frame.narrator.option
  }

  get accepting(): boolean {
    return this.phase === 'asking'
  }

  /**
   * Empieza con un reto al azar del rango, distinto de `previous`. Con `ask = false` no hace
   * aún la pregunta (la app la hace cuando los audios han terminado de cargar).
   */
  start(previous: Challenge | null = null, ask = true): void {
    this.set(nextChallenge(previous, this.random, this.max), ask)
  }

  /** Muestra `challenge` y hace su pregunta. */
  set(challenge: Challenge, ask = true): void {
    this.clearSolved()
    this.challenge = challenge
    this.phase = 'asking'
    this.frame.reset(challenge.kind === 'howMany' ? challenge.target : MIN_COUNT)
    if (ask) this.ask()
  }

  /** Vuelve a hacer la pregunta del reto actual. */
  ask(): void {
    if (!this.accepting) return
    this.frame.narrator.run([{ clips: this.questionClips() }])
  }

  /** "¿Cuántas hay?": la niña toca una opción. */
  choose(option: number): void {
    if (!this.accepting || this.challenge.kind !== 'howMany') return
    this.evaluate(option)
  }

  /**
   * "¿Cuántas hay?": dice el número de una opción y la resalta. No es una respuesta:
   * el reto sigue igual. Cancela la narración en curso, como cualquier otro toque.
   */
  sayOption(option: number): void {
    if (!this.accepting || this.challenge.kind !== 'howMany') return
    this.frame.narrator.run([{ clips: [numberClip(option)], option }])
  }

  /** "Pon N": la niña confirma con ✓. */
  confirm(): void {
    if (!this.accepting || this.challenge.kind !== 'put') return
    this.evaluate(this.frame.count)
  }

  add(): void {
    if (this.accepting && this.challenge.kind === 'put') this.frame.add()
  }

  remove(): void {
    if (this.accepting && this.challenge.kind === 'put') this.frame.remove()
  }

  tapFruit(): void {
    if (this.accepting) this.frame.countAloud()
  }

  /** Detiene temporizadores, narración y audio (al volver al inicio). */
  stop(): void {
    this.clearSolved()
    this.frame.narrator.cancel()
    this.audio.stop()
  }

  private evaluate(answer: number): void {
    if (isCorrect(this.challenge, answer)) {
      this.frame.narrator.cancel()
      this.phase = 'celebrating'
      this.celebration++
      this.audio.play('wellDone')
      this.solvedTimer = setTimeout(() => {
        this.solvedTimer = undefined
        this.onSolved?.()
      }, SUCCESS_PAUSE_MS)
    } else {
      this.frame.narrator.run(this.retrySteps())
    }
  }

  /** "¡Vamos a contarlas!", conteo de las frutas del marco y la pregunta otra vez. */
  private retrySteps(): NarrationStep[] {
    return [
      { clips: ['letsCount'] },
      ...countSteps(this.frame.count),
      { clips: this.questionClips() },
    ]
  }

  private questionClips(): ClipId[] {
    return this.challenge.kind === 'howMany'
      ? ['howMany']
      : ['put', numberClip(this.challenge.target)]
  }

  private clearSolved(): void {
    if (this.solvedTimer !== undefined) clearTimeout(this.solvedTimer)
    this.solvedTimer = undefined
  }
}
