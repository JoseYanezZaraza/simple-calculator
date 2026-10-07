import type { AudioPort } from '../audio/audioService'
import type { Challenge } from '../core/challenges'
import type { Random } from '../core/random'
import {
  isAdventureComplete,
  isLevelPlayable,
  isWorldUnlocked,
  nextWorld,
  worldMax,
  type WorldId,
} from '../core/worlds'
import { AvatarStore } from './avatar.svelte'
import { ChallengeSession } from './challengeSession.svelte'
import type { Fruit, Preferences } from './preferences.svelte'
import type { ProgressStore } from './progress.svelte'

/** Duración de la celebración de mundo o de aventura antes de seguir. */
export const WORLD_CELEBRATION_MS = 3500
/** En la aventura: pausa mostrando el desbloqueo antes de abrir el siguiente mundo. */
export const UNLOCK_PAUSE_MS = 2500

/** "Mundos" (todos abiertos) o "Aventura" (lineal, con bloqueo). */
export type WorldsOrigin = 'worlds' | 'adventure'

export type WorldsScreen =
  | { name: 'avatarPicker'; then: WorldsOrigin }
  | { name: 'worlds' }
  /** `hopFrom`: mundo completado desde el que salta el avatar al desbloqueado. */
  | { name: 'adventure'; unlocking?: WorldId; hopFrom?: WorldId }
  /** `hopFrom`: nivel recién completado desde el que salta el avatar al siguiente. */
  | { name: 'levels'; world: WorldId; hopFrom?: number }
  | { name: 'challenge'; world: WorldId; level: number }
  | { name: 'worldComplete'; world: WorldId }
  | { name: 'adventureComplete' }

export interface WorldsControllerOptions {
  /** Avatar elegido; sin él, la primera pantalla es "¿Quién te acompaña?". */
  avatar?: AvatarStore
  random?: Random
  /** Se resuelve cuando los audios están cargados; la primera pregunta espera a ello. */
  audioReady?: Promise<unknown>
}

/**
 * Navegación de "Mundos" y "Aventura": selector o camino, mapa de niveles, reto y
 * celebraciones. El progreso vive en ProgressStore; aquí solo se decide qué pantalla toca.
 */
export class WorldsController {
  screen = $state<WorldsScreen>({ name: 'worlds' })
  game = $state.raw<ChallengeSession | undefined>()
  /** Último reto jugado en la sesión: el siguiente nivel no lo repite. */
  private lastChallenge: Challenge | null = null
  private timer: ReturnType<typeof setTimeout> | undefined
  private readonly random: Random
  private readonly audioReady: Promise<unknown>
  readonly avatar: AvatarStore

  constructor(
    private readonly audio: AudioPort,
    readonly preferences: Preferences,
    readonly progress: ProgressStore,
    readonly origin: WorldsOrigin,
    {
      avatar = new AvatarStore(null),
      random = Math.random,
      audioReady = Promise.resolve(),
    }: WorldsControllerOptions = {},
  ) {
    this.random = random
    this.audioReady = audioReady
    this.avatar = avatar
    if (avatar.avatar === null) {
      this.showAvatarPicker(origin)
    } else {
      this.screen = origin === 'worlds' ? { name: 'worlds' } : { name: 'adventure' }
    }
  }

  /** Desde el selector o el camino: cambiar de avatar. */
  openAvatarPicker(): void {
    const s = this.screen
    if (s.name !== 'worlds' && s.name !== 'adventure') return
    this.clearTimer()
    this.showAvatarPicker(s.name)
  }

  chooseAvatar(fruit: Fruit): void {
    const s = this.screen
    if (s.name !== 'avatarPicker') return
    this.avatar.set(fruit)
    this.screen = s.then === 'worlds' ? { name: 'worlds' } : { name: 'adventure' }
  }

  private showAvatarPicker(then: WorldsOrigin): void {
    this.screen = { name: 'avatarPicker', then }
    void this.audioReady.then(() => {
      if (this.screen.name === 'avatarPicker') this.audio.play('chooseAvatar')
    })
  }

  /** Mundo cuya temática se muestra, o null en el selector y el camino. */
  get world(): WorldId | null {
    const s = this.screen
    return 'world' in s ? s.world : null
  }

  canOpen(world: WorldId): boolean {
    return this.origin === 'worlds' || isWorldUnlocked(this.progress.progress, world)
  }

  openWorld(world: WorldId): void {
    if (!this.canOpen(world)) return
    this.clearTimer()
    this.screen = { name: 'levels', world }
  }

  playLevel(level: number): void {
    const s = this.screen
    if (s.name !== 'levels' || !isLevelPlayable(this.progress.progress, s.world, level)) return
    const world = s.world
    const game = new ChallengeSession(this.audio, this.preferences, {
      max: worldMax(world),
      fruit: world,
      random: this.random,
      onSolved: () => this.levelSolved(world, level),
    })
    game.start(this.lastChallenge, false)
    this.lastChallenge = game.challenge
    this.game = game
    this.screen = { name: 'challenge', world, level }
    void this.audioReady.then(() => {
      if (this.game === game) game.ask()
    })
  }

  /** Detiene temporizadores y audio (al volver al inicio). */
  stop(): void {
    this.clearTimer()
    this.game?.stop()
    this.game = undefined
  }

  private levelSolved(world: WorldId, level: number): void {
    this.game = undefined
    const { advanced, worldCompleted } = this.progress.complete(world, level)
    if (!worldCompleted) {
      // El avatar salta solo si se avanzó; repetir un nivel completado no lo mueve.
      this.screen = advanced ? { name: 'levels', world, hopFrom: level } : { name: 'levels', world }
      return
    }
    this.screen = { name: 'worldComplete', world }
    this.audio.play('worldDone')
    this.timer = setTimeout(() => this.afterWorld(world), WORLD_CELEBRATION_MS)
  }

  private afterWorld(world: WorldId): void {
    if (this.origin === 'worlds') {
      this.screen = { name: 'worlds' }
      return
    }
    const next = nextWorld(world)
    if (!next) {
      if (isAdventureComplete(this.progress.progress)) {
        this.screen = { name: 'adventureComplete' }
        this.audio.play('adventureDone')
        this.timer = setTimeout(() => (this.screen = { name: 'adventure' }), WORLD_CELEBRATION_MS)
      } else {
        this.screen = { name: 'adventure' }
      }
      return
    }
    this.screen = { name: 'adventure', unlocking: next, hopFrom: world }
    this.timer = setTimeout(() => this.openWorld(next), UNLOCK_PAUSE_MS)
  }

  private clearTimer(): void {
    if (this.timer !== undefined) clearTimeout(this.timer)
    this.timer = undefined
  }
}
