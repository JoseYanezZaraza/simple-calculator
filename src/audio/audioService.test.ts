import { beforeEach, describe, expect, it } from 'vitest'
import { AudioService } from './audioService'
import type { ClipId } from './manifest'

class FakeSource {
  buffer: { duration: number } | null = null
  onended: (() => void) | null = null
  startedAt: number | undefined
  stopped = false
  connect() {}
  start(when: number) {
    this.startedAt = when
  }
  stop() {
    this.stopped = true
    this.onended?.()
  }
}

class FakeContext {
  state = 'suspended'
  currentTime = 5
  sampleRate = 44100
  destination = {}
  sources: FakeSource[] = []
  resumes = 0
  createBuffer() {
    return { duration: 0 }
  }
  createBufferSource() {
    const s = new FakeSource()
    this.sources.push(s)
    return s
  }
  async resume() {
    this.resumes++
    this.state = 'running'
  }
  async decodeAudioData(data: ArrayBuffer) {
    // El "audio" falso codifica su duración en el primer byte (décimas de segundo).
    return { duration: new Uint8Array(data)[0] / 10 }
  }
}

const durations: Record<string, number> = { '1': 4, '2': 5, '10': 6, full: 12 }
const clips: ClipId[] = ['1', '2', '10', 'full']

function setup() {
  const ctx = new FakeContext()
  const service = new AudioService(
    () => ctx as unknown as AudioContext,
    async (url) => {
      const clip = url.match(/es\/(.+)\.m4a$/)![1]
      return new Uint8Array([durations[clip]]).buffer
    },
    clips,
  )
  return { ctx, service }
}

let ctx: FakeContext
let service: AudioService

beforeEach(async () => {
  ;({ ctx, service } = setup())
  await service.unlock()
  ctx.sources = []
})

describe('AudioService', () => {
  it('desbloquea el contexto y precarga todos los clips', () => {
    expect(ctx.state).toBe('running')
    expect(service.loadedCount).toBe(clips.length)
    expect(service.durationOf('full')).toBeCloseTo(1.2)
  })

  it('no reproduce nada antes de desbloquear', () => {
    const fresh = setup().service
    fresh.play('1')
    expect(fresh.log).toHaveLength(0)
  })

  it('un clip nuevo corta el que estaba sonando (voz única)', () => {
    service.play('1')
    service.play('2')
    const [first, second] = ctx.sources
    expect(first.stopped).toBe(true)
    expect(second.stopped).toBe(false)
    expect(service.log.map((e) => e.clip)).toEqual(['1', '2'])
  })

  it('encadena una secuencia sin solaparla', () => {
    service.playSequence(['10', 'full'])
    const [ten, full] = ctx.sources
    expect(ten.startedAt).toBe(5)
    expect(full.startedAt).toBeCloseTo(5.6)
  })

  it('stop corta toda la secuencia pendiente', () => {
    service.playSequence(['10', 'full'])
    service.stop()
    expect(ctx.sources.every((s) => s.stopped)).toBe(true)
  })

  it('silenciado no reproduce ni registra ningún clip (CA7)', () => {
    service.play('1')
    service.setMuted(true)
    expect(ctx.sources[0].stopped).toBe(true)
    service.play('2')
    service.playSequence(['10', 'full'])
    expect(ctx.sources).toHaveLength(1)
    expect(service.log.map((e) => e.clip)).toEqual(['1'])
  })

  it('vuelve a sonar al quitar el silencio', () => {
    service.setMuted(true)
    service.setMuted(false)
    service.play('2')
    expect(service.log.map((e) => e.clip)).toEqual(['2'])
  })

  it('reanuda el contexto si iOS lo suspende', () => {
    ctx.state = 'suspended'
    service.resume()
    expect(ctx.resumes).toBe(2)
  })

  it('un clip que no carga no rompe la precarga del resto', async () => {
    const ctx2 = new FakeContext()
    const s = new AudioService(
      () => ctx2 as unknown as AudioContext,
      async (url) => {
        if (url.includes('/2.m4a')) throw new Error('404')
        return new Uint8Array([3]).buffer
      },
      clips,
    )
    const warn = console.warn
    console.warn = () => {}
    await s.unlock()
    console.warn = warn
    expect(s.loadedCount).toBe(3)
  })
})
