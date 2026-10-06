import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FakeAudio } from '../test/fakeAudio'
import { countSteps, Narrator, STEP_MS } from './narrator.svelte'

let audio: FakeAudio
let narrator: Narrator

beforeEach(() => {
  vi.useFakeTimers()
  audio = new FakeAudio()
  narrator = new Narrator(audio)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Narrator', () => {
  it('reproduce los pasos en orden resaltando cada fruta', () => {
    const done = vi.fn()
    narrator.run(countSteps(3), done)
    expect(narrator.highlighted).toBe(0)
    vi.advanceTimersByTime(STEP_MS)
    expect(narrator.highlighted).toBe(1)
    vi.advanceTimersByTime(STEP_MS * 2)
    expect(narrator.highlighted).toBeNull()
    expect(narrator.running).toBe(false)
    expect(done).toHaveBeenCalledOnce()
    expect(audio.played).toEqual([['1'], ['2'], ['3']])
  })

  it('encadena los clips de un paso y espera la suma de sus duraciones', () => {
    audio.durations = { put: 0.4, '4': 0.6 }
    narrator.run([{ clips: ['put', '4'] }, { clips: ['1'], highlight: 0 }])
    expect(audio.played).toEqual([['put', '4']])
    vi.advanceTimersByTime(1100)
    expect(narrator.highlighted).toBeNull()
    vi.advanceTimersByTime(50)
    expect(narrator.highlighted).toBe(0)
  })

  it('cancel detiene la secuencia y quita el resaltado', () => {
    const done = vi.fn()
    narrator.run(countSteps(5), done)
    narrator.cancel()
    vi.advanceTimersByTime(STEP_MS * 10)
    expect(narrator.highlighted).toBeNull()
    expect(audio.played).toEqual([['1']])
    expect(done).not.toHaveBeenCalled()
  })

  it('una nueva secuencia sustituye a la anterior', () => {
    narrator.run(countSteps(5))
    narrator.run([{ clips: ['howMany'] }])
    vi.advanceTimersByTime(STEP_MS * 10)
    expect(audio.played).toEqual([['1'], ['howMany']])
  })

  it('con la voz silenciada mantiene los mismos tiempos de resaltado', () => {
    audio.muted = true
    narrator.run(countSteps(2))
    expect(narrator.highlighted).toBe(0)
    vi.advanceTimersByTime(STEP_MS)
    expect(narrator.highlighted).toBe(1)
    expect(audio.played).toEqual([])
  })

  it('resalta la opción del paso y la limpia al terminar o cancelar', () => {
    narrator.run([{ clips: ['8'], option: 8 }])
    expect(narrator.option).toBe(8)
    expect(narrator.highlighted).toBeNull()
    vi.advanceTimersByTime(STEP_MS)
    expect(narrator.option).toBeNull()

    narrator.run([{ clips: ['4'], option: 4 }])
    narrator.cancel()
    expect(narrator.option).toBeNull()
  })
})
