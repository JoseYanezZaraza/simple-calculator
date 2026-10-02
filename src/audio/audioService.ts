import { ALL_CLIPS, clipUrl, type ClipId } from './manifest'

/** Lo que la sesión necesita del audio; permite sustituirlo por un doble en los tests. */
export interface AudioPort {
  /** Reproduce un clip cortando lo que estuviera sonando. */
  play(clip: ClipId): void
  /** Reproduce varios clips seguidos cortando lo que estuviera sonando. */
  playSequence(clips: ClipId[]): void
  stop(): void
  setMuted(muted: boolean): void
  /** Duración en segundos, o undefined si aún no está cargado. */
  durationOf(clip: ClipId): number | undefined
}

export interface AudioLogEntry {
  clip: ClipId
  at: number
}

type Fetcher = (url: string) => Promise<ArrayBuffer>

const defaultFetcher: Fetcher = async (url) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`No se pudo cargar ${url}: ${res.status}`)
  return res.arrayBuffer()
}

/**
 * Voz única sobre Web Audio API: los clips se decodifican a buffers al desbloquear
 * y se reproducen con latencia mínima. Un clip nuevo siempre corta el anterior.
 */
export class AudioService implements AudioPort {
  /** Clips cuya reproducción se ha iniciado (solo para verificación en tests). */
  readonly log: AudioLogEntry[] = []
  private ctx: AudioContext | undefined
  private buffers = new Map<ClipId, AudioBuffer>()
  private active: AudioBufferSourceNode[] = []
  private muted = false
  private loading: Promise<void> | undefined

  constructor(
    private readonly createContext: () => AudioContext = () => new AudioContext(),
    private readonly fetcher: Fetcher = defaultFetcher,
    private readonly clips: ClipId[] = ALL_CLIPS,
  ) {}

  /**
   * DEBE llamarse de forma síncrona dentro de un gesto del usuario (requisito de iOS).
   * Crea o reanuda el contexto y lanza la precarga de los clips.
   */
  unlock(): Promise<void> {
    if (!this.ctx) {
      this.ctx = this.createContext()
      // Un buffer silencioso reproducido dentro del gesto termina de desbloquear iOS.
      const silent = this.ctx.createBuffer(1, 1, this.ctx.sampleRate)
      const node = this.ctx.createBufferSource()
      node.buffer = silent
      node.connect(this.ctx.destination)
      node.start(0)
    }
    this.resume()
    this.loading ??= this.loadAll()
    return this.loading
  }

  /** Reanuda el contexto si iOS lo suspendió (segundo plano, bloqueo de pantalla). */
  resume(): void {
    if (this.ctx && this.ctx.state !== 'running') void this.ctx.resume().catch(() => {})
  }

  get loadedCount(): number {
    return this.buffers.size
  }

  setMuted(muted: boolean): void {
    this.muted = muted
    if (muted) this.stop()
  }

  durationOf(clip: ClipId): number | undefined {
    return this.buffers.get(clip)?.duration
  }

  play(clip: ClipId): void {
    this.playSequence([clip])
  }

  playSequence(clips: ClipId[]): void {
    this.stop()
    if (this.muted || !this.ctx) return
    this.resume()
    let when = this.ctx.currentTime
    for (const clip of clips) {
      this.log.push({ clip, at: Date.now() })
      const buffer = this.buffers.get(clip)
      if (!buffer) continue
      const node = this.ctx.createBufferSource()
      node.buffer = buffer
      node.connect(this.ctx.destination)
      node.onended = () => {
        this.active = this.active.filter((n) => n !== node)
      }
      node.start(when)
      this.active.push(node)
      when += buffer.duration
    }
  }

  stop(): void {
    for (const node of this.active) {
      try {
        node.stop()
      } catch {
        // Ya había terminado.
      }
    }
    this.active = []
  }

  private async loadAll(): Promise<void> {
    const ctx = this.ctx!
    await Promise.all(
      this.clips.map(async (clip) => {
        try {
          const data = await this.fetcher(clipUrl(clip))
          this.buffers.set(clip, await ctx.decodeAudioData(data))
        } catch (err) {
          console.warn(`Audio "${clip}" no disponible`, err)
        }
      }),
    )
  }
}
