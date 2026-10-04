import type { AudioPort } from '../audio/audioService'
import type { ClipId } from '../audio/manifest'

/** Doble de audio que registra lo que se pidió reproducir, respetando el silencio. */
export class FakeAudio implements AudioPort {
  played: ClipId[][] = []
  muted = false
  stops = 0
  durations: Partial<Record<ClipId, number>> = {}
  play(clip: ClipId) {
    this.playSequence([clip])
  }
  playSequence(clips: ClipId[]) {
    if (!this.muted) this.played.push(clips)
  }
  stop() {
    this.stops++
  }
  setMuted(muted: boolean) {
    this.muted = muted
  }
  durationOf(clip: ClipId) {
    return this.durations[clip]
  }
}
